#!/bin/bash

# Замена переменных в traefik-dynamic.yml перед запуском
export BACKEND_URL=${BACKEND_URL:-http://host.docker.internal:8000}
envsubst '${BACKEND_URL}' < traefik-dynamic.yml.template > traefik-dynamic.yml

docker-compose up --build