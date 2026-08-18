#!/usr/bin/env bash
set -o errexit

npm install
npm run build

pip install pipenv
pipenv install --system --deploy

echo "=== DATABASE_URL present? ==="
python -c "import os; print(bool(os.getenv('DATABASE_URL')))"

echo "=== Current migration ==="
flask db current

echo "=== Migration heads ==="
flask db heads

echo "=== Running migrations ==="
flask db upgrade

echo "=== Migrations finished ==="