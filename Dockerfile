# ---------- Build stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# билдим React/Vite
RUN npm run build


# ---------- Production stage ----------
FROM nginx:1.25-alpine

# удаляем дефолтный конфиг nginx
RUN rm /etc/nginx/conf.d/default.conf

# копируем свой конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# копируем результат билда
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
