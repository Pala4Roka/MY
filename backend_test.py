#!/usr/bin/env python3
"""
Backend API Testing for SCP Eternal Sentinels
Tests all critical backend endpoints with proper authentication and clearance levels.
"""

import requests
import json
import uuid
from datetime import datetime
import sys
import os

# Backend URL from frontend/.env
BACKEND_URL = "https://anomaly-research.preview.emergentagent.com/api"

# Test credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

class SCPBackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.test_user_token = None
        self.test_session_id = str(uuid.uuid4())
        self.results = {
            "auth": {},
            "scp_objects": {},
            "chat": {},
            "admin": {},
            "errors": []
        }
    
    def log_result(self, category, test_name, success, details="", error=None):
        """Log test result"""
        result = {
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        if error:
            result["error"] = str(error)
            self.results["errors"].append(f"{category}.{test_name}: {error}")
        
        self.results[category][test_name] = result
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {category}.{test_name}: {details}")
        if error:
            print(f"   Error: {error}")
    
    def test_auth_login(self):
        """Test admin login"""
        try:
            response = self.session.post(
                f"{BACKEND_URL}/auth/login",
                json={
                    "username": ADMIN_USERNAME,
                    "password": ADMIN_PASSWORD
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.admin_token = data["access_token"]
                    user = data["user"]
                    
                    # Verify admin has clearance level 5
                    if user.get("clearance_level") == 5:
                        self.log_result("auth", "login", True, 
                                      f"Admin login successful, clearance level: {user['clearance_level']}")
                        return True
                    else:
                        self.log_result("auth", "login", False, 
                                      f"Admin clearance level incorrect: {user.get('clearance_level')}")
                        return False
                else:
                    self.log_result("auth", "login", False, "Missing token or user in response")
                    return False
            else:
                self.log_result("auth", "login", False, 
                              f"Login failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("auth", "login", False, "Login request failed", e)
            return False
    
    def test_auth_register(self):
        """Test user registration"""
        try:
            test_username = f"testuser_{uuid.uuid4().hex[:8]}"
            response = self.session.post(
                f"{BACKEND_URL}/auth/register",
                json={
                    "username": test_username,
                    "password": "testpass123",
                    "clearance_level": 2
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.test_user_token = data["access_token"]
                    user = data["user"]
                    self.log_result("auth", "register", True, 
                                  f"User registration successful, clearance level: {user['clearance_level']}")
                    return True
                else:
                    self.log_result("auth", "register", False, "Missing token or user in response")
                    return False
            else:
                self.log_result("auth", "register", False, 
                              f"Registration failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("auth", "register", False, "Registration request failed", e)
            return False
    
    def test_auth_me(self):
        """Test getting current user info"""
        if not self.admin_token:
            self.log_result("auth", "me", False, "No admin token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{BACKEND_URL}/auth/me", headers=headers)
            
            if response.status_code == 200:
                user = response.json()
                if user.get("username") == ADMIN_USERNAME and user.get("clearance_level") == 5:
                    self.log_result("auth", "me", True, 
                                  f"User info correct: {user['username']}, level {user['clearance_level']}")
                    return True
                else:
                    self.log_result("auth", "me", False, 
                                  f"User info incorrect: {user}")
                    return False
            else:
                self.log_result("auth", "me", False, 
                              f"Get user info failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("auth", "me", False, "Get user info request failed", e)
            return False
    
    def test_scp_objects_list(self):
        """Test getting SCP objects list with admin clearance"""
        if not self.admin_token:
            self.log_result("scp_objects", "list", False, "No admin token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{BACKEND_URL}/scp", headers=headers)
            
            if response.status_code == 200:
                objects = response.json()
                
                # Check if we have 21 objects as expected
                if len(objects) == 21:
                    # Check if admin can see secret data (clearance level 5)
                    secret_visible = any(
                        obj.get("secret_data") and obj["secret_data"] != "[ТРЕБУЕТСЯ УРОВЕНЬ ДОПУСКА 5]"
                        for obj in objects
                    )
                    
                    self.log_result("scp_objects", "list", True, 
                                  f"Retrieved {len(objects)} objects, secret data visible: {secret_visible}")
                    return True
                else:
                    self.log_result("scp_objects", "list", False, 
                                  f"Expected 21 objects, got {len(objects)}")
                    return False
            else:
                self.log_result("scp_objects", "list", False, 
                              f"Get objects failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("scp_objects", "list", False, "Get objects request failed", e)
            return False
    
    def test_scp_object_detail(self):
        """Test getting specific SCP object (MAL0 - 0051)"""
        if not self.admin_token:
            self.log_result("scp_objects", "detail", False, "No admin token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{BACKEND_URL}/scp/0051", headers=headers)
            
            if response.status_code == 200:
                obj = response.json()
                
                # Verify this is MAL0
                if obj.get("number") == "0051" and "MAL0" in obj.get("name", ""):
                    # Check if secret data is visible for admin
                    secret_visible = (obj.get("secret_data") and 
                                    obj["secret_data"] != "[ТРЕБУЕТСЯ УРОВЕНЬ ДОПУСКА 5]")
                    
                    self.log_result("scp_objects", "detail", True, 
                                  f"MAL0 object retrieved, secret data visible: {secret_visible}")
                    return True
                else:
                    self.log_result("scp_objects", "detail", False, 
                                  f"Object details incorrect: {obj.get('number')}, {obj.get('name')}")
                    return False
            else:
                self.log_result("scp_objects", "detail", False, 
                              f"Get object detail failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("scp_objects", "detail", False, "Get object detail request failed", e)
            return False
    
    def test_clearance_filtering(self):
        """Test clearance level filtering with test user (level 2)"""
        if not self.test_user_token:
            self.log_result("scp_objects", "clearance_filtering", False, "No test user token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.test_user_token}"}
            response = self.session.get(f"{BACKEND_URL}/scp", headers=headers)
            
            if response.status_code == 200:
                objects = response.json()
                
                # Level 2 user should only see Threat class objects
                threat_only = all(obj.get("threat_class") == "Threat" for obj in objects)
                
                # Secret data should be hidden
                secret_hidden = all(
                    obj.get("secret_data") == "[ТРЕБУЕТСЯ УРОВЕНЬ ДОПУСКА 5]"
                    for obj in objects if obj.get("secret_data")
                )
                
                if threat_only and secret_hidden:
                    self.log_result("scp_objects", "clearance_filtering", True, 
                                  f"Level 2 user sees {len(objects)} Threat objects, secrets hidden")
                    return True
                else:
                    self.log_result("scp_objects", "clearance_filtering", False, 
                                  f"Clearance filtering failed: threat_only={threat_only}, secret_hidden={secret_hidden}")
                    return False
            else:
                self.log_result("scp_objects", "clearance_filtering", False, 
                              f"Clearance test failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("scp_objects", "clearance_filtering", False, "Clearance filtering test failed", e)
            return False
    
    def test_chat_with_mal0(self):
        """Test MAL0 AI chat functionality"""
        if not self.admin_token:
            self.log_result("chat", "mal0_chat", False, "No admin token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test message to MAL0
            test_message = "Привет MAL0, расскажи о себе как ассистенте базы данных"
            
            response = self.session.post(
                f"{BACKEND_URL}/chat",
                headers=headers,
                json={
                    "message": test_message,
                    "session_id": self.test_session_id
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                ai_response = data.get("response", "")
                
                # Check if response is professional and not romantic
                professional_keywords = ["ассистент", "база данных", "объект", "помощь", "информация"]
                romantic_keywords = ["любовь", "романтик", "свидание", "поцелуй", "влюблен"]
                
                is_professional = any(keyword in ai_response.lower() for keyword in professional_keywords)
                is_romantic = any(keyword in ai_response.lower() for keyword in romantic_keywords)
                
                if ai_response and is_professional and not is_romantic:
                    self.log_result("chat", "mal0_chat", True, 
                                  f"MAL0 responded professionally: {ai_response[:100]}...")
                    return True
                else:
                    self.log_result("chat", "mal0_chat", False, 
                                  f"MAL0 response inappropriate: professional={is_professional}, romantic={is_romantic}")
                    return False
            else:
                self.log_result("chat", "mal0_chat", False, 
                              f"Chat failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("chat", "mal0_chat", False, "Chat request failed", e)
            return False
    
    def test_chat_history(self):
        """Test getting chat history"""
        try:
            response = self.session.get(f"{BACKEND_URL}/chat/history/{self.test_session_id}")
            
            if response.status_code == 200:
                history = response.json()
                
                # Should have at least user message and assistant response
                if len(history) >= 2:
                    user_msg = next((msg for msg in history if msg.get("role") == "user"), None)
                    assistant_msg = next((msg for msg in history if msg.get("role") == "assistant"), None)
                    
                    if user_msg and assistant_msg:
                        self.log_result("chat", "history", True, 
                                      f"Chat history retrieved with {len(history)} messages")
                        return True
                    else:
                        self.log_result("chat", "history", False, 
                                      "Chat history missing user or assistant messages")
                        return False
                else:
                    self.log_result("chat", "history", False, 
                                  f"Chat history too short: {len(history)} messages")
                    return False
            else:
                self.log_result("chat", "history", False, 
                              f"Get chat history failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("chat", "history", False, "Get chat history request failed", e)
            return False
    
    def test_admin_get_users(self):
        """Test admin endpoint to get all users"""
        if not self.admin_token:
            self.log_result("admin", "get_users", False, "No admin token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{BACKEND_URL}/admin/users", headers=headers)
            
            if response.status_code == 200:
                users = response.json()
                
                # Should have at least admin user
                admin_user = next((user for user in users if user.get("username") == "admin"), None)
                
                if admin_user and admin_user.get("clearance_level") == 5:
                    self.log_result("admin", "get_users", True, 
                                  f"Retrieved {len(users)} users, admin found with level 5")
                    return True
                else:
                    self.log_result("admin", "get_users", False, 
                                  "Admin user not found or incorrect clearance level")
                    return False
            else:
                self.log_result("admin", "get_users", False, 
                              f"Get users failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("admin", "get_users", False, "Get users request failed", e)
            return False
    
    def test_admin_update_clearance(self):
        """Test admin endpoint to update user clearance"""
        if not self.admin_token:
            self.log_result("admin", "update_clearance", False, "No admin token available")
            return False
            
        # First get a test user ID
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            users_response = self.session.get(f"{BACKEND_URL}/admin/users", headers=headers)
            
            if users_response.status_code != 200:
                self.log_result("admin", "update_clearance", False, "Could not get users list")
                return False
                
            users = users_response.json()
            test_user = next((user for user in users if user.get("username") != "admin"), None)
            
            if not test_user:
                self.log_result("admin", "update_clearance", False, "No test user found")
                return False
            
            # Update clearance level
            response = self.session.put(
                f"{BACKEND_URL}/admin/users/{test_user['id']}/clearance",
                headers=headers,
                params={"clearance_level": 3}
            )
            
            if response.status_code == 200:
                self.log_result("admin", "update_clearance", True, 
                              f"Updated clearance for user {test_user['username']}")
                return True
            else:
                self.log_result("admin", "update_clearance", False, 
                              f"Update clearance failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("admin", "update_clearance", False, "Update clearance request failed", e)
            return False
    
    def test_admin_update_status(self):
        """Test admin endpoint to update user status"""
        if not self.admin_token:
            self.log_result("admin", "update_status", False, "No admin token available")
            return False
            
        # First get a test user ID
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            users_response = self.session.get(f"{BACKEND_URL}/admin/users", headers=headers)
            
            if users_response.status_code != 200:
                self.log_result("admin", "update_status", False, "Could not get users list")
                return False
                
            users = users_response.json()
            test_user = next((user for user in users if user.get("username") != "admin"), None)
            
            if not test_user:
                self.log_result("admin", "update_status", False, "No test user found")
                return False
            
            # Update user status
            response = self.session.put(
                f"{BACKEND_URL}/admin/users/{test_user['id']}/status",
                headers=headers,
                params={"is_active": True}
            )
            
            if response.status_code == 200:
                self.log_result("admin", "update_status", True, 
                              f"Updated status for user {test_user['username']}")
                return True
            else:
                self.log_result("admin", "update_status", False, 
                              f"Update status failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("admin", "update_status", False, "Update status request failed", e)
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting SCP Backend API Tests")
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 60)
        
        # Authentication tests
        print("\n📋 AUTHENTICATION TESTS")
        self.test_auth_login()
        self.test_auth_register()
        self.test_auth_me()
        
        # SCP Objects tests
        print("\n📋 SCP OBJECTS TESTS")
        self.test_scp_objects_list()
        self.test_scp_object_detail()
        self.test_clearance_filtering()
        
        # Chat tests
        print("\n📋 CHAT TESTS")
        self.test_chat_with_mal0()
        self.test_chat_history()
        
        # Admin tests
        print("\n📋 ADMIN TESTS")
        self.test_admin_get_users()
        self.test_admin_update_clearance()
        self.test_admin_update_status()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        
        total_tests = 0
        passed_tests = 0
        
        for category, tests in self.results.items():
            if category == "errors":
                continue
            for test_name, result in tests.items():
                total_tests += 1
                if result["success"]:
                    passed_tests += 1
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {total_tests - passed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if self.results["errors"]:
            print(f"\n❌ CRITICAL ERRORS ({len(self.results['errors'])}):")
            for error in self.results["errors"]:
                print(f"  - {error}")
        
        return self.results

if __name__ == "__main__":
    tester = SCPBackendTester()
    results = tester.run_all_tests()
    
    # Exit with error code if tests failed
    total_tests = sum(len(tests) for category, tests in results.items() if category != "errors")
    passed_tests = sum(
        sum(1 for result in tests.values() if result["success"]) 
        for category, tests in results.items() if category != "errors"
    )
    
    if passed_tests < total_tests:
        sys.exit(1)
    else:
        print("\n🎉 All tests passed!")
        sys.exit(0)