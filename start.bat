@echo off
setlocal EnableDelayedExpansion

REM Backend URL по умолчанию
if "%BACKEND_URL%"=="" (
  set BACKEND_URL=http://host.docker.internal:8000
)

echo BACKEND_URL=%BACKEND_URL%

REM Генерация traefik-dynamic.yml из шаблона
powershell -Command ^
  "(Get-Content traefik-dynamic.yml.template) -replace '\$\{BACKEND_URL\}', '%BACKEND_URL%' | Set-Content traefik-dynamic.yml"

REM Build + Run
docker compose build
docker compose up -d

pause
