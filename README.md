# pentolymp-front

## Перед запуском
1. В файле `src/api/client.ts` установить `API_BASE_URL` равное домену, на котором будет запущен фронт и бек (в дальнейшем будет через env)
2. Запустить [бек](https://github.com/slezkinis/pentolymp-backend)
3. Запустить командой `npx vite --host 0.0.0.0 --port 5173`
4. Запустить `traefik` командой:
``` sh
docker compose up --build
```
5. Приложение будет доступно по `localhost:1111`

## TODO
1. Нужно закинуть всё в монорепу и запускать оттуда.
