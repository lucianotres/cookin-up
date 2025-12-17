#!/bin/sh

###### CARREGA AS VARIAVES DE AMBIENTE PARA CFG
CONFIG_FILE=${APP_CONFIG_FILE:-/usr/share/nginx/html/env-config.js}

echo "window.__APP_CONFIG__ = {" > "$CONFIG_FILE"
echo "  \"APP_CONFIG_VERSION\": 1," >> "$CONFIG_FILE"

# Percorre todas variáveis de ambiente que começam com APP_
env | grep '^APP_' | while IFS='=' read -r name value; do
  if [ "$name" != "APP_CONFIG_FILE" ] && [ "$name" != "APP_CONFIG_VERSION" ]; then
    echo "  \"$name\": \"$value\"," >> "$CONFIG_FILE"
  fi
done
echo "};" >> "$CONFIG_FILE"
echo "Arquivo de config env-config.js criado."

###### TROCA O BASE HREF NO INDEX
BASE_URL=${APP_BASE_URL:-/}
sed -i "s|<base href=\"/\">|<base href=\"${BASE_URL}\">|" /usr/share/nginx/html/index.html

###### RODA O APP
exec nginx -g 'daemon off;'