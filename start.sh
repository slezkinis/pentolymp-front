#!/bin/bash
set -e

# Загружаем переменные из .env
set -a
source .env
set +a

export BACKEND_URL=${BACKEND_URL:-http://host.docker.internal:8000}

echo "BACKEND_URL=$BACKEND_URL"

envsubst '${BACKEND_URL}' \
  < traefik-dynamic.yml.template \
  > traefik-dynamic.yml

docker compose up --build -d
