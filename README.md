# SCP Database - Eternal Sentinels

## Описание проекта
База данных Eternal Sentinels - это веб-приложение для управления и просмотра информации об аномальных объектах организации ES (Eternal Sentinels). Приложение включает:

- 🤖 AI-Чат с ассистентом MAL0 (используя GPT-5 через Emergent LLM)
- 📁 База данных объектов ES с детальными досье
- 🖼️ Анимированное изображение MAL0 с плавным следованием за курсором мыши
- 💾 Сохранение истории чата по сессиям
- 🎨 Темный дизайн в стиле SCP Foundation с анимированным фоном

## Технологический стек

### Backend
- **FastAPI** - веб-фреймворк для Python
- **MongoDB** - база данных для хранения объектов
- **Motor** - async драйвер MongoDB
- **Python 3.x**

### Frontend
- **React 19** - библиотека для создания UI
- **React Router** - маршрутизация
- **Axios** - HTTP клиент
- **Tailwind CSS** - стилизация
- **Lucide React** - иконки

## Установка и запуск

### Предварительные требования
- Python 3.8+
- Node.js 16+ и Yarn
- MongoDB

### 1. Клонирование репозитория
```bash
# Если у вас есть git репозиторий
git clone <repository-url>
cd scp-database

# Или распакуйте архив
unzip scp-database.zip
cd scp-database
```

### 2. Настройка Backend

```bash
cd backend

# Создайте виртуальное окружение (опционально)
python -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate

# Установите зависимости
pip install -r requirements.txt

# Настройте .env файл
# Создайте файл .env со следующим содержимым:
MONGO_URL="mongodb://localhost:27017"
DB_NAME="eternal_sentinels"
CORS_ORIGINS="*"

# Инициализируйте базу данных
python seed_data.py

# Запустите backend сервер
uvicorn server:app --host 0.0.0.0 --port 8001
```

Backend будет доступен по адресу: `http://localhost:8001`

### 3. Настройка Frontend

```bash
cd frontend

# Установите зависимости
yarn install

# Настройте .env файл
# Создайте файл .env со следующим содержимым:
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000

# Запустите frontend
yarn start
```

Frontend будет доступен по адресу: `http://localhost:3000`

## Структура проекта

```
scp-database/
├── backend/
│   ├── server.py           # Главный файл FastAPI приложения
│   ├── seed_data.py        # Скрипт для заполнения базы данных
│   ├── requirements.txt    # Python зависимости
│   └── .env               # Переменные окружения backend
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Главная страница
│   │   │   └── ObjectDetailPage.jsx  # Страница детального досье
│   │   ├── App.js          # Главный компонент приложения
│   │   └── index.js        # Точка входа
│   ├── package.json        # Node.js зависимости
│   ├── tailwind.config.js  # Конфигурация Tailwind CSS
│   └── .env               # Переменные окружения frontend
│
└── README.md              # Этот файл
```

## API Endpoints

### Backend API
- `GET /api/` - Проверка статуса API
- `GET /api/objects` - Получить список всех объектов ES
- `GET /api/objects/{object_id}` - Получить детальную информацию об объекте
- `POST /api/chat` - Отправить сообщение в чат с MAL0

## Возможные улучшения

- [ ] Добавить реальную 3D модель MAL0 (Three.js совместимость с React 19)
- [ ] Генерация изображений для объектов через AI
- [ ] Аутентификация пользователей
- [ ] Расширенная система безопасности
- [ ] Админ-панель для управления объектами
- [ ] Экспорт досье в PDF
- [ ] Мультиязычность

## Разработка

### Backend
```bash
cd backend
# Запуск с hot reload
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Frontend
```bash
cd frontend
# Запуск в режиме разработки
yarn start
```

## Production Build

### Backend
```bash
cd backend
pip install -r requirements.txt
python seed_data.py
# Используйте gunicorn или uvicorn с workers
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
```

### Frontend
```bash
cd frontend
yarn build
# Результат будет в директории build/
# Можно разместить на любом статическом хостинге или использовать nginx
```

## Troubleshooting

### MongoDB не запускается
- Убедитесь, что MongoDB установлен и запущен: `sudo systemctl start mongodb`
- Проверьте подключение: `mongo --eval "db.adminCommand('ping')"`

### Backend не подключается к MongoDB
- Проверьте переменную `MONGO_URL` в файле `backend/.env`
- По умолчанию используется: `mongodb://localhost:27017`

### Frontend не может подключиться к Backend
- Проверьте переменную `REACT_APP_BACKEND_URL` в файле `frontend/.env`
- Убедитесь, что backend запущен на указанном порту

### CORS ошибки
- Убедитесь, что в `backend/.env` правильно настроена переменная `CORS_ORIGINS`
- Для разработки можно использовать `CORS_ORIGINS="*"`

## Лицензия
Этот проект создан для Eternal Sentinels Database.

## Контакты
Для вопросов и предложений обращайтесь к команде разработки
