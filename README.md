# pentolymp-front

## Перед запуском
1. Создать файл `.env` и настроить ссылки до бекенда. Вот пример
```
VITE_BACKEND_URL=http://127.0.0.1:8000 - путь до API сервера. Обычно это сам домен фронтенда.
VITE_WS_URL=ws://127.0.0.1:8000 - путь до WS сервера. Обычно это сам домен фронтенда.
BACKEND_URL=http://host.docker.internal:8000 - URL до бекенда из docker
```

2. Запустите [бекенд](https://github.com/slezkinis/pentolymp-backend)
3. Запустите фронтенд в docker командами:
Если Linux/Mac:
``` sh
chmod +x start.sh && ./start.sh
```
Если windows, просто запустите `start.bat`