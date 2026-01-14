release: pip install pipenv && pipenv install && pipenv run flask db upgrade
web: gunicorn wsgi --chdir ./src/
