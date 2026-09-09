#!/bin/sh
# Genera /usr/share/nginx/html/config.js con las variables de entorno del contenedor.
# Este archivo es leído por index.html ANTES de cargar el bundle de React,
# permitiendo configurar Keycloak sin reconstruir la imagen.

cat > /usr/share/nginx/html/config.js << EOF
window.__APP_CONFIG__ = {
  KEYCLOAK_URL:    "${KEYCLOAK_URL:-https://sso.hro.gob.gt}",
  KEYCLOAK_REALM:  "${KEYCLOAK_REALM:-Hospital-O}",
  KEYCLOAK_CLIENT: "${KEYCLOAK_CLIENT:-sistema-actas-frontend}"
};
EOF

echo "[entrypoint] config.js generado:"
cat /usr/share/nginx/html/config.js

# Iniciar nginx
exec nginx -g "daemon off;"
