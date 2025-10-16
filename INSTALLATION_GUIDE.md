# 📖 Инструкция по установке Eternal Sentinels

Полное руководство по установке, настройке и запуску сайта Eternal Sentinels с интеграцией MAL0.

## 📋 Содержание
1. [Системные требования](#системные-требования)
2. [Необходимые компоненты](#необходимые-компоненты)
3. [Установка зависимостей](#установка-зависимостей)
4. [Настройка базы данных](#настройка-базы-данных)
5. [Настройка окружения](#настройка-окружения)
6. [Запуск приложения](#запуск-приложения)
7. [Развертывание на хостинге](#развертывание-на-хостинге)
8. [Структура проекта](#структура-проекта)
9. [Решение проблем](#решение-проблем)

---

## 🖥 Системные требования

### Минимальные требования:
- **Операционная система**: Linux (Ubuntu 20.04+), macOS, Windows 10+
- **Процессор**: 2 ядра
- **Оперативная память**: 4 GB
- **Свободное место на диске**: 2 GB

### Рекомендуемые требования:
- **Процессор**: 4+ ядер
- **Оперативная память**: 8+ GB
- **Свободное место на диске**: 5+ GB

---

## 📦 Необходимые компоненты

Перед установкой убедитесь, что у вас установлены следующие компоненты:

### 1. Node.js и npm/yarn
```bash
# Проверка установки Node.js (версия 16+ рекомендуется)
node --version

# Проверка npm
npm --version

# Установка Yarn (рекомендуется)
npm install -g yarn
yarn --version
```

**Установка Node.js:**
- **Linux/macOS**: https://nodejs.org/en/download/
- **Ubuntu**:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

### 2. Python 3.11+
```bash
# Проверка версии Python
python3 --version

# Установка Python 3.11 на Ubuntu
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip
```

### 3. MongoDB
```bash
# Проверка установки MongoDB
mongod --version

# Установка MongoDB на Ubuntu
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Запуск MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

**Альтернатива - MongoDB Atlas (облачная база данных):**
- Зарегистрируйтесь на https://www.mongodb.com/cloud/atlas
- Создайте бесплатный кластер
- Получите строку подключения

### 4. Git
```bash
# Проверка Git
git --version

# Установка Git
sudo apt install git  # Ubuntu
brew install git      # macOS
```

---

## 📥 Установка зависимостей

### 1. Клонирование репозитория
```bash
# Клонируйте репозиторий
git clone -b MAL06 https://github.com/Pala4Roka/MY.git eternal-sentinels
cd eternal-sentinels
```

### 2. Установка зависимостей Backend (Python)
```bash
cd backend

# Создание виртуального окружения
python3 -m venv venv

# Активация виртуального окружения
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Установка зависимостей
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Установка зависимостей Frontend (React)
```bash
cd ../frontend

# Установка зависимостей через Yarn (рекомендуется)
yarn install

# Или через npm (если нет Yarn)
npm install
```

---

## 🗄 Настройка базы данных

### Вариант 1: Локальная MongoDB

1. **Запустите MongoDB**:
```bash
sudo systemctl start mongod
```

2. **Проверьте подключение**:
```bash
mongosh
# В консоли MongoDB:
show dbs
exit
```

### Вариант 2: MongoDB Atlas (облачная)

1. Создайте бесплатный кластер на https://www.mongodb.com/cloud/atlas
2. Создайте пользователя базы данных
3. Добавьте IP-адрес в белый список (или разрешите доступ отовсюду: 0.0.0.0/0)
4. Скопируйте строку подключения (будет использована в .env)

**Пример строки подключения Atlas:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## ⚙️ Настройка окружения

### 1. Backend Environment (.env)

Создайте файл `/backend/.env`:

```bash
cd backend
nano .env
```

**Содержимое файла `.env`:**

```env
# MongoDB Configuration
# Для локальной MongoDB:
MONGO_URL="mongodb://localhost:27017"

# Для MongoDB Atlas (замените на вашу строку):
# MONGO_URL="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/"

# Database Name
DB_NAME="eternal_sentinels_db"

# CORS Origins (для разработки можно оставить *)
CORS_ORIGINS="*"

# Emergent LLM Key (для AI чата с MAL0)
# Получите ключ через Emergent или используйте OpenAI API key
EMERGENT_LLM_KEY="your_emergent_llm_key_here"

# Если используете OpenAI напрямую:
# OPENAI_API_KEY="your_openai_api_key_here"
```

**Где получить ключи:**
- **Emergent LLM Key**: https://emergent.sh (универсальный ключ для OpenAI, Anthropic, Google)
- **OpenAI API Key**: https://platform.openai.com/api-keys

### 2. Frontend Environment (.env)

Создайте файл `/frontend/.env`:

```bash
cd ../frontend
nano .env
```

**Содержимое файла `.env`:**

```env
# Backend API URL
# Для локальной разработки:
REACT_APP_BACKEND_URL=http://localhost:8001

# Для production (замените на ваш домен):
# REACT_APP_BACKEND_URL=https://your-domain.com

# WebSocket port (для development server)
WDS_SOCKET_PORT=443

# Visual edits (для разработки)
REACT_APP_ENABLE_VISUAL_EDITS=true

# Health check
ENABLE_HEALTH_CHECK=false
```

---

## 🚀 Запуск приложения

### Вариант 1: Локальная разработка

#### 1. Запуск Backend

```bash
cd backend

# Активируйте виртуальное окружение (если не активно)
source venv/bin/activate  # Linux/macOS
# или
venv\Scripts\activate     # Windows

# Запуск сервера
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Backend будет доступен на**: http://localhost:8001

#### 2. Запуск Frontend (в новом терминале)

```bash
cd frontend

# Запуск React приложения
yarn start
# или
npm start
```

**Frontend будет доступен на**: http://localhost:3000

### Вариант 2: Production запуск с Supervisor

Для production рекомендуется использовать supervisor для управления процессами.

#### 1. Установка Supervisor

```bash
sudo apt install supervisor
```

#### 2. Конфигурация Backend

Создайте файл `/etc/supervisor/conf.d/eternal-sentinels-backend.conf`:

```ini
[program:eternal-sentinels-backend]
directory=/path/to/eternal-sentinels/backend
command=/path/to/eternal-sentinels/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/es-backend.err.log
stdout_logfile=/var/log/supervisor/es-backend.out.log
environment=PATH="/path/to/eternal-sentinels/backend/venv/bin"
```

#### 3. Конфигурация Frontend

Для production frontend нужно собрать:

```bash
cd frontend
yarn build
# или
npm run build
```

Затем настройте Nginx для раздачи статики:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend static files
    location / {
        root /path/to/eternal-sentinels/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 4. Перезапуск Supervisor

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start eternal-sentinels-backend
sudo supervisorctl status
```

---

## 🌐 Развертывание на хостинге

### Option 1: VPS (DigitalOcean, Linode, AWS EC2)

1. **Подготовка сервера**:
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых компонентов
sudo apt install -y python3.11 python3.11-venv nodejs npm git nginx supervisor mongodb-org

# Установка Yarn
npm install -g yarn
```

2. **Клонирование и настройка проекта** (см. разделы выше)

3. **Настройка Nginx** (см. пример конфигурации выше)

4. **Настройка SSL (Let's Encrypt)**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 2: Heroku

1. **Установка Heroku CLI**:
```bash
curl https://cli-assets.heroku.com/install.sh | sh
heroku login
```

2. **Создание приложений**:
```bash
# Backend
cd backend
heroku create your-app-backend
heroku addons:create mongolab:sandbox
git push heroku main

# Frontend
cd ../frontend
heroku create your-app-frontend
heroku config:set REACT_APP_BACKEND_URL=https://your-app-backend.herokuapp.com
git push heroku main
```

### Option 3: Docker

Создайте `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=eternal_sentinels_db
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8001
    depends_on:
      - backend

volumes:
  mongo-data:
```

Запуск:
```bash
docker-compose up -d
```

---

## 📁 Структура проекта

```
eternal-sentinels/
├── backend/                    # Backend (FastAPI + Python)
│   ├── server.py              # Основной файл сервера
│   ├── models.py              # Pydantic модели
│   ├── auth_utils.py          # Утилиты аутентификации
│   ├── scp_data.py            # Данные SCP объектов
│   ├── requirements.txt       # Python зависимости
│   ├── .env                   # Переменные окружения (не в git)
│   └── venv/                  # Виртуальное окружение Python
│
├── frontend/                   # Frontend (React)
│   ├── public/                # Статические файлы
│   │   └── assets/           # Изображения, иконки
│   ├── src/                   # Исходный код React
│   │   ├── components/       # React компоненты
│   │   │   ├── MAL0Model.js # 3D модель MAL0
│   │   │   └── ESLogo.js    # Логотип
│   │   ├── pages/            # Страницы
│   │   │   ├── LoginPage.js
│   │   │   ├── HomePage.js
│   │   │   ├── ProfilePage.js
│   │   │   └── AdminPanel.js
│   │   ├── api.js            # API клиент
│   │   ├── App.js            # Главный компонент
│   │   └── index.js          # Точка входа
│   ├── package.json           # Node.js зависимости
│   ├── .env                   # Переменные окружения (не в git)
│   └── node_modules/          # Node.js модули
│
├── tests/                      # Тесты
├── test_result.md             # Результаты тестирования
├── README.md                  # Основная документация
└── INSTALLATION_GUIDE.md      # Эта инструкция
```

---

## 🔧 Решение проблем

### Проблема: Backend не запускается

**Ошибка**: `ModuleNotFoundError: No module named 'emergentintegrations'`

**Решение**:
```bash
cd backend
source venv/bin/activate
pip install emergentintegrations
```

---

### Проблема: MongoDB не подключается

**Ошибка**: `pymongo.errors.ServerSelectionTimeoutError`

**Решение**:
1. Проверьте, запущен ли MongoDB:
```bash
sudo systemctl status mongod
sudo systemctl start mongod
```

2. Проверьте строку подключения в `.env`
3. Для MongoDB Atlas - проверьте белый список IP

---

### Проблема: Frontend не может подключиться к Backend

**Ошибка**: `Network Error` или CORS ошибки

**Решение**:
1. Убедитесь, что Backend запущен на правильном порту
2. Проверьте `REACT_APP_BACKEND_URL` в `frontend/.env`
3. Убедитесь, что `CORS_ORIGINS` в `backend/.env` включает ваш Frontend URL
4. Убедитесь, что все API роуты имеют префикс `/api`

---

### Проблема: 3D модель не отображается

**Статус**: ✅ ИСПРАВЛЕНО

Изначально файл `Mal0_Base_20.glb` (121MB) не был загружен в репозиторий.

**Решение**: Создан процедурный 3D placeholder с использованием Three.js геометрических форм, который имитирует MAL0 (волчий череп с светящимися красными глазами).

---

### Проблема: Ошибка после аутентификации

**Статус**: ✅ ПРОВЕРЕНО - Работает корректно

Личный кабинет и все функции работают без ошибок после входа.

---

### Проблема: AI чат не отвечает

**Возможные причины**:
1. Отсутствует `EMERGENT_LLM_KEY` в `.env`
2. Закончился баланс на ключе
3. Проблемы с сетью

**Решение**:
1. Проверьте наличие ключа в `backend/.env`
2. Проверьте баланс на https://emergent.sh
3. Проверьте логи Backend:
```bash
tail -f /var/log/supervisor/backend.err.log
```

---

## 👥 Учетные данные по умолчанию

После первого запуска автоматически создается администратор:

- **Username**: `admin`
- **Password**: `admin123`
- **Clearance Level**: 5 (Absolute/Annihilation)

**⚠️ ВАЖНО**: Смените пароль администратора после первого входа!

---

## 🎯 Основные возможности

### 1. Система аутентификации (JWT)
- Регистрация и вход пользователей
- Хранение токенов в localStorage
- Автоматическое продление сессии

### 2. Уровни допуска (Clearance Levels)
- **Level 1-2**: Threat - базовые объекты
- **Level 3**: Hazard/Cataclysm - опасные объекты
- **Level 4**: Collapse/Apex - критические объекты
- **Level 5**: Absolute/Annihilation - все объекты + секретная информация

### 3. AI ассистент MAL0
- Персонализированные ответы на основе уровня допуска
- Романтическое поведение для администратора "Палач Рока"
- Использует GPT-4o-mini через Emergent LLM

### 4. 3D визуализация MAL0
- Процедурная 3D модель с Three.js
- Анимации idle и реакции на разговор
- Светящиеся эффекты

### 5. Личный кабинет
- Информация о пользователе
- Визуализация доступных уровней допуска
- Статус аккаунта

### 6. Админ-панель
- Управление пользователями
- Редактирование SCP объектов
- Изменение уровней допуска

---

## 📚 Дополнительные ресурсы

- **FastAPI документация**: https://fastapi.tiangolo.com/
- **React документация**: https://react.dev/
- **Three.js документация**: https://threejs.org/docs/
- **MongoDB документация**: https://www.mongodb.com/docs/
- **Emergent LLM**: https://emergent.sh/docs

---

## 🆘 Поддержка

Если у вас возникли проблемы с установкой:

1. Проверьте все логи:
```bash
# Backend logs
tail -f /var/log/supervisor/backend.err.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

2. Проверьте статус сервисов:
```bash
sudo supervisorctl status
sudo systemctl status mongod
sudo systemctl status nginx
```

3. Создайте issue в GitHub репозитории с описанием проблемы

---

## ✅ Чек-лист установки

- [ ] Установлены все необходимые компоненты (Node.js, Python, MongoDB)
- [ ] Репозиторий склонирован
- [ ] Backend зависимости установлены
- [ ] Frontend зависимости установлены
- [ ] MongoDB запущен и доступен
- [ ] Файлы `.env` созданы и заполнены
- [ ] Backend запущен и отвечает на http://localhost:8001
- [ ] Frontend запущен и доступен на http://localhost:3000
- [ ] Можно войти с учетными данными admin/admin123
- [ ] 3D модель MAL0 отображается
- [ ] AI чат работает
- [ ] Личный кабинет открывается без ошибок

---

**Версия документа**: 1.0  
**Дата последнего обновления**: 16 октября 2025 г.  
**Автор**: E1 Agent

---

🎉 **Поздравляем! Если вы выполнили все шаги, ваш сайт Eternal Sentinels готов к работе!**
