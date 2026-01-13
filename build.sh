#!/usr/bin/env bash
set -e

echo "=== Backend deps ==="
pip install pipenv
pipenv install --deploy --system

# ✅ CLAVE: que Python encuentre /src/api
export PYTHONPATH="$(pwd)/src"

echo "=== DB migrations (alembic/flask-migrate) ==="
cd src
# Si ya tienes FLASK_APP en Render, esto va; si no, lo fijamos aquí también:
export FLASK_APP=app.py
flask db upgrade
cd ..

echo "=== Frontend build ==="
cd front
npm ci || npm install
npm run build
cd ..

echo "=== Copy frontend build to public/ ==="
rm -rf public
mkdir -p public

# ✅ Soporta build/ o dist/ (por si usas CRA o Vite)
if [ -d "front/build" ]; then
  cp -R front/build/* public/
elif [ -d "front/dist" ]; then
  cp -R front/dist/* public/
else
  echo "ERROR: No se encontró front/build ni front/dist tras npm run build"
  exit 1
fi

echo "=== Build OK ==="
