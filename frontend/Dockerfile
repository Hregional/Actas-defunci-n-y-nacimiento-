# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --silent
COPY . .
# La config de Keycloak ya NO se embebe en el bundle —
# se inyecta en runtime por docker-entrypoint.sh via window.__APP_CONFIG__
RUN npm run build

# ── Stage 2: Serve con Nginx ─────────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Variables con valores por defecto — se sobreescriben desde docker-compose / .env
ENV KEYCLOAK_URL=https://sso.hro.gob.gt
ENV KEYCLOAK_REALM=Hospital-O
ENV KEYCLOAK_CLIENT=sistema-actas-frontend

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
