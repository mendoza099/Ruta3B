#!/usr/bin/env bash
set -e

echo "=== Backend deps ==="
pip install pipenv
pipenv install --deploy --system

echo "=== DB migrations (flask-migrate) ==="
# Si tienes migrations, esto las aplica. Si no quieres que el deploy falle por migraciones,
# puedes comentar estas 2 líneas.
if [ -d "migrations" ]; then
  pipenv run flask db upgrade || flask db upgrade || true
fi

echo "=== Frontend build (root) ==="
# En tu repo el package.json está en raíz, así que se construye aquí
npm ci
npm run build

echo "=== Frontend build OK ==="
# Tu webpack.prod.js ya deja la salida en ./public
# Aquí solo verificamos que exista lo esperado
if [ ! -f "public/index.html" ]; then
  echo "ERROR: No encuentro public/index.html después del build."
  echo "Contenido de public/:"
  ls -la public || true
  exit 1
fi

if [ ! -f "public/bundle.js" ] && [ ! -f "public/bundle.js.map" ]; then
  echo "WARNING: No veo public/bundle.js (puede estar minificado con hash si cambias config)."
  echo "Contenido de public/:"
  ls -la public || true
fi

echo "=== Build finished successfully ==="
