#!/bin/sh
set -e

echo "=== INICIANDO SCRIPT DE CONFIGURAÇÃO ==="
echo "Argumentos recebidos: $@"

# Verifica se o arquivo env.js existe
if [ ! -f "/usr/share/nginx/html/env.js" ]; then
    echo "ERRO: Arquivo env.js não encontrado em /usr/share/nginx/html/env.js"
    ls -la /usr/share/nginx/html/
    exit 1
fi

echo "=== Conteúdo ANTES da substituição ==="
cat /usr/share/nginx/html/env.js

echo "=== Variáveis de ambiente recebidas ==="
echo "REACT_APP_API_URL: ${REACT_APP_API_URL}"
echo "REACT_APP_USE_MOCKS: ${REACT_APP_USE_MOCKS}"

# Substitui as variáveis de ambiente no arquivo env.js
echo "=== Executando substituições ==="
sed -i "s|__REACT_APP_API_URL__|${REACT_APP_API_URL:-http://localhost:8000/api/v1}|g" /usr/share/nginx/html/env.js
sed -i "s|__REACT_APP_USE_MOCKS__|${REACT_APP_USE_MOCKS:-false}|g" /usr/share/nginx/html/env.js

echo "=== Conteúdo APÓS a substituição ==="
cat /usr/share/nginx/html/env.js

echo "=== Variáveis configuradas com sucesso ==="
echo "REACT_APP_API_URL: ${REACT_APP_API_URL:-http://localhost:8000/api/v1}"
echo "REACT_APP_USE_MOCKS: ${REACT_APP_USE_MOCKS:-false}"

echo "=== Iniciando comando: $@ ==="
# Inicia o nginx
exec "$@" 