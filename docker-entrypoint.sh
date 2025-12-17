#!/bin/sh
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

#Roda app
exec nginx -g 'daemon off;'