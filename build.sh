#!/usr/bin/env bash
set -e

echo "=== Backend deps ==="
pip install pipenv
pipenv install --deploy --system

# Para que Python encuentre /src/api cuando importas "api.*"
export PYTHONPATH="$(pwd)/src"

echo "=== DB migrations (flask-migrate) ==="
export FLASK_APP=src/app.py
flask db upgrade

echo "=== Frontend build (root) ==="
# Node deps (en la raíz)
npm ci || npm install

# Build (webpack)
npm run build

echo "=== Copy frontend build to public/ ==="
rm -rf public
mkdir -p public

# 4Geeks suele dejar el build en /public (ya) o en /dist
# Detectamos varias opciones
if [ -d "public" ] && [ "$(ls -A public 2>/dev/null)" ]; then
  echo "public/ ya contiene archivos de build"
elif [ -d "dist" ]; then
  cp -R dist/* public/
elif [ -d "build" ]; then
  cp -R build/* public/
else
  echo "ERROR: No encuentro salida de build (public/dist/build)."
  echo "Contenido raíz:"
  ls -la
  exit 1
fi

echo "=== Build OK ==="
