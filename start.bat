@echo off
setlocal enabledelayedexpansion

REM Установка значения по умолчанию если BACKEND_URL не задан
if not defined BACKEND_URL (
    set "BACKEND_URL=http://host.docker.internal:8000"
)

REM Замена переменных в traefik-dynamic.yml перед запуском
powershell -Command "(Get-Content traefik-dynamic.yml.template) -replace '\${BACKEND_URL}', '!BACKEND_URL!' | Set-Content traefik-dynamic.yml"

REM Запуск docker-compose
docker-compose up --build