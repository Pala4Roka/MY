# 🔌 ОБЪЯСНЕНИЕ АРХИТЕКТУРЫ ПОРТОВ

## Зачем нужно два разных порта?

### 📝 Краткий ответ
Это **НОРМАЛЬНО** и **ПРАВИЛЬНО**! Два порта - это стандартная архитектура современных веб-приложений.

---

## 🏗️ Архитектура приложения

```
┌─────────────────────────────────────────────────────────┐
│                    ВЕБ-БРАУЗЕР                          │
│           http://localhost:3000                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ (1) Открывает страницу
                   ↓
┌─────────────────────────────────────────────────────────┐
│             FRONTEND (React)                            │
│             Порт 3000                                   │
│  • Отображает интерфейс                                 │
│  • Обрабатывает взаимодействие                          │
│  • Показывает 3D модель                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ (2) API запросы к backend
                   │     http://localhost:8001/api
                   ↓
┌─────────────────────────────────────────────────────────┐
│             BACKEND (FastAPI)                           │
│             Порт 8001                                   │
│  • Обрабатывает бизнес-логику                           │
│  • Аутентификация JWT                                   │
│  • API для работы с данными                             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ (3) Запросы к базе данных
                   ↓
┌─────────────────────────────────────────────────────────┐
│             MongoDB                                     │
│             Порт 27017                                  │
│  • Хранит данные пользователей                          │
│  • Хранит объекты SCP                                   │
│  • Хранит историю чата                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Почему именно так?

### 1️⃣ Разделение ответственности (Separation of Concerns)

**Frontend (Порт 3000)**
- 🎨 Отвечает за **внешний вид** (UI/UX)
- 🖱️ Обрабатывает **взаимодействие с пользователем**
- 📱 Работает с **браузером**
- 🔄 **Hot Reload** для быстрой разработки

**Backend (Порт 8001)**
- 🔐 Отвечает за **безопасность** (аутентификация)
- 💾 Управляет **данными** (база данных)
- 🧠 Содержит **бизнес-логику**
- 🤖 Интегрирует **AI сервисы**

### 2️⃣ Независимая разработка

```bash
# Можно разрабатывать frontend отдельно
cd frontend
yarn start

# И backend отдельно
cd backend
uvicorn server:app --reload
```

### 3️⃣ Масштабируемость

В будущем можно:
- Запустить несколько экземпляров backend
- Разместить frontend на CDN
- Использовать разные серверы для разных компонентов

### 4️⃣ Технологическая свобода

- Frontend может использовать React, Vue, Angular
- Backend может использовать FastAPI, Django, Express
- Они общаются через **стандартный HTTP API**

---

## 🔄 Как они взаимодействуют?

### Frontend → Backend

**Файл: `/app/frontend/.env`**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

**Код: `/app/frontend/src/api.js`**
```javascript
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Пример запроса
axios.get(`${API}/scp`)  // http://localhost:8001/api/scp
```

Frontend **автоматически** отправляет все запросы к backend используя эту переменную.

---

## 🌐 Можно ли использовать один порт?

### ✅ ДА! В Production окружении

#### Вариант 1: Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
    }
}
```

Теперь всё работает на одном домене:
- `your-domain.com` → Frontend
- `your-domain.com/api` → Backend

#### Вариант 2: Docker Compose

```yaml
services:
  frontend:
    ports:
      - "80:80"
  backend:
    ports:
      - "8001:8001"
  nginx:
    ports:
      - "80:80"
```

---

## 📊 Сравнение: Development vs Production

### Development (локальная разработка)

```
Frontend:  http://localhost:3000
Backend:   http://localhost:8001
```

**Преимущества:**
- ✅ Быстрая разработка
- ✅ Hot Reload работает
- ✅ Легко отлаживать
- ✅ Можно перезапускать отдельно

**Недостатки:**
- ❌ Нужно запускать два процесса
- ❌ Два разных порта

### Production (боевой сервер)

```
Всё:  https://your-domain.com
```

**Преимущества:**
- ✅ Один домен
- ✅ HTTPS
- ✅ Кеширование
- ✅ Балансировка нагрузки

**Как достигается:**
- Nginx объединяет frontend и backend
- Frontend собирается (`yarn build`)
- Backend работает через Gunicorn/Uvicorn
- Всё за HTTPS

---

## 🛠️ Как это избежать в разработке?

### Вариант 1: Proxy в package.json (React)

**Файл: `/app/frontend/package.json`**
```json
{
  "proxy": "http://localhost:8001"
}
```

Теперь можно делать запросы напрямую:
```javascript
// Вместо http://localhost:8001/api/scp
axios.get('/api/scp')  // автоматически проксируется
```

**Но это не рекомендуется**, потому что:
- Нужно перезапускать frontend при каждом изменении
- Не работает в production
- Менее гибко

### Вариант 2: Docker Compose (рекомендуется для серьёзной разработки)

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
  backend:
    build: ./backend
    ports:
      - "8001:8001"
  nginx:
    image: nginx
    ports:
      - "80:80"
```

---

## 🎯 Вывод

### Для локальной разработки (сейчас)
```
✅ Два порта - ЭТО НОРМАЛЬНО!

Frontend: http://localhost:3000  ← Открывайте в браузере
Backend:  http://localhost:8001  ← Работает "за кулисами"
```

### Для production (на сервере)
```
✅ Один домен через Nginx

https://your-domain.com  ← Всё здесь!
```

---

## 📚 Дополнительные ресурсы

### Стандартные порты веб-приложений

| Сервис | Порт | Назначение |
|--------|------|------------|
| Frontend (React) | 3000 | Development Server |
| Backend (FastAPI) | 8000-8001 | API Server |
| MongoDB | 27017 | База данных |
| PostgreSQL | 5432 | База данных |
| Redis | 6379 | Кеш |
| Nginx | 80/443 | HTTP/HTTPS |

### Примеры известных приложений

**Instagram:**
- Frontend: React (отдельный сервис)
- Backend: Django (отдельный сервис)
- Database: PostgreSQL (отдельный сервис)

**Netflix:**
- Frontend: React (микросервисы)
- Backend: Java/Node.js (микросервисы)
- Database: Cassandra (кластер)

Все используют **разные порты/сервисы** в development и **один домен** в production.

---

## ✅ Практические советы

### Для разработки:

1. **Запускайте оба сервиса:**
   ```bash
   # Терминал 1
   cd backend && uvicorn server:app --reload
   
   # Терминал 2
   cd frontend && yarn start
   ```

2. **Используйте переменные окружения:**
   - Frontend: `REACT_APP_BACKEND_URL`
   - Backend: `MONGO_URL`

3. **Не хардкодите порты в коде!**

### Для production:

1. **Соберите frontend:**
   ```bash
   yarn build
   ```

2. **Используйте Nginx:**
   - Frontend → статические файлы
   - Backend → proxy_pass

3. **Настройте HTTPS** (Let's Encrypt)

---

## 🎉 Заключение

**Два порта в разработке = удобство и гибкость**  
**Один домен в production = простота для пользователей**

Это **best practice** современной веб-разработки!

---

**Eternal Sentinels © 2025**
