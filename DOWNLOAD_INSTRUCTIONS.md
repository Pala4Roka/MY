# Инструкция по скачиванию архива SCP Database

## Доступные архивы

Я создал **два формата архивов** вашего ПОЛНОГО SCP Database сайта:

### 1. **scp-database-complete.tar.gz** (61 KB)
- Формат: TAR.GZ (сжатый архив)
- Подходит для: Linux, macOS, Unix систем
- Местоположение: `/app/scp-database-complete.tar.gz`

### 2. **scp-database-complete.zip** (93 KB)
- Формат: ZIP
- Подходит для: Windows, macOS, Linux
- Местоположение: `/app/scp-database-complete.zip`

## Что включено в архив:

✅ **Backend (FastAPI + Python)**
- server.py - полный API с AI чатом MAL0
- requirements.txt - все зависимости включая emergentintegrations
- .env - файл конфигурации
- Интеграция с GPT-5 через Emergent LLM Key
- Автоматическая инициализация базы данных

✅ **Frontend (React 19)**
- MainPage.js - главная страница с анимированной MAL0
- Полностью функциональный AI-чат с историей сессий
- Карточки досье с модальными окнами
- Анимированный фон и плавное следование MAL0 за курсором
- Все UI компоненты (Radix UI, Shadcn/ui)
- package.json - все зависимости Node.js
- .env - файл конфигурации

✅ **База данных**
- 5 объектов ES (0000, 0003, 0002, 0004, 1471)
- Автоматическое заполнение при первом запуске
- MongoDB для хранения досье и истории чата

✅ **Документация**
- README.md - полная инструкция по установке и запуску
- Информация о структуре проекта
- API endpoints
- Troubleshooting

## Что НЕ включено (для уменьшения размера):

❌ node_modules - будет установлено через `yarn install`
❌ __pycache__ - будет создано автоматически
❌ .git - история версий
❌ build - production сборка (создается через `yarn build`)

## Как скачать архив:

### Вариант 1: Через терминал текущей сессии
```bash
# Скачать TAR.GZ
curl -O https://anomaly-catalog.preview.emergentagent.com/scp-database-archive.tar.gz

# Скачать ZIP
curl -O https://anomaly-catalog.preview.emergentagent.com/scp-database-archive.zip
```

### Вариант 2: Прямая ссылка
Если файлы доступны через веб, используйте:
- TAR.GZ: `/app/scp-database-archive.tar.gz`
- ZIP: `/app/scp-database-archive.zip`

## Распаковка архива:

### TAR.GZ:
```bash
tar -xzf scp-database-complete.tar.gz
cd backend  # или frontend
```

### ZIP:
```bash
unzip scp-database-complete.zip
cd backend  # или frontend
```

## Быстрый старт после распаковки:

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
python seed_data.py
uvicorn server:app --host 0.0.0.0 --port 8001
```

### 2. Frontend
```bash
cd frontend
yarn install
yarn start
```

## Готово! 🎉

После этого ваш SCP Database будет работать локально:
- Backend: http://localhost:8001
- Frontend: http://localhost:3000
- API документация: http://localhost:8001/docs

Полная инструкция доступна в файле README.md внутри архива.
