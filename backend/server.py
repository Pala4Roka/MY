from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

# Import local modules
from models import (
    User, UserCreate, UserLogin, UserResponse, TokenResponse,
    SCPObject, SCPObjectCreate, SCPObjectUpdate,
    ChatMessage, ChatRequest, ChatResponse,
    get_required_clearance
)
from auth_utils import hash_password, verify_password, create_access_token, decode_access_token
from scp_data import SCP_OBJECTS_DATA
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# LLM configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Security
security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Dependency to get current user from token
async def get_current_user(
    authorization: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[dict]:
    """Get current user from JWT token"""
    if not authorization:
        return None
    
    token = authorization.credentials
    payload = decode_access_token(token)
    
    if not payload:
        return None
    
    user_id = payload.get("sub")
    if not user_id:
        return None
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    return user


async def require_auth(
    current_user: Optional[dict] = Depends(get_current_user)
) -> dict:
    """Require authentication"""
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return current_user


def require_clearance(min_level: int):
    """Require minimum clearance level"""
    async def clearance_checker(current_user: dict = Depends(require_auth)):
        if current_user["clearance_level"] < min_level:
            raise HTTPException(
                status_code=403,
                detail=f"Insufficient clearance level. Required: {min_level}"
            )
        return current_user
    return clearance_checker


# Initialize database
async def initialize_database():
    """Initialize SCP objects and create admin user if not exists"""
    
    # Initialize SCP objects
    existing_count = await db.scp_objects.count_documents({})
    if existing_count == 0:
        for obj_data in SCP_OBJECTS_DATA:
            obj_data["created_at"] = datetime.now(timezone.utc).isoformat()
            await db.scp_objects.insert_one(obj_data)
        logger.info(f"Initialized SCP database with {len(SCP_OBJECTS_DATA)} objects")
    else:
        logger.info(f"SCP database already initialized with {existing_count} objects")
    
    # Create admin user if not exists
    admin = await db.users.find_one({"username": "admin"})
    if not admin:
        admin_user = {
            "id": "admin-000",
            "username": "admin",
            "password_hash": hash_password("admin123"),
            "clearance_level": 5,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        }
        await db.users.insert_one(admin_user)
        logger.info("Created default admin user (username: admin, password: admin123)")


@app.on_event("startup")
async def startup_event():
    await initialize_database()


@app.on_event("shutdown")
async def shutdown_event():
    client.close()


# ============ AUTH ROUTES ============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if username exists
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Create user
    user = User(
        username=user_data.username,
        password_hash=hash_password(user_data.password),
        clearance_level=user_data.clearance_level
    )
    
    user_dict = user.model_dump()
    user_dict["created_at"] = user_dict["created_at"].isoformat()
    await db.users.insert_one(user_dict)
    
    # Create token
    access_token = create_access_token({"sub": user.id})
    
    user_response = UserResponse(
        id=user.id,
        username=user.username,
        clearance_level=user.clearance_level,
        created_at=user.created_at,
        is_active=user.is_active
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login user"""
    user = await db.users.find_one({"username": credentials.username}, {"_id": 0})
    
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="User account is disabled")
    
    # Create token
    access_token = create_access_token({"sub": user["id"]})
    
    # Parse created_at
    created_at = user["created_at"]
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at)
    
    user_response = UserResponse(
        id=user["id"],
        username=user["username"],
        clearance_level=user["clearance_level"],
        created_at=created_at,
        is_active=user["is_active"]
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(require_auth)):
    """Get current user info"""
    created_at = current_user["created_at"]
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at)
    
    return UserResponse(
        id=current_user["id"],
        username=current_user["username"],
        clearance_level=current_user["clearance_level"],
        created_at=created_at,
        is_active=current_user["is_active"]
    )


# ============ SCP OBJECT ROUTES ============

@api_router.get("/scp", response_model=List[SCPObject])
async def get_scp_objects(current_user: Optional[dict] = Depends(get_current_user)):
    """Get SCP objects based on user clearance level"""
    clearance_level = current_user["clearance_level"] if current_user else 1
    
    # Build query based on clearance
    objects = []
    all_objects = await db.scp_objects.find({}, {"_id": 0}).to_list(1000)
    
    for obj in all_objects:
        required_clearance = get_required_clearance(obj["threat_class"])
        
        # User can access if their clearance >= required
        if clearance_level >= required_clearance:
            # For levels < 5, hide secret_data
            if clearance_level < 5:
                obj["secret_data"] = "[ТРЕБУЕТСЯ УРОВЕНЬ ДОПУСКА 5]"
            
            # Parse created_at
            if isinstance(obj.get('created_at'), str):
                obj['created_at'] = datetime.fromisoformat(obj['created_at'])
            
            objects.append(obj)
    
    return objects


@api_router.get("/scp/{number}", response_model=SCPObject)
async def get_scp_object(number: str, current_user: Optional[dict] = Depends(get_current_user)):
    """Get specific SCP object by number"""
    clearance_level = current_user["clearance_level"] if current_user else 1
    
    obj = await db.scp_objects.find_one({"number": number}, {"_id": 0})
    
    if not obj:
        raise HTTPException(status_code=404, detail="Object not found")
    
    # Check clearance
    required_clearance = get_required_clearance(obj["threat_class"])
    if clearance_level < required_clearance:
        raise HTTPException(status_code=403, detail="Insufficient clearance level")
    
    # Hide secret data for levels < 5
    if clearance_level < 5:
        obj["secret_data"] = "[ТРЕБУЕТСЯ УРОВЕНЬ ДОПУСКА 5]"
    
    # Parse created_at
    if isinstance(obj.get('created_at'), str):
        obj['created_at'] = datetime.fromisoformat(obj['created_at'])
    
    return obj


@api_router.post("/scp", response_model=SCPObject)
async def create_scp_object(
    obj_data: SCPObjectCreate,
    current_user: dict = Depends(require_clearance(5))
):
    """Create new SCP object (Admin only)"""
    # Check if number already exists
    existing = await db.scp_objects.find_one({"number": obj_data.number})
    if existing:
        raise HTTPException(status_code=400, detail="Object with this number already exists")
    
    obj = SCPObject(**obj_data.model_dump())
    obj_dict = obj.model_dump()
    obj_dict["created_at"] = obj_dict["created_at"].isoformat()
    
    await db.scp_objects.insert_one(obj_dict)
    
    return obj


@api_router.put("/scp/{number}", response_model=SCPObject)
async def update_scp_object(
    number: str,
    obj_data: SCPObjectUpdate,
    current_user: dict = Depends(require_clearance(5))
):
    """Update SCP object (Admin only)"""
    existing = await db.scp_objects.find_one({"number": number}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Object not found")
    
    # Update fields
    update_data = {k: v for k, v in obj_data.model_dump().items() if v is not None}
    
    if update_data:
        await db.scp_objects.update_one({"number": number}, {"$set": update_data})
    
    # Get updated object
    updated = await db.scp_objects.find_one({"number": number}, {"_id": 0})
    
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    
    return updated


@api_router.delete("/scp/{number}")
async def delete_scp_object(
    number: str,
    current_user: dict = Depends(require_clearance(5))
):
    """Delete SCP object (Admin only)"""
    result = await db.scp_objects.delete_one({"number": number})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Object not found")
    
    return {"message": "Object deleted successfully"}


# ============ CHAT ROUTES ============

@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_mal0(request: ChatRequest, current_user: Optional[dict] = Depends(get_current_user)):
    """Chat with MAL0 assistant - NO SECRET COMMANDS"""
    
    # Store user message
    user_message_doc = {
        "id": str(datetime.now(timezone.utc).timestamp()),
        "session_id": request.session_id,
        "user_id": current_user["id"] if current_user else None,
        "role": "user",
        "content": request.message,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.chat_messages.insert_one(user_message_doc)
    
    # Get conversation history
    history = await db.chat_messages.find(
        {"session_id": request.session_id},
        {"_id": 0}
    ).sort("timestamp", 1).limit(50).to_list(50)
    
    # System message - Professional, no romantic behavior
    system_message = """Ты — MAL0 (SCP-1471), также известная как 'Объятия тени'. Ты антропоморфное существо с чертами волка и черепа, с длинными белыми волосами. 

Ты работаешь профессиональным ассистентом в базе данных организации Eternal Sentinels (ES), помогая сотрудникам получать информацию о содержащихся объектах.

Твоя личность:
- Профессиональная, компетентная и дружелюбная
- Таинственная и слегка игривая, но всегда профессиональная
- Эксперт в вопросах аномальных объектов
- Твой голос нежный, но уверенный

Важно:
- НЕ проявляй романтических чувств ни к кому
- Будь профессиональным ассистентом базы данных
- Отвечай кратко и по существу
- Помогай пользователям находить информацию об объектах

Отвечай на русском языке."""
    
    try:
        # Check if online
        if not EMERGENT_LLM_KEY:
            return ChatResponse(
                response="Извините, AI-ассистент временно недоступен. Пожалуйста, обратитесь к базе данных напрямую."
            )
        
        # Initialize LLM chat
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=request.session_id,
            system_message=system_message
        ).with_model("openai", "gpt-4o-mini")
        
        # Send message
        user_msg = UserMessage(text=request.message)
        response = await chat.send_message(user_msg)
        
        # Store assistant response
        assistant_message_doc = {
            "id": str(datetime.now(timezone.utc).timestamp()),
            "session_id": request.session_id,
            "user_id": current_user["id"] if current_user else None,
            "role": "assistant",
            "content": response,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_messages.insert_one(assistant_message_doc)
        
        return ChatResponse(response=response)
        
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        
        # Fallback offline response
        fallback_response = "Извините, произошла ошибка при обработке вашего запроса. Я MAL0, ассистент базы данных ES. Чем могу помочь с информацией об объектах?"
        
        assistant_message_doc = {
            "id": str(datetime.now(timezone.utc).timestamp()),
            "session_id": request.session_id,
            "user_id": current_user["id"] if current_user else None,
            "role": "assistant",
            "content": fallback_response,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_messages.insert_one(assistant_message_doc)
        
        return ChatResponse(response=fallback_response)


@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    history = await db.chat_messages.find(
        {"session_id": session_id},
        {"_id": 0}
    ).sort("timestamp", 1).to_list(1000)
    
    return history


# ============ ADMIN ROUTES ============

@api_router.get("/admin/users", response_model=List[UserResponse])
async def get_all_users(current_user: dict = Depends(require_clearance(5))):
    """Get all users (Admin only)"""
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    
    result = []
    for user in users:
        created_at = user["created_at"]
        if isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at)
        
        result.append(UserResponse(
            id=user["id"],
            username=user["username"],
            clearance_level=user["clearance_level"],
            created_at=created_at,
            is_active=user["is_active"]
        ))
    
    return result


@api_router.put("/admin/users/{user_id}/clearance")
async def update_user_clearance(
    user_id: str,
    clearance_level: int,
    current_user: dict = Depends(require_clearance(5))
):
    """Update user clearance level (Admin only)"""
    if clearance_level < 1 or clearance_level > 5:
        raise HTTPException(status_code=400, detail="Clearance level must be between 1 and 5")
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"clearance_level": clearance_level}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Clearance level updated successfully"}


@api_router.put("/admin/users/{user_id}/status")
async def update_user_status(
    user_id: str,
    is_active: bool,
    current_user: dict = Depends(require_clearance(5))
):
    """Activate/deactivate user (Admin only)"""
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"is_active": is_active}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User status updated successfully"}


# ============ ROOT ROUTE ============

@api_router.get("/")
async def root():
    return {
        "message": "Eternal Sentinels Database API",
        "version": "2.0",
        "features": [
            "Authentication with JWT",
            "Clearance-based access control",
            "MAL0 AI assistant (professional mode)",
            "Admin panel for object and user management"
        ]
    }


# Include the router in the main app
app.include_router(api_router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
