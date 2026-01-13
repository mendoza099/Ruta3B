#!/usr/bin/env bash
set -e

echo "=== Backend deps ==="
pip install pipenv
pipenv install --deploy --system

export PYTHONPATH="$(pwd)/src"

echo "=== DB migrations (alembic/flask-migrate) ==="
export FLASK_APP=src/app.py
flask db upgrade

echo "=== Frontend build ==="

FRONT_DIR=""

# 1) Si existe package.json en front/
if [ -f "front/package.json" ]; then
  FRONT_DIR="front"
# 2) Si existe package.json en front/js/
elif [ -f "front/js/package.json" ]; then
  FRONT_DIR="front/js"
else
  echo "ERROR: No encuentro package.json ni en front/ ni en front/js/"
  echo "Contenido del repo:"
  ls -la
  echo "Contenido de front/ si existe:"
  ls -la front || true
  exit 1
fi

echo "Usando frontend en: $FRONT_DIR"
cd "$FRONT_DIR"
npm ci || npm install
npm run build
cd -

echo "=== Copy frontend build to public/ ==="
rm -rf public
mkdir -p public

# Detecta build output típico (CRA = build, Vite = dist)
if [ -d "$FRONT_DIR/build" ]; then
  cp -R "$FRONT_DIR/build/"* public/
elif [ -d "$FRONT_DIR/dist" ]; then
  cp -R "$FRONT_DIR/dist/"* public/
else
  echo "ERROR: No se encontró build/ ni dist/ dentro de $FRONT_DIR tras npm run build"
  ls -la "$FRONT_DIR"
  exit 1
fi

echo "=== Build OK ==="
