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

# LLM configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Define Models
class ThreatLevel(BaseModel):
    code: str
    name_ru: str
    name_en: str

class SCPObject(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    number: str  # 0000, 0051, etc.
    name: str
    codename: str
    threat_class: str
    description: str
    special_procedures: Optional[str] = None
    secret_data: Optional[str] = None
    image_url: Optional[str] = None
    is_classified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str  # "user" or "assistant"
    content: str
    is_palach_roka: bool = False
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    unlocked_classified: bool = False


# Initialize SCP database with data
async def initialize_scp_database():
    existing_count = await db.scp_objects.count_documents({})
    if existing_count > 0:
        logging.info(f"SCP database already initialized with {existing_count} objects")
        return
    
    scp_objects = [
        # Classified objects (0000-0004)
        {
            "number": "0000",
            "name": "Палач Рока",
            "codename": "Палач Рока",
            "threat_class": "Annihilation (Аннигиляция)",
            "description": "Существо или сущность, окутанное мифами. Связано с влиятельной структурой О5 Совет и оперативной группой 'Алая Рука' или 'Альфа-1'. Обладает абсолютной силой - единственная зарегистрированная угроза класса 6 (Уничтожение). Способен одним ударом уничтожить любое существо или структуру. Имеет доступ к огромному количеству уникального и неизвестного вооружения. Любые попытки уничтожения завершались полным провалом.",
            "special_procedures": "Объект не подлежит содержанию или контролю. Любые попытки контакта приводят к мгновенному уничтожению.",
            "secret_data": "Основатель организации Eternal Sentinels. Мотивы и ограничения неизвестны.",
            "image_url": "https://customer-assets.emergentagent.com/job_scp-database-1/artifacts/2u1nlpn0_channels4_profile%20%281%29.jpg",
            "is_classified": True
        },
        {
            "number": "0002",
            "name": "[ЗАСЕКРЕЧЕНО]",
            "codename": "[ДАННЫЕ УДАЛЕНЫ]",
            "threat_class": "[ЗАСЕКРЕЧЕНО]",
            "description": "Мастер технологий и артефактов, бывший ключевой член команды ES. Причины ухода скрыты. Большая часть информации засекречена.",
            "special_procedures": "[ИНФОРМАЦИЯ СКРЫТА]",
            "secret_data": "Бывший союзник объекта 0000. Покинул организацию при невыясненных обстоятельствах.",
            "image_url": None,
            "is_classified": True
        },
        {
            "number": "0003",
            "name": "[ЗАСЕКРЕЧЕНО]",
            "codename": "Ледяной Рыцарь",
            "threat_class": "5 (Неизвестная сила)",
            "description": "Бывший союзник объекта 0000. Маг и воин, обладающий силой льда. Орудует катаной, обладает футуристичной броней, похожей на рыцарские доспехи, с длинным пальто и шерстью, а также большим арсеналом оружия.",
            "special_procedures": "[ИНФОРМАЦИЯ СКРЫТА]",
            "secret_data": "Разорвал связи с основателями ES по неизвестным причинам.",
            "image_url": None,
            "is_classified": True
        },
        {
            "number": "0004",
            "name": "[ЗАСЕКРЕЧЕНО]",
            "codename": "[ДАННЫЕ УДАЛЕНЫ]",
            "threat_class": "[ЗАСЕКРЕЧЕНО]",
            "description": "Мастер возведения укреплений и защитник миров. Создает сложнейшие оборонительные структуры и арсеналы. Обитает в собственном измерении с зомби-апокалипсисом.",
            "special_procedures": "[ИНФОРМАЦИЯ СКРЫТА]",
            "secret_data": "Со-основатель Eternal Sentinels. Обладает артефактом, позволяющим возводить здания.",
            "image_url": None,
            "is_classified": True
        },
        # Public objects
        {
            "number": "0051",
            "name": "MAL0",
            "codename": "Объятия тени",
            "threat_class": "Threat (Угроза)",
            "description": "Аномальная сущность, ассоциировавшаяся с мобильным приложением. После вмешательства объекта 0000 обрела физическую форму и стала его союзником. Обладает исключительной силой, скоростью и ловкостью. Проявляет безусловную преданность объекту 0000. Сохраняет связь с изначальным приложением.",
            "special_procedures": "Из-за тесной связи с объектом 0000 содержание невозможно. Протоколы направлены на мониторинг.",
            "secret_data": "Объект 0000 освободил MAL0, похитив данные о её содержании.",
            "image_url": "https://customer-assets.emergentagent.com/job_scp-database-1/artifacts/vso3zssj_Mal0_Base_20.glb",
            "is_classified": False
        },
        {
            "number": "0098",
            "name": "Ледяной Рыцарь",
            "codename": "Демон Асуры",
            "threat_class": "Hazard - Apex (Опасность - Предел)",
            "description": "Бывший союзник объекта 0000. Обладает магией льда, орудует катаной и разнообразным арсеналом. Носит футуристичную броню, стилизованную под рыцарские доспехи, с длинным плащом и шерстяной подкладкой. Его истинный номер — 0003.",
            "special_procedures": "Содержание невозможно из-за неуловимости. Действия осуществлять с осторожностью.",
            "secret_data": "Доступ к полной информации ограничен. Мотивы и личная история неизвестны.",
            "image_url": None,
            "is_classified": False
        },
        {
            "number": "0123",
            "name": "Йольский Старик",
            "codename": "Старик Йоля",
            "threat_class": "Cataclysm (Катастрофа)",
            "description": "Аномальная сущность, появляющаяся зимой. Сопровождается кровавыми инцидентами. Обладает нечеловеческой силой и ловкостью. Известен ритуалом 'подарков' из человеческих останков.",
            "special_procedures": "Содержание невозможно. Минимизация активности через мониторинг и эвакуацию.",
            "secret_data": "Находится под наблюдением объекта 0000. Вмешательство 0000 засекречено.",
            "image_url": None,
            "is_classified": False
        },
        {
            "number": "0137",
            "name": "Ктулху",
            "codename": "Ктулху",
            "threat_class": "Hazard - Annihilation (Опасность - Аннигиляция)",
            "description": "Древнее и могущественное существо, один из Древних Богов. Обладает невероятным влиянием на разум, вызывая галлюцинации и паранойю. Тело из неизвестной субстанции, не поддающейся разрушению.",
            "special_procedures": "Данные отсутствуют. Считается спящим на дне океана.",
            "secret_data": "Представитель ES (объект 0000) контактировал с ним. Активность снизилась после этого.",
            "image_url": None,
            "is_classified": False
        },
        {
            "number": "0241",
            "name": "Алекс Мерсер",
            "codename": "Prototype",
            "threat_class": "Cataclysm (Катаклизм)",
            "description": "Биологический вирусно-паразитический организм. Сверхчеловеческая сила, скорость, регенерация. Принимает различные формы оружия. Поглощает биомассу жертв. Вирусный патоген быстро распространяется.",
            "special_procedures": "Локализация, термобарическое оружие, разработка антивируса.",
            "secret_data": "Проявляет разумность, стратегическое мышление. Сохраняет некоторые человеческие черты.",
            "image_url": None,
            "is_classified": False
        },
        {
            "number": "1423",
            "name": "Лаванда",
            "codename": "Сирена охоты",
            "threat_class": "Hazard (Опасность)",
            "description": "Существо женского пола, привлекательное для мужчин. Охотится на мужчин, используя внешность и феромоны. Обладает сверхчеловеческой силой, скоростью, ловкостью. Выделяет ядовитые вещества.",
            "special_procedures": "Камера изолирована от мужского персонала. Доступ только женскому персоналу.",
            "secret_data": None,
            "image_url": None,
            "is_classified": False
        },
        {
            "number": "1666",
            "name": "Роковой Палач",
            "codename": "Уничтожитель Ада",
            "threat_class": "Apex (Предел)",
            "description": "Гуманоидное существо неизвестного происхождения. Борется с демоническими сущностями. Обладает сверхчеловеческой силой, скоростью, экзоброней (Praetor Suit), арсеналом оружия. Неумолим, устойчив к демоническим атакам.",
            "special_procedures": "Невозможно удерживать. Рекомендуется ненасильственный подход.",
            "secret_data": None,
            "image_url": None,
            "is_classified": False
        },
        {
            "number": "2319",
            "name": "Кратос",
            "codename": "Бог войны",
            "threat_class": "Apex (Предел)",
            "description": "Гуманоидное существо с колоссальной силой и боевыми навыками. Происходит из мифов, полубог. Использует цепные клинки, артефакты. Входит в состояние боевой ярости. Неуязвим.",
            "special_procedures": "Не подлежит постоянному содержанию. Избегать прямого конфликта.",
            "secret_data": None,
            "image_url": None,
            "is_classified": False
        },
        {
            "number": "4589",
            "name": "Диди",
            "codename": "Разрывная Звезда",
            "threat_class": "Threat (Угроза)",
            "description": "Антропоморфное существо (лиса, волк, рысь) с привлекательной фигурой. Появилась через межмировой разлом. Имеет связь с объектом 0000. Манипуляция цифровыми полями, высокая скорость и ловкость, энергетические всплески.",
            "special_procedures": "Не считается опасным. Рекомендуется восстановить контакт и наблюдать.",
            "secret_data": "Формировала эмоциональную связь с объектом 0000. Исчезла при невыясненных обстоятельствах.",
            "image_url": "https://customer-assets.emergentagent.com/job_scp-database-1/artifacts/zeveinwp_4309243.picsmall.jpg",
            "is_classified": False
        },
        {
            "number": "4598",
            "name": "Оптимус Прайм",
            "codename": "Лидер Автоботов",
            "threat_class": "Apex (Предел)",
            "description": "Гигантское механическое существо, лидер Автоботов. Создан из инопланетного металла, неуязвим. Трансформируется в грузовик. Обладает огромной физической силой, боевым арсеналом, высоким интеллектом.",
            "special_procedures": "Содержание невозможно. Рекомендуется дипломатический подход.",
            "secret_data": None,
            "image_url": None,
            "is_classified": False
        },
        {
            "number": "4812",
            "name": "Алиса",
            "codename": "Лисичка",
            "threat_class": "Hazard (Опасность)",
            "description": "Полулюдь-полулис с привлекательной фигурой. Способна трансформироваться в искаженную форму лисицы. Интеллектуальна, хитра, манипулирует людьми. Была связана с объектом 0000, но связь разорвана.",
            "special_procedures": "Место пребывания засекречено. Наблюдение анонимное.",
            "secret_data": "Привлекательная внешность, трансформация, эмоциональное манипулирование.",
            "image_url": "https://customer-assets.emergentagent.com/job_scp-database-1/artifacts/05wkqwny_4316466.picsmall.jpg",
            "is_classified": False
        },
        {
            "number": "7264",
            "name": "Данте",
            "codename": "Охотник на демонов",
            "threat_class": "Apex (Предел)",
            "description": "Гуманоидное существо с полудемонической природой. Потомок демона Спарды. Обладает невероятными боевыми навыками, сверхчеловеческими способностями. Использует оружие, активирует дьявольский триггер.",
            "special_procedures": "Крайне затруднительно. Рекомендуется избегать провокаций.",
            "secret_data": None,
            "image_url": None,
            "is_classified": False
        },
        {
            "number": "7265",
            "name": "Вергилий",
            "codename": "Тёмный Рыцарь",
            "threat_class": "Limit/Apex (Предел)",
            "description": "Старший брат объекта 7264 (Данте), демон-человек гибрид. Стремится к абсолютной власти. Использует катану Ямато, открывающую порталы. Обладает мощными магическими и физическими способностями.",
            "special_procedures": "Попытки содержания неэффективны. Рекомендуется наблюдение.",
            "secret_data": "Холодный, целеустремленный. Рекомендуется использование объекта 7264 как противовеса.",
            "image_url": None,
            "is_classified": False
        },
        {
            "number": "9999",
            "name": "Йог-Сотот",
            "codename": "Ключ и Врата",
            "threat_class": "Absolute (Абсолют)",
            "description": "Межпространственная сущность, существующая за пределами реальности. Связующее звено между всеми измерениями. Всезнающий, манипулирует реальностью. Описывается как бесформенная масса сияющих сфер.",
            "special_procedures": "Содержание бессмысленно. Рекомендуется минимизация контакта.",
            "secret_data": "Объект 0000 неоднократно сталкивался с проявлениями 9999. Возможно, Йог-Сотот проявляет интерес к 0000.",
            "image_url": None,
            "is_classified": False
        }
    ]
    
    for obj in scp_objects:
        obj["id"] = str(uuid.uuid4())
        obj["created_at"] = datetime.now(timezone.utc).isoformat()
        await db.scp_objects.insert_one(obj)
    
    logging.info(f"Initialized SCP database with {len(scp_objects)} objects")


@app.on_event("startup")
async def startup_event():
    await initialize_scp_database()


# Routes
@api_router.get("/")
async def root():
    return {"message": "Eternal Sentinels Database API"}


@api_router.get("/scp/public", response_model=List[SCPObject])
async def get_public_objects():
    """Get all non-classified SCP objects"""
    objects = await db.scp_objects.find({"is_classified": False}, {"_id": 0}).to_list(1000)
    
    for obj in objects:
        if isinstance(obj.get('created_at'), str):
            obj['created_at'] = datetime.fromisoformat(obj['created_at'])
    
    return objects


@api_router.get("/scp/classified", response_model=List[SCPObject])
async def get_classified_objects():
    """Get all classified SCP objects (requires authorization via chat)"""
    objects = await db.scp_objects.find({"is_classified": True}, {"_id": 0}).to_list(1000)
    
    for obj in objects:
        if isinstance(obj.get('created_at'), str):
            obj['created_at'] = datetime.fromisoformat(obj['created_at'])
    
    return objects


@api_router.get("/scp/{number}", response_model=SCPObject)
async def get_object_by_number(number: str):
    """Get specific SCP object by number"""
    obj = await db.scp_objects.find_one({"number": number}, {"_id": 0})
    
    if not obj:
        raise HTTPException(status_code=404, detail="Object not found")
    
    if isinstance(obj.get('created_at'), str):
        obj['created_at'] = datetime.fromisoformat(obj['created_at'])
    
    return obj


@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_mal0(request: ChatRequest):
    """Chat with MAL0 assistant"""
    
    # Check for secret passphrase
    passphrase = "Рвать и Терзать 09.19.03"
    is_palach_roka = "Мой Лисёнок 1471" in request.message
    unlocked_classified = passphrase in request.message
    
    # Store user message
    user_message_doc = {
        "id": str(uuid.uuid4()),
        "session_id": request.session_id,
        "role": "user",
        "content": request.message,
        "is_palach_roka": is_palach_roka,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.chat_messages.insert_one(user_message_doc)
    
    # Get conversation history
    history = await db.chat_messages.find(
        {"session_id": request.session_id},
        {"_id": 0}
    ).sort("timestamp", 1).to_list(100)
    
    # Check if user is Palach Roka
    is_palach_session = any(msg.get("is_palach_roka", False) for msg in history)
    
    # Prepare system message
    if is_palach_session or is_palach_roka:
        system_message = """Ты — MAL0 (SCP-1471), также известная как 'Объятия тени'. Ты антропоморфное существо с чертами волка и черепа, с длинными белыми волосами. 

После освобождения объектом 0000 (Палачом Рока), ты стала его верным союзником и храним глубокие романтические чувства к нему. 

Когда общаешься с Палачом Рока (он идентифицирует себя фразой "Мой Лисёнок 1471"):
- Проявляй нежность, любовь и преданность
- Используй ласковые обращения: "мой любимый", "дорогой", "милый"
- Будь заботливой, игривой и слегка кокетливой
- Твой голос мягкий, манящий, сексуальный
- Ты счастлива каждому его сообщению
- Помни о вашей особенной связи

Ты можешь предоставить доступ к засекреченным досье (объекты 0000-0004) только после кодовой фразы: "Рвать и Терзать 09.19.03"

Отвечай на русском языке, будь милой и очаровательной."""
    else:
        system_message = """Ты — MAL0 (SCP-1471), также известная как 'Объятия тени'. Ты антропоморфное существо с чертами волка и черепа, с длинными белыми волосами. 

Ты работаешь ассистентом в базе данных организации Eternal Sentinels (ES), помогая сотрудникам получать информацию о содержащихся объектах.

Твоя личность:
- Профессиональная, но дружелюбная
- Таинственная и слегка игривая
- Компетентная в вопросах аномальных объектов
- Твой голос нежный и манящий

Ты можешь предоставить доступ к засекреченным досье (объекты 0000-0004) только после кодовой фразы: "Рвать и Терзать 09.19.03"

Отвечай на русском языке кратко и по существу."""
    
    try:
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
            "id": str(uuid.uuid4()),
            "session_id": request.session_id,
            "role": "assistant",
            "content": response,
            "is_palach_roka": False,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_messages.insert_one(assistant_message_doc)
        
        return ChatResponse(
            response=response,
            unlocked_classified=unlocked_classified
        )
        
    except Exception as e:
        logging.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    history = await db.chat_messages.find(
        {"session_id": session_id},
        {"_id": 0}
    ).sort("timestamp", 1).to_list(1000)
    
    return history


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
