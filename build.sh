#!/usr/bin/env bash
set -e

echo "=== Backend deps ==="
pip install pipenv
pipenv install --deploy --system

# Para que 'from api...' funcione (api está dentro de src/)
export PYTHONPATH="$(pwd)/src"

echo "=== DB migrations (alembic/flask-migrate) ==="
# migrations/ está en la raíz, así que ejecutamos desde aquí
export FLASK_APP=src/app.py
flask db upgrade

echo "=== Frontend build ==="
cd front
npm ci || npm install
npm run build
cd ..

echo "=== Copy frontend build to public/ ==="
rm -rf public
mkdir -p public

if [ -d "front/build" ]; then
  cp -R front/build/* public/
elif [ -d "front/dist" ]; then
  cp -R front/dist/* public/
else
  echo "ERROR: No se encontró front/build ni front/dist tras npm run build"
  exit 1
fi

echo "=== Build OK ==="
