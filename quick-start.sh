#!/bin/bash

# Script de inicio rápido para RUTA-3B
# Este script verifica y arranca la aplicación

echo "🚀 RUTA-3B - Quick Start"
echo "========================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No estás en el directorio del proyecto${NC}"
    echo "Por favor, ejecuta: cd /workspaces/Ruta3B"
    exit 1
fi

echo -e "${GREEN}✅ Directorio correcto${NC}"
echo ""

# Verificar .env
echo "🔍 Verificando configuración..."
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Archivo .env no encontrado${NC}"
    echo "Creando .env desde .env.example..."
    cp .env.example .env
    echo "JWT_SECRET_KEY=955b45173770d2a6ff97a04a92903c33b123f0931eee55a32256ea68e380504f" >> .env
    echo "CORS_ORIGINS=http://localhost:3000,http://localhost:3001" >> .env
    echo "BACKEND_URL=http://localhost:3001" >> .env
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
else
    echo -e "${GREEN}✅ Archivo .env existe${NC}"
fi

# Verificar JWT_SECRET_KEY
if ! grep -q "JWT_SECRET_KEY" .env; then
    echo -e "${YELLOW}⚠️  JWT_SECRET_KEY no encontrado, agregando...${NC}"
    echo "JWT_SECRET_KEY=955b45173770d2a6ff97a04a92903c33b123f0931eee55a32256ea68e380504f" >> .env
fi

echo ""

# Verificar migraciones
echo "🔍 Verificando base de datos..."
if [ ! -d "migrations" ]; then
    echo -e "${YELLOW}⚠️  Migraciones no encontradas${NC}"
    echo ""
    echo "⚠️  IMPORTANTE: Debes ejecutar la migración de la base de datos"
    echo ""
    echo "Opciones:"
    echo "  1. Ejecutar script automático: ./migrate_reservations.sh"
    echo "  2. Ejecutar manualmente:"
    echo "     rm -rf migrations/"
    echo "     pipenv run flask db init"
    echo "     pipenv run flask db migrate -m 'Initial migration'"
    echo "     pipenv run flask db upgrade"
    echo ""
    read -p "¿Quieres ejecutar la migración ahora? (s/n): " migrate
    
    if [ "$migrate" = "s" ]; then
        echo ""
        echo "🔄 Ejecutando migración..."
        ./migrate_reservations.sh
    else
        echo -e "${RED}❌ No se puede continuar sin migración${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Migraciones encontradas${NC}"
fi

echo ""

# Verificar node_modules
echo "🔍 Verificando dependencias frontend..."
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules no encontrado${NC}"
    echo "Instalando dependencias..."
    npm install
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo -e "${GREEN}✅ node_modules existe${NC}"
fi

echo ""
echo "========================"
echo -e "${GREEN}✅ Todo listo para arrancar${NC}"
echo "========================"
echo ""
echo "📋 Instrucciones:"
echo ""
echo "1️⃣  BACKEND (Terminal 1):"
echo "   cd /workspaces/Ruta3B"
echo "   pipenv run start"
echo ""
echo "2️⃣  FRONTEND (Terminal 2):"
echo "   cd /workspaces/Ruta3B"
echo "   npm run start"
echo ""
echo "3️⃣  ABRIR NAVEGADOR:"
echo "   http://localhost:3000"
echo ""
echo "📚 Documentación completa: START_APP.md"
echo ""
