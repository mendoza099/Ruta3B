#!/usr/bin/env bash
set -e

echo "=== Backend deps ==="
pip install pipenv
pipenv install --deploy --system

echo "=== DB migrations (flask-migrate) ==="
if [ -d "migrations" ]; then
  # aplica migraciones si existen
  flask db upgrade || true
fi

echo "=== Seed DB (ONLY FIRST TIME) ==="
# Para que NO se ejecute en cada deploy:
# usa una variable de entorno RUN_SEED=true solo la primera vez,
# o añade un guard en Python (te digo debajo cuál es el mejor).
if [ "${RUN_SEED}" = "true" ]; then
  echo "RUN_SEED=true -> ejecutando seed..."
  flask seed-db --restaurants 2000
else
  echo "RUN_SEED no es true -> saltando seed"
fi

echo "=== Frontend build (root) ==="
npm ci
npm run build

echo "=== Frontend build OK ==="
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
