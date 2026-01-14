#!/usr/bin/env bash
set -e

echo "=== Backend deps ==="
pip install pipenv
pipenv install --deploy --system

echo "=== DB migrations (flask-migrate) ==="
# Aplica migraciones si existen. No rompe el deploy si falla.
if [ -d "migrations" ]; then
  pipenv run flask db upgrade || flask db upgrade || true
fi

echo "=== Seed DB (ONLY FIRST TIME) ==="
# Solo se ejecuta si RUN_SEED=true en Render (Environment Variables)
if [ "${RUN_SEED}" = "true" ]; then
  echo "RUN_SEED=true -> ejecutando seed..."
  pipenv run flask seed-db --restaurants 2000 || flask seed-db --restaurants 2000
else
  echo "RUN_SEED no es true -> saltando seed"
fi

echo "=== Frontend build (root) ==="
npm ci
npm run build

echo "=== Frontend build OK ==="
# Tu webpack.prod.js deja la salida en ./public
# Verificamos que exista lo esperado
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
