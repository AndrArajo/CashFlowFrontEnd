#!/bin/sh

# Substitui as variáveis de ambiente no arquivo env.js
sed -i "s|__REACT_APP_API_URL__|${REACT_APP_API_URL:-http://localhost:8000/api/v1}|g" /usr/share/nginx/html/env.js
sed -i "s|__REACT_APP_USE_MOCKS__|${REACT_APP_USE_MOCKS:-false}|g" /usr/share/nginx/html/env.js

echo "Variáveis de ambiente configuradas:"
echo "REACT_APP_API_URL: ${REACT_APP_API_URL:-http://localhost:8000/api/v1}"
echo "REACT_APP_USE_MOCKS: ${REACT_APP_USE_MOCKS:-false}"

# Inicia o nginx
exec "$@" 