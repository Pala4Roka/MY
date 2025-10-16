# 📋 ПОЛНАЯ ИНСТРУКЦИЯ ПО УСТАНОВКЕ И РАЗВЕРТЫВАНИЮ
## Eternal Sentinels Database System

---

## 📑 СОДЕРЖАНИЕ

1. [Системные требования](#системные-требования)
2. [Загрузка и установка](#загрузка-и-установка)
3. [Настройка базы данных MongoDB](#настройка-базы-данных-mongodb)
4. [Настройка Backend (Python/FastAPI)](#настройка-backend-pythonfastapi)
5. [Настройка Frontend (React)](#настройка-frontend-react)
6. [Запуск приложения](#запуск-приложения)
7. [Тестирование](#тестирование)
8. [Решение проблем](#решение-проблем)
9. [Production развертывание](#production-развертывание)

---

## 1. СИСТЕМНЫЕ ТРЕБОВАНИЯ

### Минимальные требования:
- **ОС**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)
- **Процессор**: 2-ядерный процессор (2 ГГц+)
- **ОЗУ**: 4 ГБ (8 ГБ рекомендуется)
- **Место на диске**: 5 ГБ свободного места
- **Интернет**: Для установки зависимостей

### Необходимое ПО:
- **Node.js**: версия 16.x или выше ([скачать](https://nodejs.org/))
- **Python**: версия 3.9 или выше ([скачать](https://www.python.org/))
- **MongoDB**: версия 5.0 или выше ([скачать](https://www.mongodb.com/try/download/community))
- **Git**: для клонирования репозитория ([скачать](https://git-scm.com/))
- **Yarn**: (npm install -g yarn)

---

## 2. ЗАГРУЗКА И УСТАНОВКА

### Шаг 1: Установка Node.js

**Windows:**
1. Скачайте установщик с [nodejs.org](https://nodejs.org/)
2. Запустите установщик и следуйте инструкциям
3. Перезапустите компьютер после установки
4. Проверьте установку:
```bash
node --version
npm --version
```

**macOS:**
```bash
# Используя Homebrew
brew install node

# Проверка
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
# Добавить NodeSource репозиторий
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Установить Node.js
sudo apt-get install -y nodejs

# Проверка
node --version
npm --version
```

### Шаг 2: Установка Python

**Windows:**
1. Скачайте установщик с [python.org](https://www.python.org/downloads/)
2. **ВАЖНО**: Отметьте "Add Python to PATH" при установке
3. Запустите установщик
4. Проверьте установку:
```bash
python --version
pip --version
```

**macOS:**
```bash
# Используя Homebrew
brew install python@3.11

# Проверка
python3 --version
pip3 --version
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install python3 python3-pip python3-venv

# Проверка
python3 --version
pip3 --version
```

### Шаг 3: Установка MongoDB

**Windows:**
1. Скачайте MongoDB Community Server с [mongodb.com](https://www.mongodb.com/try/download/community)
2. Запустите установщик
3. Выберите "Complete" установку
4. Отметьте "Install MongoDB as a Service"
5. После установки MongoDB запустится автоматически

Проверка:
```bash
# В командной строке
mongod --version
```

**macOS:**
```bash
# Используя Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Запуск MongoDB
brew services start mongodb-community@7.0

# Проверка
mongosh --version
```

**Linux (Ubuntu/Debian):**
```bash
# Импорт публичного ключа
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Добавить репозиторий
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Обновить и установить
sudo apt-get update
sudo apt-get install -y mongodb-org

# Запустить MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Проверка
mongosh --version
```

### Шаг 4: Установка Yarn

```bash
npm install -g yarn

# Проверка
yarn --version
```

---

## 3. СКАЧИВАНИЕ ПРОЕКТА

### Вариант 1: Клонирование через Git

```bash
# Клонировать репозиторий
git clone https://github.com/Pala4Roka/MY.git

# Перейти в папку проекта
cd MY

# Переключиться на ветку MAL07
git checkout MAL07
```

### Вариант 2: Скачивание архива

1. Перейдите на [https://github.com/Pala4Roka/MY/tree/MAL07](https://github.com/Pala4Roka/MY/tree/MAL07)
2. Нажмите зеленую кнопку "Code"
3. Выберите "Download ZIP"
4. Разархивируйте файл в любую папку
5. Откройте терминал/командную строку в этой папке

---

## 4. НАСТРОЙКА БАЗЫ ДАННЫХ MONGODB

### Шаг 1: Проверка работы MongoDB

**Windows:**
```bash
# Проверить статус службы
sc query MongoDB

# Если не запущен, запустить:
net start MongoDB
```

**macOS:**
```bash
# Проверить статус
brew services list | grep mongodb

# Запустить, если не запущен
brew services start mongodb-community@7.0
```

**Linux:**
```bash
# Проверить статус
sudo systemctl status mongod

# Запустить, если не запущен
sudo systemctl start mongod
```

### Шаг 2: Подключение к MongoDB

```bash
# Открыть MongoDB shell
mongosh

# Должно показать:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017/...
```

### Шаг 3: Создание базы данных (опционально)

База данных создастся автоматически при первом запуске приложения, но вы можете создать её вручную:

```javascript
// В mongosh
use eternal_sentinels_db

// Создать тестовую коллекцию
db.test.insertOne({ test: "data" })

// Проверить базы данных
show dbs

// Выйти
exit
```

---

## 5. НАСТРОЙКА BACKEND (Python/FastAPI)

### Шаг 1: Перейти в папку backend

```bash
cd backend
```

### Шаг 2: Создать виртуальное окружение (рекомендуется)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

После активации вы увидите `(venv)` в начале строки терминала.

### Шаг 3: Установить зависимости

```bash
pip install -r requirements.txt
```

Это установит все необходимые Python пакеты:
- FastAPI - веб-фреймворк
- Motor - асинхронный драйвер MongoDB
- Uvicorn - ASGI сервер
- Pydantic - валидация данных
- python-dotenv - работа с переменными окружения
- emergentintegrations - AI интеграция

### Шаг 4: Настроить переменные окружения

Создайте файл `.env` в папке `backend` или отредактируйте существующий:

```bash
# Windows
copy .env.example .env
notepad .env

# macOS/Linux
cp .env.example .env
nano .env
```

Содержимое файла `.env`:
```env
# MongoDB настройки
MONGO_URL=mongodb://localhost:27017
DB_NAME=eternal_sentinels_db

# CORS настройки (для локальной разработки)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Emergent LLM Key для AI чата (уже настроен)
EMERGENT_LLM_KEY=sk-emergent-0B0B5A7D7B4C2Ff454
```

**Важные замечания:**
- `MONGO_URL` - адрес MongoDB (оставьте по умолчанию для локальной установки)
- `DB_NAME` - имя базы данных (можно изменить)
- `CORS_ORIGINS` - разрешенные источники для CORS
- `EMERGENT_LLM_KEY` - ключ для AI функционала (уже включен)

### Шаг 5: Тестовый запуск backend

```bash
# Убедитесь, что вы в папке backend и venv активирован
python server.py
```

Или используя uvicorn:
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Вы должны увидеть:
```
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

Проверьте работу, открыв в браузере:
- [http://localhost:8001/api](http://localhost:8001/api) - должен показать JSON с информацией об API
- [http://localhost:8001/docs](http://localhost:8001/docs) - интерактивная документация API (Swagger)

**Нажмите CTRL+C чтобы остановить сервер перед переходом к следующему шагу.**

---

## 6. НАСТРОЙКА FRONTEND (React)

### Шаг 1: Перейти в папку frontend

```bash
# Если вы в папке backend
cd ../frontend

# Или из корневой папки проекта
cd frontend
```

### Шаг 2: Установить зависимости

```bash
yarn install
```

Это может занять несколько минут. Yarn установит все необходимые пакеты:
- React - UI библиотека
- React Router - маршрутизация
- Three.js - для 3D модели
- Axios - HTTP клиент
- Tailwind CSS - стилизация

### Шаг 3: Настроить переменные окружения

Создайте или отредактируйте файл `.env` в папке `frontend`:

```bash
# Windows
copy .env.example .env
notepad .env

# macOS/Linux
cp .env.example .env
nano .env
```

Содержимое файла `.env`:
```env
# Backend URL для локальной разработки
REACT_APP_BACKEND_URL=http://localhost:8001

# Настройки WebSocket (для Hot Reload)
WDS_SOCKET_PORT=3000
```

**Важные замечания:**
- `REACT_APP_BACKEND_URL` - адрес backend API
- Для локальной разработки: `http://localhost:8001`
- Для production: измените на ваш домен

### Шаг 4: Проверить наличие 3D модели

Убедитесь, что файл `Mal0_Base_20.glb` находится в папке `frontend/public/`:

```bash
# Windows
dir public\Mal0_Base_20.glb

# macOS/Linux
ls -lh public/Mal0_Base_20.glb
```

Файл должен быть размером около 121 МБ. Если файла нет, скачайте его и поместите в `frontend/public/`.

### Шаг 5: Тестовый запуск frontend

```bash
# Убедитесь, что вы в папке frontend
yarn start
```

Приложение запустится и автоматически откроется в браузере на [http://localhost:3000](http://localhost:3000)

Вы должны увидеть:
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**Не закрывайте это окно терминала - frontend должен работать постоянно.**

---

## 7. ЗАПУСК ПРИЛОЖЕНИЯ

### Для разработки (2 терминала)

**Терминал 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Терминал 2 - Frontend:**
```bash
cd frontend
yarn start
```

### Использование screen/tmux (Linux/macOS)

```bash
# Установить screen
sudo apt install screen  # Ubuntu/Debian
brew install screen      # macOS

# Запустить backend в фоне
screen -S backend
cd backend && source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
# Нажать Ctrl+A затем D для отсоединения

# Запустить frontend в фоне
screen -S frontend
cd frontend && yarn start
# Нажать Ctrl+A затем D для отсоединения

# Просмотр активных сессий
screen -ls

# Подключиться к сессии
screen -r backend
screen -r frontend
```

---

## 8. ТЕСТИРОВАНИЕ

### Шаг 1: Открыть приложение

Откройте браузер и перейдите на [http://localhost:3000](http://localhost:3000)

### Шаг 2: Вход в систему

Используйте учетные данные администратора:
- **Username**: `admin`
- **Password**: `admin123`
- **Уровень допуска**: 5 (максимальный)

### Шаг 3: Проверка функционала

1. **Главная страница**:
   - Проверьте отображение логотипа Eternal Sentinels
   - Убедитесь, что список SCP объектов загружается

2. **3D Модель MAL0**:
   - Модель должна загрузиться (может занять до 30 секунд)
   - Проверьте анимации (модель должна двигаться)
   - Попробуйте разные эмоции (если доступны)

3. **AI Чат с MAL0**:
   - Откройте чат
   - Отправьте сообщение: "Привет, MAL0!"
   - Проверьте ответ AI (должен быть на русском языке)
   - Для admin'a ответы должны быть романтичными

4. **Личный кабинет**:
   - Перейдите в профиль
   - Проверьте отображение информации о пользователе

5. **Админ-панель**:
   - Перейдите в админ-панель
   - Проверьте управление пользователями
   - Попробуйте редактировать досье объекта
   - Скачайте досье (должен скачаться .txt файл)

### Шаг 4: Тестирование на мобильных устройствах

1. Найдите IP адрес вашего компьютера:
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   # или
   ip addr show
   ```

2. На мобильном устройстве (должно быть в той же сети):
   - Откройте браузер
   - Перейдите на `http://[ВАШ_IP]:3000`
   - Например: `http://192.168.1.100:3000`

3. Проверьте адаптивность интерфейса

---

## 9. РЕШЕНИЕ ПРОБЛЕМ

### Проблема: MongoDB не запускается

**Windows:**
```bash
# Проверить службу
sc query MongoDB

# Запустить службу
net start MongoDB

# Если не помогает, запустить вручную
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
```

**macOS/Linux:**
```bash
# Проверить статус
sudo systemctl status mongod

# Перезапустить
sudo systemctl restart mongod

# Проверить логи
sudo tail -f /var/log/mongodb/mongod.log
```

### Проблема: Backend не запускается

**Ошибка: "ModuleNotFoundError"**
```bash
# Убедитесь, что venv активирован
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Переустановить зависимости
pip install -r requirements.txt
```

**Ошибка: "Address already in use"**
```bash
# Windows
netstat -ano | findstr :8001
taskkill /PID [PID] /F

# Linux/macOS
lsof -ti:8001 | xargs kill -9
```

**Ошибка: "Can't connect to MongoDB"**
- Проверьте, что MongoDB запущен
- Проверьте MONGO_URL в .env файле
- Попробуйте подключиться через mongosh

### Проблема: Frontend не запускается

**Ошибка: "Port 3000 is already in use"**
```bash
# Изменить порт в package.json
# или убить процесс на порту 3000

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9
```

**Ошибка: "Cannot find module"**
```bash
# Удалить node_modules и переустановить
rm -rf node_modules package-lock.json yarn.lock
yarn install
```

### Проблема: 3D модель не загружается

1. Проверьте, что файл `Mal0_Base_20.glb` находится в `frontend/public/`
2. Проверьте размер файла (должен быть ~121 МБ)
3. Откройте консоль браузера (F12) для просмотра ошибок
4. Подождите 30-60 секунд - файл большой

### Проблема: AI чат не работает

1. Проверьте наличие EMERGENT_LLM_KEY в backend/.env
2. Проверьте логи backend:
   ```bash
   # В терминале где запущен backend
   # Должны быть сообщения при отправке сообщений в чат
   ```
3. Проверьте интернет соединение

### Проблема: CORS ошибки

Добавьте адрес frontend в CORS_ORIGINS в backend/.env:
```env
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://192.168.1.100:3000
```

### Проблема: Два разных порта

Это **нормально** и **правильно**! Это стандартная архитектура разработки:
- **Frontend (React)**: работает на порту 3000
- **Backend (FastAPI)**: работает на порту 8001

Frontend автоматически отправляет запросы к backend используя переменную `REACT_APP_BACKEND_URL` из `.env` файла.

В production окружении (например, на сервере) оба могут работать на одном порту через nginx или другой reverse proxy.

---

## 10. PRODUCTION РАЗВЕРТЫВАНИЕ

### Вариант 1: Использование Supervisor (Linux)

1. Установить supervisor:
```bash
sudo apt install supervisor
```

2. Создать конфигурацию для backend (`/etc/supervisor/conf.d/eternal-backend.conf`):
```ini
[program:eternal-backend]
directory=/path/to/MY/backend
command=/path/to/MY/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
user=your_user
autostart=true
autorestart=true
stderr_logfile=/var/log/eternal-backend.err.log
stdout_logfile=/var/log/eternal-backend.out.log
```

3. Собрать frontend для production:
```bash
cd frontend
yarn build
```

4. Настроить Nginx для раздачи frontend и проксирования backend:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/MY/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

5. Перезапустить службы:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start eternal-backend
sudo systemctl reload nginx
```

### Вариант 2: Использование Docker

1. Создать Dockerfile для backend:
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

2. Создать docker-compose.yml:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

3. Запустить:
```bash
docker-compose up -d
```

### Вариант 3: Развертывание на VPS/Cloud

**Подготовка сервера (Ubuntu 20.04+):**
```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить необходимое ПО
sudo apt install -y nginx python3-pip python3-venv nodejs npm mongodb git

# Установить yarn
sudo npm install -g yarn

# Клонировать репозиторий
git clone https://github.com/Pala4Roka/MY.git
cd MY
git checkout MAL07

# Настроить backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Настроить .env файлы
nano .env  # Установить MONGO_URL, EMERGENT_LLM_KEY и т.д.

# Настроить frontend
cd ../frontend
yarn install
nano .env  # Установить REACT_APP_BACKEND_URL на ваш домен
yarn build

# Настроить nginx (см. выше)
# Настроить supervisor (см. выше)
```

---

## 11. БЕЗОПАСНОСТЬ

### Для Production окружения:

1. **Изменить учетные данные администратора**:
   - Войти как admin
   - Изменить пароль через админ-панель
   - Или изменить в коде (backend/server.py, функция initialize_database)

2. **Настроить HTTPS**:
   - Получить SSL сертификат (Let's Encrypt)
   - Настроить nginx для HTTPS

3. **Ограничить CORS**:
   ```env
   CORS_ORIGINS=https://your-domain.com
   ```

4. **Защитить MongoDB**:
   - Включить аутентификацию
   - Создать пользователя с ограниченными правами
   - Обновить MONGO_URL с credentials

5. **Использовать переменные окружения**:
   - Не коммитить .env файлы в Git
   - Использовать secrets в CI/CD

---

## 12. ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

### Официальная документация:
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Three.js](https://threejs.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Полезные команды:

**Проверка версий:**
```bash
node --version
python --version
mongod --version
yarn --version
```

**Очистка и переустановка:**
```bash
# Backend
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules yarn.lock
yarn install
```

**Просмотр логов:**
```bash
# Backend (если запущен в терминале)
# Логи видны в терминале

# MongoDB
sudo tail -f /var/log/mongodb/mongod.log

# Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 13. ПОДДЕРЖКА

### Если у вас возникли проблемы:

1. Проверьте [раздел решения проблем](#9-решение-проблем)
2. Проверьте логи всех компонентов
3. Убедитесь, что все зависимости установлены правильно
4. Проверьте, что все службы запущены (MongoDB, backend, frontend)

### Контрольный список перед запуском:

- ✅ Node.js установлен (v16+)
- ✅ Python установлен (v3.9+)
- ✅ MongoDB установлен и запущен
- ✅ Yarn установлен
- ✅ Репозиторий склонирован/скачан
- ✅ Backend зависимости установлены (pip install -r requirements.txt)
- ✅ Frontend зависимости установлены (yarn install)
- ✅ Файл .env настроен в backend
- ✅ Файл .env настроен в frontend
- ✅ 3D модель Mal0_Base_20.glb находится в frontend/public/
- ✅ Backend запущен на порту 8001
- ✅ Frontend запущен на порту 3000
- ✅ Логин работает (admin/admin123)

---

## 14. АРХИТЕКТУРА ПРОЕКТА

```
MY/
├── backend/              # FastAPI Backend
│   ├── server.py        # Главный файл сервера
│   ├── models.py        # Pydantic модели
│   ├── auth_utils.py    # JWT аутентификация
│   ├── scp_data.py      # Начальные данные SCP
│   ├── requirements.txt # Python зависимости
│   ├── .env            # Переменные окружения
│   └── venv/           # Виртуальное окружение
│
├── frontend/            # React Frontend
│   ├── public/
│   │   ├── Mal0_Base_20.glb  # 3D модель (121MB)
│   │   └── index.html
│   ├── src/
│   │   ├── components/       # React компоненты
│   │   │   ├── MAL0Model.js  # 3D модель с анимациями
│   │   │   ├── ChatInterface.js
│   │   │   └── ...
│   │   ├── pages/            # Страницы
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── ProfilePage.js
│   │   │   └── AdminPanel.js
│   │   ├── api.js            # API клиент
│   │   └── App.js            # Главный компонент
│   ├── package.json          # Node.js зависимости
│   ├── .env                  # Переменные окружения
│   └── tailwind.config.js    # Tailwind настройки
│
├── tests/                    # Тесты
├── INSTALLATION_GUIDE_RU.md  # Эта инструкция
└── README.md                 # Краткое описание

```

---

## 15. ФУНКЦИОНАЛ ПРИЛОЖЕНИЯ

### Основные возможности:

1. **Система аутентификации**:
   - Регистрация пользователей
   - JWT токены
   - Уровни допуска (1-5)

2. **База данных SCP объектов**:
   - 21 предустановленный объект
   - Система классификации угроз
   - Ограничение доступа по уровню

3. **AI чат с MAL0**:
   - Персонализированные ответы
   - Различное поведение для admin и обычных пользователей
   - Использование Emergent LLM Key

4. **3D визуализация**:
   - Полная 3D модель MAL0 (121MB)
   - 6 эмоциональных анимаций:
     - Idle (спокойное)
     - Nervous (нервное)
     - Sleepy (сонное)
     - Sleeping (спящее)
     - Playful (игривое)
     - Happy (счастливое)
   - Адаптивное отображение (50% тела)

5. **Админ-панель**:
   - Управление пользователями
   - Редактирование досье объектов
   - Скачивание досье в текстовом формате
   - Управление уровнями допуска

6. **Адаптивный дизайн**:
   - Оптимизация для desktop
   - Оптимизация для планшетов
   - Оптимизация для мобильных устройств

---

## 🎉 ГОТОВО!

Если вы следовали всем шагам, ваше приложение Eternal Sentinels должно работать!

**Дефолтный доступ:**
- URL: [http://localhost:3000](http://localhost:3000)
- Username: `admin`
- Password: `admin123`
- Уровень допуска: 5

Наслаждайтесь использованием системы! 🛡️

---

**Версия инструкции:** 2.0  
**Дата последнего обновления:** 2025  
**Eternal Sentinels © 2025**
