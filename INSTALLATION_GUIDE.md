# 🛡️ Eternal Sentinels Database - Руководство по установке

## 📋 Содержание
1. [Системные требования](#системные-требования)
2. [Установка зависимостей](#установка-зависимостей)
3. [Настройка MongoDB](#настройка-mongodb)
4. [Настройка Backend](#настройка-backend)
5. [Настройка Frontend](#настройка-frontend)
6. [Запуск приложения](#запуск-приложения)
7. [Тестирование](#тестирование)
8. [Решение проблем](#решение-проблем)

---

## 🖥️ Системные требования

### Обязательные требования:
- **Python 3.9+** - для backend
- **Node.js 16+** и **Yarn** - для frontend
- **MongoDB 5.0+** - база данных
- **Git** - для клонирования репозитория
- **4GB RAM** минимум
- **10GB свободного места** на диске

### Операционные системы:
- ✅ Linux (Ubuntu 20.04+, Debian 11+)
- ✅ macOS 11+
- ✅ Windows 10/11 (с WSL2 рекомендуется)

---

## 📦 Установка зависимостей

### 1. Клонирование репозитория

```bash
git clone -b MAL04 https://github.com/Pala4Roka/MY.git eternal-sentinels
cd eternal-sentinels
```

### 2. Установка Python и pip

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

#### macOS (с Homebrew):
```bash
brew install python@3.11
```

#### Windows:
Скачайте и установите Python с [python.org](https://www.python.org/downloads/)

### 3. Установка Node.js и Yarn

#### Ubuntu/Debian:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g yarn
```

#### macOS (с Homebrew):
```bash
brew install node yarn
```

#### Windows:
Скачайте и установите Node.js с [nodejs.org](https://nodejs.org/)
```bash
npm install -g yarn
```

---

## 🗄️ Настройка MongoDB

### Вариант 1: Локальная установка MongoDB

#### Ubuntu/Debian:
```bash
# Импорт ключа MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Добавление репозитория MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Установка MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Запуск MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Проверка статуса
sudo systemctl status mongod
```

#### macOS:
```bash
# Установка через Homebrew
brew tap mongodb/brew
brew install mongodb-community@6.0

# Запуск MongoDB
brew services start mongodb-community@6.0
```

#### Windows:
1. Скачайте MongoDB Community Server с [mongodb.com](https://www.mongodb.com/try/download/community)
2. Установите с настройками по умолчанию
3. MongoDB будет запущен как служба Windows

### Вариант 2: MongoDB в Docker

```bash
# Создание и запуск контейнера MongoDB
docker run -d \
  --name eternal-sentinels-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  -v mongodb_data:/data/db \
  mongo:6.0

# Проверка работы
docker ps | grep eternal-sentinels-mongodb
```

### Создание базы данных

```bash
# Подключение к MongoDB
mongosh

# Или с авторизацией (если включена)
mongosh -u admin -p admin123 --authenticationDatabase admin

# Создание базы данных
use eternal_sentinels

# Создание коллекций (это сделает автоматически backend при первом запуске)
db.createCollection("users")
db.createCollection("scp_objects")
db.createCollection("chat_messages")

# Выход
exit
```

---

## ⚙️ Настройка Backend

### 1. Переход в директорию backend

```bash
cd backend
```

### 2. Создание виртуального окружения Python

```bash
python3 -m venv venv

# Активация окружения:
# Linux/macOS:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 3. Установка Python зависимостей

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Создание файла `.env`

Создайте файл `.env` в директории `backend/`:

```bash
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
# Или для Docker с авторизацией:
# MONGO_URL=mongodb://admin:admin123@localhost:27017

DB_NAME=eternal_sentinels

# JWT Secret (сгенерируйте свой уникальный ключ!)
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Emergent LLM API Key (для AI чата MAL0)
# Получите ключ на платформе Emergent или оставьте пустым для работы без AI
EMERGENT_LLM_KEY=your-emergent-llm-api-key-here
```

**Важно:** Измените `JWT_SECRET_KEY` на свой уникальный случайный ключ!

Генерация безопасного ключа:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 5. Проверка подключения к MongoDB

```bash
python3 -c "from pymongo import MongoClient; client = MongoClient('mongodb://localhost:27017'); print('MongoDB connection successful!'); print('Databases:', client.list_database_names())"
```

---

## 🎨 Настройка Frontend

### 1. Переход в директорию frontend

```bash
cd ../frontend
```

### 2. Установка зависимостей

```bash
yarn install
```

**Примечание:** Установка может занять 5-10 минут при первом запуске.

### 3. Создание файла `.env`

Создайте файл `.env` в директории `frontend/`:

```bash
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001/api

# Optional: для production
# REACT_APP_BACKEND_URL=https://your-domain.com/api
```

---

## 🚀 Запуск приложения

### Вариант 1: Ручной запуск (разработка)

#### Терминал 1 - Backend:
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python server.py
```

Backend будет доступен на: `http://localhost:8001`

#### Терминал 2 - Frontend:
```bash
cd frontend
yarn start
```

Frontend будет доступен на: `http://localhost:3000`

### Вариант 2: Production запуск

#### Backend (с Gunicorn):
```bash
cd backend
source venv/bin/activate
pip install gunicorn
gunicorn server:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001
```

#### Frontend (сборка production):
```bash
cd frontend
yarn build

# Запуск с serve
npm install -g serve
serve -s build -l 3000
```

### Вариант 3: Docker Compose (рекомендуется)

Создайте `docker-compose.yml` в корне проекта:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: es-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: es-backend
    ports:
      - "8001:8001"
    depends_on:
      - mongodb
    environment:
      MONGO_URL: mongodb://admin:admin123@mongodb:27017
      DB_NAME: eternal_sentinels
      JWT_SECRET_KEY: your-secret-key-here
      EMERGENT_LLM_KEY: your-key-here

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: es-frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      REACT_APP_BACKEND_URL: http://localhost:8001/api

volumes:
  mongodb_data:
```

Запуск:
```bash
docker-compose up -d
```

---

## 🧪 Тестирование

### Проверка Backend API

```bash
# Проверка статуса API
curl http://localhost:8001/api/

# Ожидаемый ответ:
# {"message":"Eternal Sentinels Database API","version":"2.0",...}
```

### Тестирование регистрации и входа

```bash
# Регистрация пользователя
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test_user","password":"test123","clearance_level":1}'

# Вход администратора (создается автоматически)
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Запуск автоматизированных тестов

```bash
# Backend тесты
cd backend
python -m pytest backend_test.py -v

# Frontend тесты
cd frontend
yarn test
```

---

## 🔐 Учетные данные по умолчанию

После первого запуска backend автоматически создаст администратора:

- **Username:** `admin`
- **Password:** `admin123`
- **Clearance Level:** 5 (полный доступ)

**⚠️ ВАЖНО:** Измените пароль администратора после первого входа в production!

---

## 📊 Структура базы данных

### Коллекция `users`:
```javascript
{
  id: "string (UUID)",
  username: "string",
  password_hash: "string (bcrypt)",
  clearance_level: "number (1-5)",
  created_at: "datetime",
  is_active: "boolean"
}
```

### Коллекция `scp_objects`:
```javascript
{
  number: "string (0000-9999)",
  name: "string",
  codename: "string",
  threat_class: "string (Threat/Hazard/Cataclysm/Apex/Annihilation/Absolute)",
  description: "string",
  special_procedures: "string",
  secret_data: "string",
  image_url: "string | null",
  is_classified: "boolean",
  created_at: "datetime"
}
```

### Коллекция `chat_messages`:
```javascript
{
  id: "string",
  session_id: "string (UUID)",
  user_id: "string | null",
  role: "string (user/assistant)",
  content: "string",
  timestamp: "datetime"
}
```

---

## 🛠️ Решение проблем

### Backend не запускается

**Проблема:** `ModuleNotFoundError: No module named 'fastapi'`

**Решение:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

---

**Проблема:** `pymongo.errors.ServerSelectionTimeoutError`

**Решение:**
1. Убедитесь, что MongoDB запущен:
```bash
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS
```

2. Проверьте `MONGO_URL` в `.env`
3. Проверьте подключение:
```bash
mongosh mongodb://localhost:27017
```

---

### Frontend не запускается

**Проблема:** `Error: listen EADDRINUSE: address already in use :::3000`

**Решение:**
```bash
# Найти процесс на порту 3000
lsof -i :3000  # Linux/macOS
netstat -ano | findstr :3000  # Windows

# Убить процесс
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows
```

---

**Проблема:** CORS ошибки в консоли браузера

**Решение:**
1. Проверьте `CORS_ORIGINS` в backend `.env`
2. Убедитесь, что frontend использует правильный `REACT_APP_BACKEND_URL`
3. Перезапустите backend

---

### 3D модель MAL0 не загружается

**Проблема:** Модель не отображается или появляется fallback

**Решение:**
1. Убедитесь, что файл `Mal0_Base_20.glb` находится в `frontend/public/`
2. Проверьте размер файла (~20-121MB)
3. Очистите кэш браузера (Ctrl+Shift+Delete)
4. Проверьте консоль браузера на ошибки

---

### AI чат MAL0 не отвечает

**Проблема:** "AI-ассистент временно недоступен"

**Решение:**
1. Проверьте, что `EMERGENT_LLM_KEY` установлен в backend `.env`
2. Проверьте баланс ключа на платформе Emergent
3. Проверьте логи backend:
```bash
tail -f backend/server.log
```

---

### База данных пустая после запуска

**Решение:**
1. Проверьте логи backend на ошибки инициализации
2. Вручную инициализируйте базу:
```bash
cd backend
source venv/bin/activate
python3 -c "from server import initialize_database; import asyncio; asyncio.run(initialize_database())"
```

---

## 📞 Поддержка

### Логи для диагностики

```bash
# Backend логи
tail -f backend/server.log

# MongoDB логи
tail -f /var/log/mongodb/mongod.log  # Linux
tail -f /usr/local/var/log/mongodb/output.log  # macOS

# Frontend логи в консоли браузера (F12)
```

### Полезные команды

```bash
# Очистка базы данных (осторожно!)
mongosh
use eternal_sentinels
db.dropDatabase()

# Пересоздание виртуального окружения
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Очистка node_modules
cd frontend
rm -rf node_modules yarn.lock
yarn install
```

---

## 🎯 Следующие шаги

После успешной установки:

1. ✅ Войдите как `admin` / `admin123`
2. ✅ Измените пароль администратора
3. ✅ Создайте тестового пользователя
4. ✅ Проверьте доступ к досье объектов
5. ✅ Протестируйте чат с MAL0
6. ✅ Проверьте админ-панель (для уровня допуска 5)

---

## 📝 Примечания

- **Безопасность:** Всегда меняйте дефолтные пароли в production
- **Резервное копирование:** Регулярно делайте бэкапы MongoDB
- **Обновления:** Следите за обновлениями зависимостей
- **Мониторинг:** Используйте логи для отслеживания ошибок

---

**Eternal Sentinels Database** - Observe • Contain • Defend 🛡️
