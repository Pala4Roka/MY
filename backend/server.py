from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


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


# Define Models for ES Objects
class ESObject(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    number: str
    name: str
    codename: str
    threat_class: str
    description: str
    secret_data: Optional[str] = None
    containment: Optional[str] = None
    threat_level: Optional[str] = None
    image_url: Optional[str] = None

class ESObjectResponse(BaseModel):
    id: str
    number: str
    name: str
    codename: str
    threat_class: str
    image_url: Optional[str] = None

# Chat Models
class ChatMessage(BaseModel):
    message: str
    
class ChatResponse(BaseModel):
    response: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Eternal Sentinels Database API"}

# ES Objects routes
@api_router.get("/objects", response_model=List[ESObjectResponse])
async def get_all_objects():
    """Get all ES objects for the main page"""
    objects = await db.es_objects.find({}, {"_id": 0}).to_list(1000)
    return objects

@api_router.get("/objects/{object_id}", response_model=ESObject)
async def get_object_detail(object_id: str):
    """Get detailed information about a specific ES object"""
    obj = await db.es_objects.find_one({"id": object_id}, {"_id": 0})
    if not obj:
        raise HTTPException(status_code=404, detail="Object not found")
    return obj

# Chat with MAL0
@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_mal0(chat: ChatMessage):
    """Chat with MAL0 assistant"""
    # Basic MAL0 responses
    responses = [
        "Я MAL0, ассистент базы данных Eternal Sentinels. Чем могу помочь?",
        "Информация об объектах строго засекречена. Выберите досье для подробностей.",
        "Eternal Sentinels наблюдает, сдерживает и защищает все реальности.",
        "Объект 0000 основал нашу организацию для защиты мультивселенной.",
        "Какой объект вас интересует? Все данные доступны в досье."
    ]
    
    import random
    response_text = random.choice(responses)
    
    return ChatResponse(response=response_text)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()