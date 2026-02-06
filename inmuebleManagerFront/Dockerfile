# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Instalar un servidor HTTP simple para servir la aplicación
RUN npm install -g http-server

COPY --from=builder /app/dist .

EXPOSE 4200

CMD ["http-server", "-p", "4200", "-c-1"]
