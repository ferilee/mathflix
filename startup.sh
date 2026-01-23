#!/bin/sh

# Replace environment variables in the config template
if [ ! -z "$VITE_API_URL" ]; then
  API_URL="$VITE_API_URL"
else
  API_URL="http://localhost:3000"
fi

ADMIN_USERNAME="${VITE_ADMIN_USERNAME:-admin}"
ADMIN_PASSWORD="${VITE_ADMIN_PASSWORD:-admin123}"

echo "Setting API URL to: $API_URL"
sed "s|{{API_URL}}|$API_URL|g; s|{{ADMIN_USERNAME}}|$ADMIN_USERNAME|g; s|{{ADMIN_PASSWORD}}|$ADMIN_PASSWORD|g" \
  /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js

# Start nginx
exec "$@"
