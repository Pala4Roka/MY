# 🛡️ Eternal Sentinels - База данных аномальных объектов

Система управления и мониторинга аномальных объектов с AI-ассистентом MAL0 и 3D визуализацией.

![Version](https://img.shields.io/badge/version-2.0-red)
![Status](https://img.shields.io/badge/status-active-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🌟 Основные возможности

- 🔐 **JWT Аутентификация** с системой уровней допуска (1-5)
- 🗄️ **База данных MongoDB** с 21 аномальным объектом
- 🤖 **AI-ассистент MAL0** с персонализированными ответами
- 🎨 **3D Визуализация** MAL0 с 6 эмоциональными анимациями
- 👤 **Личный кабинет** для каждого пользователя
- 🛡️ **Админ-панель** с возможностью редактирования досье
- 📥 **Скачивание досье** в текстовом формате
- 📱 **Адаптивный дизайн** для всех устройств
- 🇷🇺 **Полная русификация** интерфейса

---

## 📸 Скриншоты

### Главная страница с 3D моделью MAL0
![Main Page](docs/screenshots/main_page.png)

### Админ-панель
![Admin Panel](docs/screenshots/admin_panel.png)

---

## 🚀 Быстрый старт

### Системные требования
- Node.js 16+ 
- Python 3.9+
- MongoDB 5.0+
- Yarn

### Установка

1. **Клонирование репозитория**
```bash
git clone https://github.com/Pala4Roka/MY.git
cd MY
git checkout MAL07
```

2. **Backend (FastAPI)**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend (React)**
```bash
cd ../frontend
yarn install
```

4. **Запуск**
```bash
# Терминал 1 - Backend
cd backend && source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Терминал 2 - Frontend
cd frontend && yarn start
```

5. **Откройте в браузере**
```
http://localhost:3000
```

### Учетные данные по умолчанию
- **Username**: `admin`
- **Password**: `admin123`
- **Уровень допуска**: 5 (максимальный)

---

## 📚 Полная документация

📖 **[INSTALLATION_GUIDE_RU.md](INSTALLATION_GUIDE_RU.md)** - Подробная инструкция по установке от А до Я

Включает:
- Пошаговую установку всех компонентов
- Настройку MongoDB
- Решение типичных проблем
- Production развертывание
- Объяснение архитектуры

---

## 🏗️ Архитектура

```
┌─────────────────┐      HTTP/API      ┌──────────────────┐
│                 │ ←───────────────→  │                  │
│  React Frontend │                    │  FastAPI Backend │
│   (Port 3000)   │                    │   (Port 8001)    │
│                 │                    │                  │
└─────────────────┘                    └──────────────────┘
                                              │
                                              │ Motor
                                              ↓
                                       ┌──────────────┐
                                       │   MongoDB    │
                                       │ (Port 27017) │
                                       └──────────────┘
```

### Backend Stack
- **FastAPI** - Веб-фреймворк
- **Motor** - Асинхронный драйвер MongoDB
- **Pydantic** - Валидация данных
- **JWT** - Аутентификация
- **Emergent Integrations** - AI интеграция

### Frontend Stack
- **React** - UI библиотека
- **Three.js** - 3D визуализация
- **Tailwind CSS** - Стилизация
- **Axios** - HTTP клиент
- **React Router** - Маршрутизация

---

## 🎨 3D Модель MAL0

### Особенности
- **Размер файла**: 121 МБ (Mal0_Base_20.glb)
- **Формат**: GLTF/GLB
- **Отображение**: Верхние 50% тела (эффект "смотрит в окно")
- **Камера**: Близкий план для драматического эффекта

### 6 Эмоциональных анимаций
1. **Idle (Спокойное)** - Мягкие движения, легкое дыхание
2. **Nervous (Нервное)** - Быстрые, нервные подергивания
3. **Sleepy (Сонное)** - Медленные, сонные покачивания
4. **Sleeping (Спящее)** - Минимальные движения, глубокое дыхание
5. **Playful (Игривое)** - Энергичные, игривые движения
6. **Happy (Счастливое)** - Радостные покачивания головой

---

## 🔧 Конфигурация

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=eternal_sentinels_db
CORS_ORIGINS=http://localhost:3000
EMERGENT_LLM_KEY=your_key_here
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
```

---

## 🎯 Функционал

### Для всех пользователей
- ✅ Просмотр объектов согласно уровню допуска
- ✅ Чат с AI-ассистентом MAL0
- ✅ 3D визуализация MAL0
- ✅ Личный кабинет
- ✅ Детальная информация об объектах

### Для администраторов (Уровень 5)
- ✅ Управление пользователями
- ✅ Изменение уровней допуска
- ✅ Редактирование досье объектов
- ✅ Скачивание досье
- ✅ Создание/удаление объектов
- ✅ Доступ к секретной информации

---

## 🤖 MAL0 AI-Ассистент

### Персонализация
- **Для admin'а**: Романтическое, игривое поведение
- **Для остальных**: Профессиональный ассистент базы данных

### Функции
- Ответы на вопросы об объектах
- Учет уровня допуска пользователя
- Контекстная память разговора
- Эмоциональные реакции

---

## 📊 Система уровней допуска

| Уровень | Доступ |
|---------|--------|
| 1-2 | Объекты класса "Threat" |
| 3 | + "Hazard", "Cataclysm" |
| 4 | + "Collapse", "Apex" |
| 5 | Полный доступ + секретные данные + админ-панель |

---

## 🔒 Классы угроз

- 🟢 **Threat** - Угроза
- 🟡 **Hazard** - Опасность  
- 🟠 **Cataclysm** - Катаклизм
- 🔴 **Collapse** - Крушение
- 🟣 **Apex** - Предел
- ⚫ **Absolute** - Абсолют
- 💀 **Annihilation** - Аннигиляция

---

## 🛠️ Разработка

### Структура проекта
```
MY/
├── backend/              # FastAPI Backend
│   ├── server.py        # Главный сервер
│   ├── models.py        # Pydantic модели
│   ├── auth_utils.py    # JWT аутентификация
│   ├── scp_data.py      # Данные объектов
│   └── requirements.txt # Зависимости
│
├── frontend/            # React Frontend
│   ├── public/
│   │   └── Mal0_Base_20.glb  # 3D модель
│   ├── src/
│   │   ├── components/  # React компоненты
│   │   ├── pages/       # Страницы
│   │   └── api.js       # API клиент
│   └── package.json     # Зависимости
│
└── INSTALLATION_GUIDE_RU.md  # Инструкция
```

### API Endpoints

#### Аутентификация
- `POST /api/auth/login` - Вход
- `POST /api/auth/register` - Регистрация
- `GET /api/auth/me` - Текущий пользователь

#### Объекты
- `GET /api/scp` - Список объектов
- `GET /api/scp/{number}` - Получить объект
- `POST /api/scp` - Создать объект (Admin)
- `PUT /api/scp/{number}` - Обновить объект (Admin)
- `DELETE /api/scp/{number}` - Удалить объект (Admin)

#### Чат
- `POST /api/chat` - Отправить сообщение
- `GET /api/chat/history/{session_id}` - История чата

#### Админ
- `GET /api/admin/users` - Список пользователей
- `PUT /api/admin/users/{id}/clearance` - Изменить уровень
- `PUT /api/admin/users/{id}/status` - Изменить статус

---

## 🐛 Решение проблем

### 3D модель не загружается
- Проверьте наличие файла `Mal0_Base_20.glb` в `frontend/public/`
- Размер файла: ~121 МБ
- Подождите 30-60 секунд для загрузки

### Backend не запускается
```bash
# Проверьте MongoDB
sudo systemctl status mongod

# Активируйте venv
source venv/bin/activate

# Переустановите зависимости
pip install -r requirements.txt
```

### Frontend не компилируется
```bash
# Очистите и переустановите
rm -rf node_modules yarn.lock
yarn install
```

### Два разных порта?
Это **нормально**! Стандартная архитектура разработки:
- **Frontend** работает на `localhost:3000`
- **Backend** работает на `localhost:8001`
- Frontend автоматически отправляет запросы к backend

---

## 📱 Мобильная версия

Приложение полностью адаптивно и работает на:
- 📱 Смартфонах
- 📱 Планшетах
- 💻 Desktop

Для доступа с мобильного устройства в той же сети:
```
http://[IP_ВАШЕГО_КОМПЬЮТЕРА]:3000
```

---

## 🚀 Production Deployment

### Docker
```bash
docker-compose up -d
```

### Nginx + Supervisor
См. полную инструкцию в [INSTALLATION_GUIDE_RU.md](INSTALLATION_GUIDE_RU.md)

---

## 🤝 Поддержка

При возникновении проблем:
1. Проверьте [INSTALLATION_GUIDE_RU.md](INSTALLATION_GUIDE_RU.md)
2. Убедитесь, что все службы запущены
3. Проверьте логи backend и frontend
4. Проверьте подключение к MongoDB

---

## 📄 Лицензия

MIT License - свободно используйте, модифицируйте и распространяйте.

---

## 👨‍💻 Автор

**Pala4Roka**  
GitHub: [@Pala4Roka](https://github.com/Pala4Roka)

---

## 🙏 Благодарности

- **Three.js** - за отличную 3D библиотеку
- **FastAPI** - за быстрый и современный фреймворк
- **React** - за мощную UI библиотеку
- **MongoDB** - за гибкую NoSQL базу данных
- **Emergent** - за LLM интеграцию

---

**Eternal Sentinels © 2025**

*Наблюдай. Содержи. Защищай.*

---

## 🎯 Roadmap

- [ ] Добавить больше анимаций для 3D модели
- [ ] Интеграция с внешними API
- [ ] Система уведомлений
- [ ] Экспорт досье в PDF
- [ ] Мультиязычность
- [ ] Темная/светлая тема
- [ ] Система достижений
- [ ] WebSocket для real-time обновлений

---

## ⭐ Если вам нравится проект

Поставьте звезду на GitHub! ⭐

```bash
git clone https://github.com/Pala4Roka/MY.git
cd MY
git checkout MAL07
```

Приятного использования! 🛡️
