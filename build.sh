#!/usr/bin/env bash
# Script de build para Render

set -o errexit

pip install pipenv
pipenv install

# Ejecutar migraciones
pipenv run flask db upgrade

# Cargar datos de prueba si la base está vacía
pipenv run python -c "
from src.app import app, db
from src.api.models import Locales

with app.app_context():
    count = Locales.query.count()
    print(f'Restaurantes en BD: {count}')
    if count == 0:
        print('Base de datos vacía - ejecutando seed...')
        from src.api.seed_data import seed_all
        seed_all()
        print('Seed completado!')
    else:
        print('Base de datos ya tiene datos')
"
