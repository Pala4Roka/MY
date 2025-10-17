# Руководство по установке и запуску сайта Eternal Sentinels

## Описание
Eternal Sentinels Database - это полнофункциональная веб-система управления базой данных аномальных объектов с AI-ассистентом MAL0.

## Требования к системе

### Минимальные требования:
- **Node.js**: версия 18.x или выше
- **Python**: версия 3.10 или выше
- **MongoDB**: версия 6.0 или выше
- **Операционная система**: Linux, macOS или Windows
- **RAM**: минимум 4GB
- **Свободное место на диске**: минимум 2GB

## Шаг 1: Клонирование репозитория

```bash
# Клонируйте репозиторий из GitHub
git clone -b MAL09.7 https://github.com/Pala4Roka/MY.git eternal-sentinels

# Перейдите в директорию проекта
cd eternal-sentinels
```

## Шаг 2: Установка MongoDB

### Для Ubuntu/Debian:
```bash
# Импортируйте публичный ключ GPG
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Добавьте репозиторий MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Обновите список пакетов и установите MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Запустите MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Для macOS:
```bash
# Установите через Homebrew
brew tap mongodb/brew
brew install mongodb-community@6.0

# Запустите MongoDB
brew services start mongodb-community@6.0
```

### Для Windows:
Скачайте и установите MongoDB с официального сайта: https://www.mongodb.com/try/download/community

## Шаг 3: Настройка Backend

```bash
# Перейдите в директорию backend
cd backend

# Создайте виртуальное окружение Python
python -m venv venv

# Активируйте виртуальное окружение
# Для Linux/macOS:
source venv/bin/activate
# Для Windows:
venv\Scripts\activate

# Установите зависимости
pip install -r requirements.txt

# Создайте файл .env (если его нет)
touch .env
```

### Настройка файла `.env` для backend:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
EMERGENT_LLM_KEY="ваш_ключ_здесь"
```

**Важно**: Для работы AI-ассистента MAL0 необходим ключ `EMERGENT_LLM_KEY`. Получите его или используйте свой ключ OpenAI API.

## Шаг 4: Настройка Frontend

```bash
# Перейдите в директорию frontend
cd ../frontend

# Установите Yarn (если не установлен)
npm install -g yarn

# Установите зависимости
yarn install

# Создайте файл .env
touch .env
```

### Настройка файла `.env` для frontend:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
REACT_APP_ENABLE_VISUAL_EDITS=true
ENABLE_HEALTH_CHECK=false
```

## Шаг 5: Запуск приложения

### Запуск Backend:
```bash
# Перейдите в директорию backend
cd backend

# Активируйте виртуальное окружение (если не активировано)
source venv/bin/activate  # Linux/macOS
# или
venv\Scripts\activate  # Windows

# Запустите сервер
python server.py
```

Backend будет доступен по адресу: `http://localhost:8001`

### Запуск Frontend (в отдельном терминале):
```bash
# Перейдите в директорию frontend
cd frontend

# Запустите сервер разработки
yarn start
```

Frontend будет доступен по адресу: `http://localhost:3000`

## Шаг 6: Первый вход

1. Откройте браузер и перейдите по адресу: `http://localhost:3000`
2. Используйте учетные данные по умолчанию:
   - **Логин**: `admin`
   - **Пароль**: `admin123`
   - **Уровень допуска**: 5 (Максимальный)

## Проверка установки

### Проверка Backend:
```bash
curl http://localhost:8001/api/
```

Ожидаемый ответ:
```json
{
  "message": "Eternal Sentinels Database API",
  "version": "2.0",
  "features": [
    "Authentication with JWT",
    "Clearance-based access control",
    "MAL0 AI assistant (professional mode)",
    "Admin panel for object and user management"
  ]
}
```

### Проверка MongoDB:
```bash
mongosh
> use test_database
> db.scp_objects.countDocuments()
```

Должно вернуть количество объектов (18 по умолчанию).

## Возможные проблемы и решения

### Проблема: MongoDB не запускается
**Решение**: Проверьте, не занят ли порт 27017:
```bash
sudo lsof -i :27017
# Если занят, остановите процесс или измените порт в .env
```

### Проблема: Backend не запускается
**Решение**: Проверьте, установлены ли все зависимости:
```bash
pip install -r requirements.txt --force-reinstall
```

### Проблема: Frontend показывает ошибку сети
**Решение**: Убедитесь, что:
1. Backend запущен и доступен
2. В frontend/.env правильно указан REACT_APP_BACKEND_URL
3. CORS настроен правильно в backend/.env

### Проблема: Видео в MAL0 не загружаются
**Решение**: Добавьте файлы видео в `frontend/public/videos/`:
- `video1.mp4`
- `video2.mp4`

## Production Deployment

Для развертывания в production:

### Backend:
```bash
# Используйте gunicorn или uvicorn с production настройками
pip install gunicorn
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8001
```

### Frontend:
```bash
# Создайте production build
yarn build

# Разверните содержимое папки build на веб-сервере (Nginx, Apache)
```

## Поддержка

При возникновении проблем:
1. Проверьте логи backend и frontend
2. Убедитесь, что все зависимости установлены
3. Проверьте настройки .env файлов
4. Убедитесь, что MongoDB запущен и доступен

## Результат

После успешной установки вы получите полнофункциональную систему с:
- ✅ Системой аутентификации и уровнями допуска
- ✅ Базой данных из 18 аномальных объектов
- ✅ AI-ассистентом MAL0
- ✅ Админ-панелью для управления
- ✅ Круговым меню фильтрации по уровням угрозы
- ✅ 3D каруселью с анимацией вращения
- ✅ Интерактивным видео интерфейсом

Приятной работы с Eternal Sentinels Database!
