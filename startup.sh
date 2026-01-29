#!/bin/sh

# Replace environment variables in the config template
if [ ! -z "$VITE_API_URL" ]; then
  API_URL="$VITE_API_URL"
else
  API_URL="http://localhost:3000"
fi

if [ ! -z "$VITE_AUTH_STRATEGY" ]; then
  AUTH_STRATEGY="$VITE_AUTH_STRATEGY"
else
  AUTH_STRATEGY="cookie"
fi

if [ ! -z "$VITE_STORAGE_URL" ]; then
  STORAGE_URL="$VITE_STORAGE_URL"
else
  STORAGE_URL=""
fi

echo "Setting API URL to: $API_URL"
echo "Setting AUTH_STRATEGY to: $AUTH_STRATEGY"
echo "Setting STORAGE_URL to: ${STORAGE_URL:-<default>}"
sed "s|{{API_URL}}|$API_URL|g; s|{{AUTH_STRATEGY}}|$AUTH_STRATEGY|g; s|{{STORAGE_URL}}|$STORAGE_URL|g" \
  /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js

# Start nginx
exec "$@"
