from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid

# User Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str
    clearance_level: int  # 1-5
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

class UserCreate(BaseModel):
    username: str
    password: str
    clearance_level: int = 1

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    clearance_level: int
    created_at: datetime
    is_active: bool

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# SCP Object Models
class SCPObject(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    number: str  # 0000, 0051, etc.
    name: str
    codename: str
    threat_class: str  # Threat, Hazard, Cataclysm, Collapse, Apex, Absolute, Annihilation
    description: str
    special_procedures: Optional[str] = None
    secret_data: Optional[str] = None
    image_url: Optional[str] = None
    is_classified: bool = False  # Deprecated, will use threat_class for access control
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SCPObjectCreate(BaseModel):
    number: str
    name: str
    codename: str
    threat_class: str
    description: str
    special_procedures: Optional[str] = None
    secret_data: Optional[str] = None
    image_url: Optional[str] = None
    is_classified: bool = False

class SCPObjectUpdate(BaseModel):
    name: Optional[str] = None
    codename: Optional[str] = None
    threat_class: Optional[str] = None
    description: Optional[str] = None
    special_procedures: Optional[str] = None
    secret_data: Optional[str] = None
    image_url: Optional[str] = None
    is_classified: Optional[bool] = None

# Chat Models
class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_id: Optional[str] = None
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    emotion: str = "calm"  # calm, joy, playful, sad, tired

# Threat class mapping to clearance levels
THREAT_CLASS_ACCESS = {
    "Threat": 1,
    "Hazard": 3,
    "Cataclysm": 3,
    "Collapse": 4,
    "Apex": 4,
    "Absolute": 5,
    "Annihilation": 5
}

def get_required_clearance(threat_class: str) -> int:
    """Get the minimum clearance level required to access objects of this threat class"""
    return THREAT_CLASS_ACCESS.get(threat_class, 5)
