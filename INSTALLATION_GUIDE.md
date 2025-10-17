# 📖 ПОЛНАЯ ИНСТРУКЦИЯ ПО УСТАНОВКЕ - Eternal Sentinels Database

## 🎯 О Проекте

**Eternal Sentinels Database** - это веб-приложение для управления базой данных аномальных объектов с AI-ассистентом MAL0 (SCP-1471). Приложение включает:

- 🤖 3D модель MAL0 с костными анимациями и распознаванием эмоций
- 💬 AI-чат с системой уровней допуска
- 📊 База данных объектов с различными классами угрозы
- 👤 Система аутентификации с JWT
- 🎨 Адаптивный дизайн для всех устройств
- 👁 Анимированный логотип с морганием

---

## 🛠 Технологический Стек

### Backend
- **Python 3.11+**
- **FastAPI** - веб-фреймворк
- **MongoDB** - база данных
- **Motor** - async MongoDB драйвер
- **Emergent Integrations** - AI интеграция (GPT-4o-mini)
- **JWT** - аутентификация
- **aiosmtplib** - отправка email

### Frontend
- **React 18** - UI библиотека
- **Three.js** - 3D рендеринг
- **Tailwind CSS** - стилизация
- **Axios** - HTTP клиент
- **React Router** - навигация

---

## 📋 Требования

### Системные Требования
- **OS**: Linux, macOS, или Windows (с WSL)
- **RAM**: Минимум 2GB (рекомендуется 4GB)
- **CPU**: Минимум 2 ядра
- **Disk**: Минимум 500MB свободного места

### Программное Обеспечение
- Python 3.11 или выше
- Node.js 16+ и Yarn
- MongoDB 4.4+
- Git

---

## 🚀 Установка с Нуля

### Шаг 1: Клонирование Репозитория

```bash
# Клонировать репозиторий
git clone --branch MAL08 https://github.com/Pala4Roka/MY.git eternal-sentinels
cd eternal-sentinels
```

### Шаг 2: Установка MongoDB

#### На Linux (Ubuntu/Debian):
```bash
# Установить MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Запустить MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Проверить статус
sudo systemctl status mongod
```

#### На macOS:
```bash
# Установить через Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Запустить MongoDB
brew services start mongodb-community
```

#### На Windows:
- Скачать MongoDB с официального сайта: https://www.mongodb.com/try/download/community
- Установить и запустить как службу

### Шаг 3: Установка Backend

```bash
# Перейти в директорию backend
cd backend

# Создать виртуальное окружение (рекомендуется)
python3 -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Создать .env файл
cp .env.example .env  # Или создать вручную
```

#### Настройка Backend `.env`:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="eternal_sentinels_db"
CORS_ORIGINS="http://localhost:3000"
EMERGENT_LLM_KEY="your-emergent-llm-key-here"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USERNAME="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@eternalsentinels.com"
```

**Важно**: 
- Получите Emergent LLM ключ на https://emergentagent.com
- Для Gmail SMTP используйте App Password (не основной пароль)

### Шаг 4: Установка Frontend

```bash
# Вернуться в корневую директорию
cd ..

# Перейти в директорию frontend
cd frontend

# Установить зависимости через Yarn
yarn install
```

#### Настройка Frontend `.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
```

### Шаг 5: Установка 3D Модели

```bash
# Скачать 3D модель MAL0
# Поместить файл Mal0_Base_20.glb в frontend/public/

# Если у вас есть файл локально:
cp /path/to/Mal0_Base_20.glb frontend/public/
```

---

## ▶️ Запуск Приложения

### Вариант 1: Ручной Запуск (Development)

#### Запуск Backend:
```bash
cd backend
source venv/bin/activate  # Если используете venv
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

#### Запуск Frontend (в другом терминале):
```bash
cd frontend
yarn start
```

Приложение будет доступно по адресу: **http://localhost:3000**

### Вариант 2: Запуск через Supervisor (Production)

#### Установка Supervisor:
```bash
sudo apt-get install supervisor  # На Linux
```

#### Настройка Supervisor:

Создать файл `/etc/supervisor/conf.d/eternal-sentinels.conf`:

```ini
[program:es-backend]
directory=/path/to/eternal-sentinels/backend
command=/path/to/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/es-backend.err.log
stdout_logfile=/var/log/supervisor/es-backend.out.log

[program:es-frontend]
directory=/path/to/eternal-sentinels/frontend
command=yarn start
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/es-frontend.err.log
stdout_logfile=/var/log/supervisor/es-frontend.out.log
```

#### Запуск:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start es-backend
sudo supervisorctl start es-frontend
```

---

## 👤 Первый Вход

После запуска приложения:

1. Откройте **http://localhost:3000**
2. Используйте учетные данные по умолчанию:
   - **Username**: `admin`
   - **Password**: `admin123`
3. **Важно**: Сразу измените пароль администратора!

---

## 🎭 3D Анимации MAL0

### Доступные Анимации

Приложение включает 5 эмоциональных анимаций для MAL0:

1. **Calm (Спокойствие)** 
   - Дыхание
   - Следит за курсором мыши
   - Плавные движения головы

2. **Joy (Радость)**
   - Закрывает глаза
   - Машет хвостом
   - Энергичное дыхание

3. **Playful (Игривость)**
   - Прячет руки за спину
   - Трясет грудью
   - Наклоняет голову

4. **Sad (Печаль)**
   - Опускает уши
   - Обнимает себя одной рукой
   - Опускает голову

5. **Tired (Усталость)**
   - Опирается вперед
   - Закрывает глаза
   - Медленное дыхание

### Автоматическое Переключение Анимаций

Анимации автоматически меняются на основе AI-анализа эмоций в ответах чата MAL0.

---

## 🎨 Создание Собственных Анимаций в Blender

### Требования
- **Blender 3.0+**
- 3D модель Mal0_Base_20.glb

### Пошаговая Инструкция

#### Шаг 1: Импорт Модели в Blender

```
1. Открыть Blender
2. File → Import → glTF 2.0 (.glb)
3. Выбрать Mal0_Base_20.glb
```

#### Шаг 2: Проверка Скелета

```
1. Выбрать модель в Outliner
2. Перейти в Pose Mode (Ctrl+Tab)
3. Проверить наличие костей (868 костей)
```

#### Шаг 3: Создание Анимации

```
1. Переключиться в Animation Workspace
2. Установить временную шкалу (0-60 frames для 2-секундной анимации)
3. В Pose Mode выбрать кости для анимации:
   - Tail (хвост): Tail, Tail.001, Tail.002, Tail.003, Tail.004
   - Ears (уши): Ear.L, Ear.R, EarMaster.L, EarMaster.R
   - Arms (руки): upper_arm.L, upper_arm.R, forearm.L, forearm.R
   - Eyes (глаза): Lid.T.L, Lid.T.R, Lid.B.L, Lid.B.R
   - Spine (позвоночник): DEF-spine, DEF-spine.001, etc.

4. Создать keyframes:
   - Frame 0: Начальная поза → Нажать 'I' → Rotation
   - Frame 30: Промежуточная поза → Нажать 'I' → Rotation
   - Frame 60: Конечная поза → Нажать 'I' → Rotation

5. Настроить интерполяцию:
   - В Graph Editor выбрать Bezier для плавности
```

#### Шаг 4: Экспорт Анимации

```
1. File → Export → glTF 2.0 (.glb)
2. В настройках экспорта:
   - Format: glTF Binary (.glb)
   - Include: Selected Objects
   - Transform: +Y Up
   - Animation: Убедиться что включено
   - Skinning: Включить
3. Сохранить как Mal0_Custom_Animation.glb
```

#### Шаг 5: Интеграция в Приложение

```javascript
// В MAL0ModelNew.js

// Добавить новую эмоцию
const ANIMATION_STATES = {
  CALM: 'calm',
  JOY: 'joy',
  PLAYFUL: 'playful',
  SAD: 'sad',
  TIRED: 'tired',
  CUSTOM: 'custom'  // Ваша новая анимация
};

// Загрузить модель с анимациями
loader.load(
  '/Mal0_Custom_Animation.glb',
  (gltf) => {
    const model = gltf.scene;
    
    // Если экспортированы анимации из Blender
    if (gltf.animations && gltf.animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(model);
      const customAction = mixerRef.current.clipAction(gltf.animations[0]);
      customAction.play();
    }
    
    // Остальной код...
  }
);
```

### Полезные Советы для Анимации

1. **Плавность**: Используйте больше keyframes для плавных движений
2. **Физика**: Учитывайте гравитацию и инерцию
3. **Симметрия**: Для симметричных движений используйте Copy/Paste
4. **Тестирование**: Проверяйте анимацию в Blender перед экспортом
5. **Оптимизация**: Удаляйте лишние keyframes для меньшего размера файла

---

## 📊 Структура Базы Данных

### Collections

#### `users`
```json
{
  "_id": ObjectId,
  "id": "uuid-string",
  "username": "string",
  "password_hash": "bcrypt-hash",
  "clearance_level": 1-5,
  "created_at": "ISO-date",
  "is_active": boolean
}
```

#### `scp_objects`
```json
{
  "_id": ObjectId,
  "id": "uuid-string",
  "number": "0000",
  "name": "Object Name",
  "codename": "Codename",
  "threat_class": "Threat|Hazard|Cataclysm|...",
  "description": "text",
  "special_procedures": "text",
  "secret_data": "text",
  "image_url": "url",
  "is_classified": boolean,
  "created_at": "ISO-date"
}
```

#### `chat_messages`
```json
{
  "_id": ObjectId,
  "id": "uuid-string",
  "session_id": "session-uuid",
  "user_id": "user-uuid",
  "role": "user|assistant",
  "content": "text",
  "emotion": "calm|joy|playful|sad|tired",
  "timestamp": "ISO-date"
}
```

---

## 🔧 API Документация

### Endpoints

#### Authentication
- `POST /api/auth/register` - Регистрация нового пользователя
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/me` - Получить текущего пользователя

#### SCP Objects
- `GET /api/scp` - Получить список объектов
- `GET /api/scp/{number}` - Получить конкретный объект
- `POST /api/scp` - Создать объект (Admin only)
- `PUT /api/scp/{number}` - Обновить объект (Admin only)
- `DELETE /api/scp/{number}` - Удалить объект (Admin only)

#### Chat
- `POST /api/chat` - Отправить сообщение MAL0
- `GET /api/chat/history/{session_id}` - Получить историю чата

#### Admin
- `GET /api/admin/users` - Получить всех пользователей (Admin only)
- `PUT /api/admin/users/{user_id}/clearance` - Изменить уровень допуска
- `PUT /api/admin/users/{user_id}/status` - Активировать/деактивировать

---

## 🐛 Устранение Неполадок

### Backend Не Запускается

**Проблема**: `ModuleNotFoundError: No module named 'emergentintegrations'`

**Решение**:
```bash
cd backend
pip install emergentintegrations
```

**Проблема**: `MongoServerSelectionTimeoutError`

**Решение**:
```bash
# Проверить что MongoDB запущен
sudo systemctl status mongod

# Если не запущен:
sudo systemctl start mongod
```

### Frontend Не Запускается

**Проблема**: `Error: Cannot find module 'three'`

**Решение**:
```bash
cd frontend
yarn install
```

**Проблема**: `CORS policy error`

**Решение**:
- Проверить что REACT_APP_BACKEND_URL в frontend/.env указывает на правильный backend URL
- В backend/.env установить `CORS_ORIGINS=http://localhost:3000`

### 3D Модель Не Загружается

**Проблема**: Модель не отображается или ошибка загрузки

**Решение**:
```bash
# Убедиться что файл существует
ls -lh frontend/public/Mal0_Base_20.glb

# Проверить размер файла (должен быть ~120MB)
# Если файл отсутствует, скачать с репозитория
```

---

## 📝 Конфигурация

### Изменение Порта Backend

В `backend/.env` или при запуске:
```bash
uvicorn server:app --host 0.0.0.0 --port 8080
```

Не забудьте обновить `REACT_APP_BACKEND_URL` в frontend/.env

### Изменение Порта Frontend

```bash
PORT=3001 yarn start
```

### Добавление Новых Пользователей

```bash
# Через API
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "clearance_level": 2
  }'
```

---

## 🔐 Безопасность

### Рекомендации

1. **Смените пароль администратора** сразу после первого входа
2. **Используйте HTTPS** в production
3. **Храните .env файлы в безопасности** (не коммитьте в Git)
4. **Регулярно обновляйте зависимости**:
   ```bash
   pip list --outdated  # Backend
   yarn outdated        # Frontend
   ```
5. **Настройте firewall** для ограничения доступа к портам

---

## 📦 Production Deployment

### Использование Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
    }
}
```

### Build Frontend для Production

```bash
cd frontend
yarn build

# Serve static files
npm install -g serve
serve -s build -l 3000
```

---

## 📞 Поддержка

### Контакты
- **GitHub**: https://github.com/Pala4Roka/MY
- **Email**: support@eternalsentinels.com

### Полезные Ресурсы
- Three.js Documentation: https://threejs.org/docs/
- React Documentation: https://react.dev/
- FastAPI Documentation: https://fastapi.tiangolo.com/
- Blender Manual: https://docs.blender.org/

---

## 📄 Лицензия

MIT License - Свободное использование и модификация

---

## 🎉 Готово!

Приложение установлено и готово к использованию. Наслаждайтесь работой с MAL0! 👁️

**Версия**: 2.0  
**Дата**: Октябрь 2025  
**Авторы**: Pala4Roka & Emergent AI