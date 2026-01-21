#!/bin/sh

# Replace environment variables in the config template
if [ ! -z "$VITE_API_URL" ]; then
  echo "Setting API URL to: $VITE_API_URL"
  sed "s|{{API_URL}}|$VITE_API_URL|g" /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js
else
  echo "Using default API URL: http://localhost:3000"
  sed "s|{{API_URL}}|http://localhost:3000|g" /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js
fi

# Start nginx
exec "$@"
