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

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class Dossier(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    name: str
    code_name: str
    danger_class: str
    description: str
    features: List[str]
    secret_data: str
    containment: str
    threat: str

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str
    session_id: str

# Initialize dossiers data
dossiers_data = [
    {
        "id": "0000",
        "name": "Pala 4 Roka",
        "code_name": "Палач Рока",
        "danger_class": "Уничтожение (Annihilation)",
        "description": "Объект 0000 — существо или сущность, существование которой овеяно мифами и слухами. Официальная информация о происхождении объекта, его действиях и намерениях строго засекречена. Известно только, что объект ранее был связан с одной из самых влиятельных структур — О5 Совета, а также состоял в оперативной группе 'Алая Рука' или 'Альфа-1'.",
        "features": [
            "Абсолютная сила: Единственная зарегистрированная угроза класса Уничтожение. Способен уничтожить любое существо или структуру одним ударом.",
            "Арсенал оружия: Имеет доступ к огромному количеству уникального и неизвестного вооружения.",
            "Неуничтожимость: Любые попытки уничтожения объекта завершались полным провалом.",
            "Мистическая природа: Его сущность охватывает как живое, так и неживое, существующее и несуществующее."
        ],
        "secret_data": "Большая часть информации об объекте 0000 засекречена. Поведенческие модели, мотивы и ограничения объекта остаются неизвестными.",
        "containment": "Объект 0000 не подлежит содержанию или контролю. Любые попытки контакта или подавления объекта приводят к мгновенному уничтожению или бесследному исчезновению всех задействованных сил.",
        "threat": "Объект представляет абсолютную угрозу для всего сущего. В то же время, его действия и цели остаются скрытыми и, возможно, не направлены на непосредственное уничтожение."
    },
    {
        "id": "0003",
        "name": "Ледяной Рыцарь",
        "code_name": "Ледяной Рыцарь",
        "danger_class": "Предел (Apex) - Класс 5",
        "description": "Объект 0003 — таинственная сущность, обладающая чертами как рыцаря, так и магического существа. Ледяной Рыцарь известен как бывший союзник объекта 0000.",
        "features": [
            "Магия льда: Объект обладает магическими способностями, позволяющими ему манипулировать льдом и холодом.",
            "Боевой арсенал: Использует катану, способную прорезать любые материалы, а также энергетические пистолеты.",
            "Уникальная броня: Носит футуристическую броню, стилизованную под рыцарские доспехи, покрытую льдом.",
            "Неизвестная сила: Основная угроза от объекта исходит от неизвестной силы, скрытой в его магии."
        ],
        "secret_data": "Доступ к полной информации об объекте 0003 ограничен. Лишь несколько фрагментов информации о его происхождении и связи с объектом 0000 доступны.",
        "containment": "Содержание объекта невозможно из-за его неуловимости и способности адаптироваться к любым условиям.",
        "threat": "Объект 0003 представляет угрозу класса 5 из-за своей скрытой силы и магических способностей."
    },
    {
        "id": "0002",
        "name": "Valich01",
        "code_name": "Неоновый Стрелок",
        "danger_class": "Опасность/Предел (Hazard/Apex)",
        "description": "Объект 0002 — таинственная и опасная сущность, ранее являвшаяся союзником объекта 0000. Valich01 обладает уникальной силой манипуляции оружием.",
        "features": [
            "Артефакт оружия: Владеет артефактом, способным трансформироваться в любое оружие.",
            "Футуристическая броня: Носит броню с неоновыми линиями, которые пульсируют.",
            "Боевой арсенал: Оснащён множеством оружий, включая энергетические пистолеты.",
            "Неизвестная сила: Глубокая магическая или технологическая сила."
        ],
        "secret_data": "Информация о прошлом объекта 0002 и его связи с объектом 0000 остаётся скрытой.",
        "containment": "Объект 0002 невозможно удерживать в условиях обычного содержания.",
        "threat": "Объект 0002 представляет угрозу класса 5 из-за своей неопределённой силы и уникального артефакта."
    },
    {
        "id": "0004",
        "name": "kokonat",
        "code_name": "Кокосик",
        "danger_class": "Опасность/Предел (Hazard/Apex)",
        "description": "Объект 0004, известный как 'Кокосик', является одним из союзников объекта 0000 и обитает в собственной изолированной реальности, где постоянно происходит зомби-апокалипсис.",
        "features": [
            "Артефакт-конструктор: Обладает уникальным артефактом, способным создавать разнообразные здания и укрепления.",
            "Мастер строительства: Использует свои способности для быстрого возведения защитных сооружений.",
            "Широкий арсенал: Имеет доступ к большому количеству различного вооружения.",
            "Собственное измерение: Существует в уникальной реальности, полностью управляемой им."
        ],
        "secret_data": "Большая часть информации об объекте 0004 засекречена. Неизвестно, каким образом он получил свой артефакт.",
        "containment": "Содержание объекта не требуется, так как он полностью контролирует своё измерение.",
        "threat": "Объект 0004 обладает классом угрозы 4-5 из-за своих неизвестных возможностей."
    },
    {
        "id": "1471",
        "name": "1471",
        "code_name": "MAL0",
        "danger_class": "Угроза (Threat)",
        "description": "Объект 1471 — женщина, известная как MAL0. Она скрыта в доме объекта 0000 и выполняет роль помощника и наблюдателя.",
        "features": [
            "Интеллект: Обладает высоким уровнем интеллекта и способностью к анализу информации.",
            "Коммуникация: Способна общаться и предоставлять информацию о досье объектов.",
            "Наблюдение: Следит за безопасностью и порядком в организации Eternal Sentinels."
        ],
        "secret_data": "Происхождение MAL0 остаётся тайной. Её связь с объектом 0000 глубоко личная.",
        "containment": "Объект находится под наблюдением объекта 0000 и не требует специального содержания.",
        "threat": "Объект представляет минимальную угрозу, но её знания и доступ к информации делают её ценным активом."
    }
]

@api_router.on_event("startup")
async def startup_db():
    """Initialize dossiers in database on startup"""
    try:
        # Check if dossiers collection is empty
        count = await db.dossiers.count_documents({})
        if count == 0:
            logger.info("Initializing dossiers database...")
            await db.dossiers.insert_many(dossiers_data)
            logger.info(f"Inserted {len(dossiers_data)} dossiers")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")

# Routes
@api_router.get("/")
async def root():
    return {"message": "Eternal Sentinels Database - MAL0 System Online"}

@api_router.get("/dossiers", response_model=List[Dossier])
async def get_dossiers():
    """Get all dossiers"""
    try:
        dossiers = await db.dossiers.find({}, {"_id": 0}).to_list(1000)
        return dossiers
    except Exception as e:
        logger.error(f"Error fetching dossiers: {e}")
        raise HTTPException(status_code=500, detail="Error fetching dossiers")

@api_router.get("/dossiers/{dossier_id}", response_model=Dossier)
async def get_dossier(dossier_id: str):
    """Get specific dossier by ID"""
    try:
        dossier = await db.dossiers.find_one({"id": dossier_id}, {"_id": 0})
        if not dossier:
            raise HTTPException(status_code=404, detail="Dossier not found")
        return dossier
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching dossier {dossier_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching dossier")

@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_mal0(request: ChatRequest):
    """Chat with MAL0 AI assistant"""
    try:
        # Get chat history for context
        history = await db.chat_messages.find(
            {"session_id": request.session_id},
            {"_id": 0}
        ).sort("timestamp", -1).limit(10).to_list(10)
        
        # Reverse to get chronological order
        history.reverse()
        
        # Get all dossiers for context
        dossiers = await db.dossiers.find({}, {"_id": 0}).to_list(100)
        
        # Create context for AI
        dossiers_context = "\n\n".join([
            f"Объект {d['id']} - {d['code_name']}:\n{d['description']}\nКласс опасности: {d['danger_class']}"
            for d in dossiers
        ])
        
        system_message = f"""Ты MAL0 (Объект 1471) - ассистент организации Eternal Sentinels. 
        Ты находишься в доме объекта 0000 и помогаешь с информацией о досье.
        
        Твоя личность:
        - Ты загадочная женская сущность с высоким интеллектом
        - Ты говоришь на русском языке
        - Ты можешь быть немного кокетливой, но профессиональной
        - Ты знаешь все досье объектов организации
        - Ты можешь вести общий разговор, но специализируешься на информации о досье
        
        Доступные досье:
        {dossiers_context}
        
        Отвечай кратко, но информативно. Используй эмодзи когда уместно."""
        
        # Initialize LLM chat
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=request.session_id,
            system_message=system_message
        ).with_model("openai", "gpt-5")
        
        # Create user message
        user_msg = UserMessage(text=request.message)
        
        # Get AI response
        ai_response = await chat.send_message(user_msg)
        
        # Save user message to database
        user_message = ChatMessage(
            session_id=request.session_id,
            role="user",
            content=request.message
        )
        user_doc = user_message.model_dump()
        user_doc['timestamp'] = user_doc['timestamp'].isoformat()
        await db.chat_messages.insert_one(user_doc)
        
        # Save assistant message to database
        assistant_message = ChatMessage(
            session_id=request.session_id,
            role="assistant",
            content=ai_response
        )
        assistant_doc = assistant_message.model_dump()
        assistant_doc['timestamp'] = assistant_doc['timestamp'].isoformat()
        await db.chat_messages.insert_one(assistant_doc)
        
        return ChatResponse(
            response=ai_response,
            session_id=request.session_id
        )
        
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str, limit: int = 50):
    """Get chat history for a session"""
    try:
        messages = await db.chat_messages.find(
            {"session_id": session_id},
            {"_id": 0}
        ).sort("timestamp", 1).limit(limit).to_list(limit)
        
        return {"messages": messages}
    except Exception as e:
        logger.error(f"Error fetching chat history: {e}")
        raise HTTPException(status_code=500, detail="Error fetching chat history")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()