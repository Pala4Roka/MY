# Технический стек Eternal Sentinels Database

## Обзор архитектуры

Eternal Sentinels Database построен на современном full-stack архитектурном подходе с разделением на Frontend, Backend и Database слои.

```
┌─────────────────────────────────────────────────────┐
│                     Frontend                        │
│            (React + Tailwind CSS)                   │
│            Port: 3000 (dev)                         │
└─────────────────┬───────────────────────────────────┘
                  │ HTTP/REST API
                  │ JWT Authentication
┌─────────────────▼───────────────────────────────────┐
│                     Backend                         │
│            (FastAPI + Python)                       │
│            Port: 8001                               │
└─────────────────┬───────────────────────────────────┘
                  │ Motor Driver
                  │ Async Operations
┌─────────────────▼───────────────────────────────────┐
│                    Database                         │
│                   MongoDB                           │
│            Port: 27017                              │
└─────────────────────────────────────────────────────┘
```

---

## Frontend Stack

### Основные технологии

#### **React 18.2.0**
- **Назначение**: Основной фреймворк для построения UI
- **Преимущества**: 
  - Компонентная архитектура
  - Virtual DOM для оптимальной производительности
  - Богатая экосистема библиотек
  - Hooks для управления состоянием

#### **Tailwind CSS 3.4.17**
- **Назначение**: Utility-first CSS фреймворк
- **Преимущества**:
  - Быстрая разработка с utility классами
  - Responsive design из коробки
  - Кастомизация через конфигурацию
  - Минимальный финальный размер CSS

#### **React Router DOM 7.5.1**
- **Назначение**: Маршрутизация на стороне клиента
- **Функционал**:
  - Декларативная маршрутизация
  - Навигация между страницами
  - Защищенные маршруты с проверкой аутентификации

### UI-компоненты и библиотеки

#### **Radix UI**
Коллекция доступных, кастомизируемых компонентов:
- `@radix-ui/react-dialog` - Модальные окна
- `@radix-ui/react-avatar` - Аватары пользователей
- `@radix-ui/react-dropdown-menu` - Выпадающие меню
- `@radix-ui/react-toast` - Уведомления
- И другие компоненты для accessibility

#### **Lucide React 0.507.0**
- **Назначение**: Библиотека иконок
- **Особенности**: 
  - SVG иконки
  - Tree-shakeable
  - Легковесная

#### **Axios 1.8.4**
- **Назначение**: HTTP клиент
- **Функционал**:
  - Promise-based запросы
  - Interceptors для обработки токенов
  - Автоматическая сериализация JSON

### 3D и анимации

#### **Three.js 0.165.0**
- **Назначение**: 3D графика в браузере
- **Использование**: 
  - 3D модель MAL0 (если используется)
  - Визуальные эффекты

#### **React Three Fiber 8.16.8** & **Drei 9.114.0**
- **Назначение**: React рендерер для Three.js
- **Преимущества**:
  - Декларативный подход к 3D
  - Интеграция с React экосистемой
  - Готовые хелперы и компоненты

### Утилиты

#### **date-fns 4.1.0**
- Работа с датами и временем
- Легковесная альтернатива moment.js

#### **uuid 13.0.0**
- Генерация уникальных идентификаторов
- Используется для ID объектов и пользователей

#### **clsx 2.1.1** + **tailwind-merge 3.2.0**
- Условное применение классов
- Слияние Tailwind классов без конфликтов

### Экспорт и документы

#### **jsPDF 3.0.3** + **jspdf-autotable 5.0.2**
- Генерация PDF документов
- Автоматические таблицы

#### **docx 9.5.1**
- Создание .docx файлов

#### **file-saver 2.0.5**
- Сохранение файлов на клиенте

---

## Backend Stack

### Основные технологии

#### **FastAPI 0.110.1**
- **Назначение**: Современный web-фреймворк для Python
- **Преимущества**:
  - Async/await поддержка из коробки
  - Автоматическая генерация OpenAPI документации
  - Pydantic для валидации данных
  - Высокая производительность (сравнима с Node.js и Go)

#### **Python 3.10+**
- **Особенности**:
  - Type hints для лучшей читаемости
  - Async/await для асинхронных операций
  - Rich стандартная библиотека

### База данных

#### **MongoDB**
- **Назначение**: NoSQL база данных
- **Преимущества**:
  - Гибкая схема документов
  - Горизонтальное масштабирование
  - Встроенная репликация и шардинг

#### **Motor 3.3.1**
- **Назначение**: Асинхронный драйвер MongoDB
- **Особенности**:
  - Полная async/await поддержка
  - Интеграция с AsyncIO
  - Высокая производительность

### Аутентификация и безопасность

#### **PyJWT 2.10.1**
- **Назначение**: JSON Web Tokens
- **Использование**:
  - Генерация токенов доступа
  - Валидация и декодирование токенов
  - Защита API endpoints

#### **bcrypt 4.1.3**
- **Назначение**: Хеширование паролей
- **Безопасность**: 
  - Устойчив к rainbow table атакам
  - Адаптивное хеширование
  - Salt генерация

### AI и LLM интеграция

#### **emergentintegrations 0.1.0**
- **Назначение**: Унифицированная интеграция с LLM провайдерами
- **Поддерживаемые провайдеры**:
  - OpenAI (GPT-4o-mini для MAL0)
  - Anthropic Claude
  - Google Gemini

#### **OpenAI 1.99.9**
- **Назначение**: Официальный Python клиент OpenAI
- **Использование**: AI-ассистент MAL0

### Утилиты и валидация

#### **Pydantic 2.12.0**
- **Назначение**: Валидация данных
- **Функционал**:
  - Type-safe модели данных
  - Автоматическая валидация
  - JSON serialization/deserialization

#### **python-dotenv 1.1.1**
- Загрузка переменных окружения из .env файлов

#### **python-jose 3.5.0**
- JWT токены для аутентификации

---

## Database Schema (MongoDB)

### Collections

#### **users**
```javascript
{
  _id: ObjectId,
  id: String (UUID),
  username: String,
  password_hash: String,
  clearance_level: Number (1-5),
  created_at: ISODate,
  is_active: Boolean,
  is_admin: Boolean
}
```

#### **scp_objects**
```javascript
{
  _id: ObjectId,
  id: String (UUID),
  number: String,
  name: String,
  codename: String,
  threat_class: String,
  description: String,
  special_procedures: String,
  secret_data: String,
  image_url: String,
  is_classified: Boolean,
  created_at: ISODate
}
```

#### **chat_messages**
```javascript
{
  _id: ObjectId,
  id: String (UUID),
  session_id: String,
  user_id: String,
  role: String (user/assistant),
  content: String,
  emotion: String,
  timestamp: ISODate
}
```

---

## API Architecture

### RESTful Endpoints

#### Authentication Routes (`/api/auth`)
- `POST /register` - Регистрация пользователя
- `POST /login` - Вход пользователя
- `GET /me` - Получение текущего пользователя

#### SCP Objects Routes (`/api/scp`)
- `GET /scp` - Список объектов (фильтрация по уровню допуска)
- `GET /scp/{number}` - Конкретный объект
- `POST /scp` - Создание объекта (Admin)
- `PUT /scp/{number}` - Обновление объекта (Admin)
- `DELETE /scp/{number}` - Удаление объекта (Admin)

#### Chat Routes (`/api/chat`)
- `POST /chat` - Отправка сообщения MAL0
- `GET /chat/history/{session_id}` - История чата

#### Admin Routes (`/api/admin`)
- `GET /admin/users` - Список пользователей
- `PUT /admin/users/{user_id}/clearance` - Изменение уровня допуска
- `PUT /admin/users/{user_id}/status` - Активация/деактивация

---

## Security Features

### Уровни защиты:

1. **JWT Authentication**
   - Bearer token в заголовках
   - Автоматическое обновление
   - Хранение в localStorage

2. **Password Security**
   - Bcrypt хеширование
   - Salt для каждого пароля
   - Минимальные требования к паролю

3. **Authorization**
   - Role-based access control (RBAC)
   - Clearance level система (1-5)
   - Защита чувствительных данных

4. **CORS Protection**
   - Настраиваемые allowed origins
   - Credentials support
   - Preflight requests

5. **Data Validation**
   - Pydantic модели на backend
   - Client-side валидация на frontend
   - Type safety с TypeScript (если используется)

---

## Development Tools

### Build Tools

#### **CRACO 7.1.0**
- **Назначение**: Create React App Configuration Override
- **Использование**: Кастомизация Webpack без eject

#### **PostCSS 8.4.49**
- CSS трансформации
- Autoprefixer для браузерной совместимости

#### **ESLint 9.23.0**
- Линтинг JavaScript/React кода
- Обеспечение code quality

### Development Experience

#### **Hot Reload**
- Frontend: React Fast Refresh
- Backend: Uvicorn auto-reload

#### **Environment Variables**
- Frontend: REACT_APP_* префикс
- Backend: python-dotenv

---

## Performance Optimizations

### Frontend:
- **Code Splitting**: React.lazy для динамической загрузки
- **Memoization**: useMemo, useCallback для оптимизации
- **Virtual DOM**: Эффективное обновление UI
- **Asset Optimization**: Минификация, сжатие изображений

### Backend:
- **Async Operations**: Motor async driver для MongoDB
- **Connection Pooling**: Эффективное использование соединений
- **Caching**: (может быть добавлено с Redis)
- **Query Optimization**: Индексы MongoDB

### Database:
- **Indexes**: По полям number, username для быстрого поиска
- **Projection**: Исключение ненужных полей
- **Pagination**: Ограничение результатов запросов

---

## Deployment Stack

### Потенциальные варианты:

#### **Frontend:**
- Vercel / Netlify (статический хостинг)
- Nginx (собственный сервер)
- AWS S3 + CloudFront

#### **Backend:**
- Docker + Kubernetes
- AWS EC2 / DigitalOcean Droplet
- Heroku / Railway
- Gunicorn + Nginx

#### **Database:**
- MongoDB Atlas (cloud)
- Самостоятельный MongoDB сервер
- Docker контейнер

---

## Monitoring & Logging

### Logging:
- **Frontend**: Console logs, Error boundaries
- **Backend**: Python logging module
- **Access Logs**: Uvicorn/Gunicorn logs

### Potential Additions:
- Sentry для error tracking
- LogRocket для session replay
- Prometheus + Grafana для метрик

---

## Версионирование

### Semantic Versioning:
- Major.Minor.Patch (e.g., 2.0.0)
- Breaking changes = Major bump
- New features = Minor bump
- Bug fixes = Patch bump

### Current Version: **2.0**
- Полный рефакторинг с профессиональным MAL0
- Улучшенная система безопасности
- Новый UI/UX

---

## Будущие улучшения

### Потенциальные добавления:

1. **TypeScript Migration**
   - Type safety на frontend
   - Лучшая IDE поддержка

2. **Redis Caching**
   - Кеширование часто запрашиваемых данных
   - Session storage

3. **WebSocket Support**
   - Real-time обновления
   - Live chat с MAL0

4. **GraphQL API**
   - Альтернатива REST
   - Более эффективные запросы

5. **Progressive Web App (PWA)**
   - Offline support
   - Push notifications

6. **Automated Testing**
   - Jest + React Testing Library
   - Pytest для backend
   - E2E тесты с Playwright

---

## Заключение

Eternal Sentinels Database построен на современном и масштабируемом технологическом стеке, обеспечивающем высокую производительность, безопасность и удобство разработки. Архитектура позволяет легко добавлять новые функции и масштабировать систему при необходимости.
