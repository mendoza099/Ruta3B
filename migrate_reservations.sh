#!/bin/bash

# Script para migrar el sistema de reservas
# Este script elimina las migraciones antiguas y crea nuevas con el modelo Reservation

echo "🔄 Iniciando migración del sistema de reservas..."
echo ""

# Paso 1: Backup de la base de datos (opcional pero recomendado)
echo "📦 Paso 1: Backup de base de datos (recomendado)"
echo "Si tienes datos importantes, haz backup manualmente antes de continuar"
read -p "¿Continuar con la migración? (s/n): " confirm

if [ "$confirm" != "s" ]; then
    echo "❌ Migración cancelada"
    exit 0
fi

# Paso 2: Eliminar migraciones antiguas
echo ""
echo "🗑️  Paso 2: Eliminando migraciones antiguas..."
rm -rf migrations/

# Paso 3: Inicializar migraciones
echo ""
echo "🔧 Paso 3: Inicializando sistema de migraciones..."
pipenv run flask db init

# Paso 4: Crear migración con nuevo modelo
echo ""
echo "📝 Paso 4: Creando migración con modelo Reservation..."
pipenv run flask db migrate -m "Add Reservation model and remove old reservation system"

# Paso 5: Aplicar migración
echo ""
echo "✅ Paso 5: Aplicando migración a la base de datos..."
pipenv run flask db upgrade

echo ""
echo "🎉 ¡Migración completada exitosamente!"
echo ""
echo "📋 Resumen de cambios:"
echo "  ✅ Modelo Reservation creado"
echo "  ✅ Campo 'date' eliminado de User"
echo "  ✅ Tabla 'reservations' (many-to-many) eliminada"
echo "  ✅ Nueva tabla 'reservation' con información completa"
echo ""
echo "⚠️  IMPORTANTE:"
echo "  - Las reservas antiguas se han perdido (no se pueden migrar)"
echo "  - Los usuarios deben crear nuevas reservas"
echo "  - El nuevo sistema permite múltiples reservas con fechas individuales"
echo ""
