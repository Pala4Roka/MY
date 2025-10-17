#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Eternal Sentinels SCP Database
Tests clearance level access control and MAL0 AI assistant functionality
"""

import requests
import json
import uuid
from typing import Dict, List, Optional
import time

# Configuration
BASE_URL = "https://scp-layout-update.preview.emergentagent.com/api"
ADMIN_CREDENTIALS = {
    "username": "admin",
    "password": "admin123"
}

# Test data for different clearance levels
TEST_USERS = [
    {"username": f"test_user_level1_{uuid.uuid4().hex[:8]}", "password": "testpass123", "clearance_level": 1},
    {"username": f"test_user_level2_{uuid.uuid4().hex[:8]}", "password": "testpass123", "clearance_level": 2},
    {"username": f"test_user_level3_{uuid.uuid4().hex[:8]}", "password": "testpass123", "clearance_level": 3},
    {"username": f"test_user_level4_{uuid.uuid4().hex[:8]}", "password": "testpass123", "clearance_level": 4},
]

# Expected threat class mappings to clearance levels
THREAT_CLASS_ACCESS = {
    "Threat": 1,
    "Hazard": 3,
    "Cataclysm": 3,
    "Collapse": 4,
    "Apex": 4,
    "Absolute": 5,
    "Annihilation": 5
}

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
        self.details = []
    
    def add_result(self, test_name: str, passed: bool, details: str = ""):
        if passed:
            self.passed += 1
            print(f"✅ {test_name}")
        else:
            self.failed += 1
            self.errors.append(f"{test_name}: {details}")
            print(f"❌ {test_name}: {details}")
        
        if details:
            self.details.append(f"{test_name}: {details}")
    
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*60}")
        print(f"ТЕСТИРОВАНИЕ ЗАВЕРШЕНО")
        print(f"{'='*60}")
        print(f"Всего тестов: {total}")
        print(f"Успешно: {self.passed}")
        print(f"Неудачно: {self.failed}")
        print(f"Процент успеха: {(self.passed/total*100):.1f}%" if total > 0 else "0%")
        
        if self.errors:
            print(f"\n❌ КРИТИЧЕСКИЕ ОШИБКИ:")
            for error in self.errors:
                print(f"  - {error}")
        
        return self.failed == 0

def make_request(method: str, endpoint: str, data: dict = None, headers: dict = None, token: str = None) -> tuple:
    """Make HTTP request and return (success, response_data, status_code)"""
    url = f"{BASE_URL}{endpoint}"
    
    request_headers = {"Content-Type": "application/json"}
    if headers:
        request_headers.update(headers)
    if token:
        request_headers["Authorization"] = f"Bearer {token}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=request_headers, timeout=30)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=request_headers, timeout=30)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers=request_headers, timeout=30)
        else:
            return False, {"error": f"Unsupported method: {method}"}, 0
        
        try:
            response_data = response.json()
        except:
            response_data = {"text": response.text}
        
        return response.status_code < 400, response_data, response.status_code
    
    except requests.exceptions.RequestException as e:
        return False, {"error": str(e)}, 0

def register_user(user_data: dict) -> tuple:
    """Register a new user and return (success, token, user_info)"""
    success, response, status = make_request("POST", "/auth/register", user_data)
    
    if success and "access_token" in response:
        return True, response["access_token"], response["user"]
    else:
        return False, None, response

def login_user(username: str, password: str) -> tuple:
    """Login user and return (success, token, user_info)"""
    success, response, status = make_request("POST", "/auth/login", {
        "username": username,
        "password": password
    })
    
    if success and "access_token" in response:
        return True, response["access_token"], response["user"]
    else:
        return False, None, response

def test_basic_connectivity(results: TestResults):
    """Test basic API connectivity"""
    print(f"\n🔍 ТЕСТИРОВАНИЕ БАЗОВОГО ПОДКЛЮЧЕНИЯ")
    print(f"URL: {BASE_URL}")
    
    success, response, status = make_request("GET", "/")
    results.add_result(
        "Базовое подключение к API", 
        success and status == 200,
        f"Status: {status}, Response: {response}"
    )

def test_admin_login(results: TestResults) -> Optional[str]:
    """Test admin login and return admin token"""
    print(f"\n🔐 ТЕСТИРОВАНИЕ ВХОДА АДМИНИСТРАТОРА")
    
    success, token, user_info = login_user(ADMIN_CREDENTIALS["username"], ADMIN_CREDENTIALS["password"])
    
    if success:
        results.add_result(
            "Вход администратора",
            user_info["clearance_level"] == 5,
            f"Clearance level: {user_info['clearance_level']}"
        )
        return token
    else:
        results.add_result("Вход администратора", False, f"Login failed: {user_info}")
        return None

def test_user_registration_and_login(results: TestResults) -> Dict[int, str]:
    """Test user registration and login for different clearance levels"""
    print(f"\n👥 ТЕСТИРОВАНИЕ РЕГИСТРАЦИИ И ВХОДА ПОЛЬЗОВАТЕЛЕЙ")
    
    user_tokens = {}
    
    for user_data in TEST_USERS:
        clearance_level = user_data["clearance_level"]
        
        # Test registration
        success, token, user_info = register_user(user_data)
        
        if success:
            results.add_result(
                f"Регистрация пользователя уровня {clearance_level}",
                user_info["clearance_level"] == clearance_level,
                f"Expected: {clearance_level}, Got: {user_info['clearance_level']}"
            )
            user_tokens[clearance_level] = token
        else:
            results.add_result(
                f"Регистрация пользователя уровня {clearance_level}",
                False,
                f"Registration failed: {user_info}"
            )
    
    return user_tokens

def get_scp_objects_with_token(token: str = None) -> tuple:
    """Get SCP objects with optional authentication"""
    return make_request("GET", "/scp", token=token)

def get_scp_object_by_number(number: str, token: str = None) -> tuple:
    """Get specific SCP object by number"""
    return make_request("GET", f"/scp/{number}", token=token)

def test_clearance_access_control(results: TestResults, user_tokens: Dict[int, str]):
    """Test clearance level access control system"""
    print(f"\n🛡️ ТЕСТИРОВАНИЕ СИСТЕМЫ КОНТРОЛЯ ДОСТУПА ПО УРОВНЯМ ДОПУСКА")
    
    # First, get all objects as admin to know what's available
    admin_token = None
    admin_success, admin_token, _ = login_user(ADMIN_CREDENTIALS["username"], ADMIN_CREDENTIALS["password"])
    
    if not admin_success:
        results.add_result("Получение списка объектов администратором", False, "Admin login failed")
        return
    
    success, all_objects, status = get_scp_objects_with_token(admin_token)
    if not success:
        results.add_result("Получение списка объектов администратором", False, f"Failed to get objects: {all_objects}")
        return
    
    print(f"📋 Найдено {len(all_objects)} объектов в базе данных")
    
    # Group objects by threat class
    objects_by_threat = {}
    for obj in all_objects:
        threat_class = obj["threat_class"].split(" ")[0]  # Extract base threat class
        if threat_class not in objects_by_threat:
            objects_by_threat[threat_class] = []
        objects_by_threat[threat_class].append(obj)
    
    print(f"📊 Распределение по классам угроз:")
    for threat_class, objs in objects_by_threat.items():
        required_level = THREAT_CLASS_ACCESS.get(threat_class, 5)
        print(f"  - {threat_class}: {len(objs)} объектов (требует уровень {required_level})")
    
    # Test access for each clearance level
    for clearance_level, token in user_tokens.items():
        print(f"\n🔍 Тестирование доступа для уровня {clearance_level}")
        
        # Test getting all objects
        success, user_objects, status = get_scp_objects_with_token(token)
        
        if not success:
            results.add_result(
                f"Получение списка объектов (уровень {clearance_level})",
                False,
                f"Failed to get objects: {user_objects}"
            )
            continue
        
        # Count accessible objects by threat class
        accessible_by_threat = {}
        for obj in user_objects:
            threat_class = obj["threat_class"].split(" ")[0]
            if threat_class not in accessible_by_threat:
                accessible_by_threat[threat_class] = 0
            accessible_by_threat[threat_class] += 1
        
        print(f"  📋 Доступно объектов: {len(user_objects)}")
        for threat_class, count in accessible_by_threat.items():
            print(f"    - {threat_class}: {count}")
        
        # Verify access control rules
        for threat_class, required_clearance in THREAT_CLASS_ACCESS.items():
            if threat_class in objects_by_threat:
                expected_accessible = clearance_level >= required_clearance
                actually_accessible = threat_class in accessible_by_threat
                
                results.add_result(
                    f"Доступ к классу {threat_class} (уровень {clearance_level})",
                    expected_accessible == actually_accessible,
                    f"Expected: {expected_accessible}, Got: {actually_accessible}"
                )
        
        # Test secret_data hiding for non-admin users
        if clearance_level < 5 and user_objects:
            secret_hidden = all("[ТРЕБУЕТСЯ УРОВЕНЬ ДОПУСКА 5]" in obj.get("secret_data", "") 
                              for obj in user_objects if obj.get("secret_data"))
            results.add_result(
                f"Сокрытие секретных данных (уровень {clearance_level})",
                secret_hidden,
                f"Secret data properly hidden: {secret_hidden}"
            )

def test_forbidden_access(results: TestResults, user_tokens: Dict[int, str]):
    """Test that users get 403 errors when accessing objects above their clearance"""
    print(f"\n🚫 ТЕСТИРОВАНИЕ ЗАПРЕЩЕННОГО ДОСТУПА")
    
    # Test specific high-clearance objects
    high_clearance_objects = [
        ("0000", "Annihilation", 5),  # Should require level 5
        ("9999", "Absolute", 5),     # Should require level 5
    ]
    
    for clearance_level, token in user_tokens.items():
        if clearance_level >= 5:
            continue  # Skip admin-level users
        
        for obj_number, threat_class, required_level in high_clearance_objects:
            if clearance_level < required_level:
                success, response, status = get_scp_object_by_number(obj_number, token)
                
                results.add_result(
                    f"403 ошибка для объекта {obj_number} (уровень {clearance_level})",
                    status == 403,
                    f"Expected 403, got {status}: {response}"
                )

def test_mal0_chat(results: TestResults, user_tokens: Dict[int, str]):
    """Test MAL0 AI assistant functionality"""
    print(f"\n🤖 ТЕСТИРОВАНИЕ MAL0 AI АССИСТЕНТА")
    
    # Test with different clearance levels
    test_messages = [
        "Привет, MAL0! Как дела?",
        "Расскажи о системе классификации угроз",
        "Что ты знаешь об объекте 0051?"
    ]
    
    for clearance_level, token in user_tokens.items():
        print(f"\n🔍 Тестирование чата для уровня {clearance_level}")
        
        for i, message in enumerate(test_messages):
            session_id = f"test_session_{clearance_level}_{i}_{uuid.uuid4().hex[:8]}"
            
            chat_data = {
                "message": message,
                "session_id": session_id
            }
            
            success, response, status = make_request("POST", "/chat", chat_data, token=token)
            
            if success and "response" in response and "emotion" in response:
                results.add_result(
                    f"MAL0 чат (уровень {clearance_level}, сообщение {i+1})",
                    True,
                    f"Response length: {len(response['response'])}, Emotion: {response['emotion']}"
                )
            else:
                results.add_result(
                    f"MAL0 чат (уровень {clearance_level}, сообщение {i+1})",
                    False,
                    f"Status: {status}, Response: {response}"
                )
            
            # Small delay between requests
            time.sleep(0.5)

def test_unauthenticated_access(results: TestResults):
    """Test access without authentication"""
    print(f"\n🔓 ТЕСТИРОВАНИЕ ДОСТУПА БЕЗ АУТЕНТИФИКАЦИИ")
    
    # Test getting objects without token (should work with level 1 access)
    success, objects, status = get_scp_objects_with_token()
    
    if success:
        # Should only see Threat class objects
        threat_objects = [obj for obj in objects if obj["threat_class"].startswith("Threat")]
        results.add_result(
            "Доступ без аутентификации к объектам класса Threat",
            len(threat_objects) > 0,
            f"Found {len(threat_objects)} Threat class objects out of {len(objects)} total"
        )
    else:
        results.add_result(
            "Доступ без аутентификации",
            False,
            f"Status: {status}, Response: {objects}"
        )

def main():
    """Main testing function"""
    print("🚀 ЗАПУСК ТЕСТИРОВАНИЯ BACKEND ETERNAL SENTINELS SCP DATABASE")
    print("="*80)
    
    results = TestResults()
    
    # Test basic connectivity
    test_basic_connectivity(results)
    
    # Test admin login
    admin_token = test_admin_login(results)
    if not admin_token:
        print("❌ КРИТИЧЕСКАЯ ОШИБКА: Не удалось войти как администратор")
        results.summary()
        return False
    
    # Test user registration and login
    user_tokens = test_user_registration_and_login(results)
    if not user_tokens:
        print("❌ КРИТИЧЕСКАЯ ОШИБКА: Не удалось зарегистрировать тестовых пользователей")
        results.summary()
        return False
    
    # Test clearance access control (MOST CRITICAL)
    test_clearance_access_control(results, user_tokens)
    
    # Test forbidden access
    test_forbidden_access(results, user_tokens)
    
    # Test unauthenticated access
    test_unauthenticated_access(results)
    
    # Test MAL0 chat
    test_mal0_chat(results, user_tokens)
    
    # Final summary
    success = results.summary()
    
    if success:
        print("\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!")
    else:
        print("\n⚠️ ОБНАРУЖЕНЫ КРИТИЧЕСКИЕ ПРОБЛЕМЫ!")
    
    return success

if __name__ == "__main__":
    main()