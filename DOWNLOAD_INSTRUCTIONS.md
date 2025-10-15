# Инструкция по скачиванию архива SCP Database

## Доступные архивы

Я создал **два формата архивов** вашего SCP Database сайта:

### 1. **scp-database-archive.tar.gz** (53 KB)
- Формат: TAR.GZ (сжатый архив)
- Подходит для: Linux, macOS, Unix систем
- Местоположение: `/app/scp-database-archive.tar.gz`

### 2. **scp-database-archive.zip** (84 KB)
- Формат: ZIP
- Подходит для: Windows, macOS, Linux
- Местоположение: `/app/scp-database-archive.zip`

## Что включено в архив:

✅ **Backend (FastAPI + Python)**
- server.py - главный файл API
- seed_data.py - скрипт инициализации базы данных
- requirements.txt - все зависимости Python
- .env - файл конфигурации

✅ **Frontend (React 19)**
- Все исходные файлы React приложения
- HomePage.jsx - главная страница с чатом MAL0
- ObjectDetailPage.jsx - страницы детальных досье
- Все компоненты UI (Radix UI, Tailwind CSS)
- package.json - все зависимости Node.js
- .env - файл конфигурации

✅ **Документация**
- README.md - полная инструкция по установке и запуску
- Информация о структуре проекта
- API endpoints
- Troubleshooting

✅ **База данных**
- 14 объектов ES уже включены в seed_data.py
- Автоматическое заполнение при первом запуске

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
tar -xzf scp-database-archive.tar.gz
cd backend  # или frontend
```

### ZIP:
```bash
unzip scp-database-archive.zip
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
