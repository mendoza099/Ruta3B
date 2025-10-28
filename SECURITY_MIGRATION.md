# 🔒 Migración de Seguridad - Ruta3B

## ⚠️ IMPORTANTE: Cambios Críticos Implementados

Este documento describe los cambios de seguridad implementados y los pasos necesarios para migrar la base de datos existente.

---

## ✅ Cambios Implementados

### 1. Hash de Contraseñas
- ✅ Contraseñas ahora se almacenan con hash usando `werkzeug.security`
- ✅ Métodos `set_password()` y `check_password()` agregados a modelos User y Locales
- ✅ Campo password aumentado de 80 a 255 caracteres para almacenar hash

### 2. JWT Secret Key
- ✅ Movido de hardcoded a variable de entorno
- ✅ Agregado `JWT_SECRET_KEY` a `.env.example`
- ✅ Validación para asegurar que la variable esté configurada

### 3. Flask Admin Protegido
- ✅ Panel de admin ahora requiere autenticación JWT
- ✅ Implementado `SecureModelView` y `SecureAdminIndexView`
- ✅ Redirección a mensaje de error si no está autenticado

### 4. Validación de Inputs
- ✅ Validación de campos requeridos en registro
- ✅ Verificación de emails duplicados
- ✅ Manejo de errores mejorado con try/catch
- ✅ Mensajes de error genéricos para evitar enumeración de usuarios

### 5. Mejoras en Modelos
- ✅ Email ahora es `unique=True` en User
- ✅ Nombres de relaciones cambiados de español a inglés
- ✅ Limpieza de código comentado

---

## 🚨 ACCIÓN REQUERIDA: Migración de Base de Datos

### Opción 1: Base de Datos Nueva (Recomendado para desarrollo)

```bash
# 1. Eliminar base de datos existente
rm -rf migrations/

# 2. Recrear migraciones
pipenv run flask db init
pipenv run flask db migrate -m "Add password hashing and security improvements"
pipenv run flask db upgrade

# 3. Crear usuarios de prueba (opcional)
pipenv run flask insert-test-users 5
```

### Opción 2: Migrar Datos Existentes (Producción)

**⚠️ ADVERTENCIA: Las contraseñas existentes en texto plano NO PUEDEN ser convertidas a hash.**

Necesitarás:
1. Forzar reset de contraseñas para todos los usuarios
2. O migrar manualmente con script

#### Script de Migración (crear como `migrate_passwords.py`):

```python
from src.app import app
from src.api.models import db, User, Locales

with app.app_context():
    # OPCIÓN A: Resetear todas las contraseñas a un valor temporal
    temp_password = "TempPassword123!"
    
    users = User.query.all()
    for user in users:
        user.set_password(temp_password)
    
    locales = Locales.query.all()
    for local in locales:
        local.set_password(temp_password)
    
    db.session.commit()
    print(f"Migrated {len(users)} users and {len(locales)} locales")
    print(f"All passwords set to: {temp_password}")
    print("IMPORTANT: Users must reset their passwords!")
```

Ejecutar:
```bash
python3 migrate_passwords.py
```

---

## 📋 Checklist Post-Migración

- [ ] Verificar que `.env` tiene `JWT_SECRET_KEY` configurado
- [ ] Ejecutar migraciones de base de datos
- [ ] Probar registro de nuevo usuario
- [ ] Probar login con usuario nuevo
- [ ] Verificar que admin panel requiere autenticación
- [ ] Notificar a usuarios existentes sobre reset de contraseñas (si aplica)

---

## 🔧 Configuración de Entorno

### Variables de Entorno Requeridas

Agregar a tu archivo `.env`:

```bash
# Generar una clave segura con:
# python -c "import secrets; print(secrets.token_hex(32))"
JWT_SECRET_KEY=tu-clave-secreta-aqui
```

### Para Producción

```bash
# Generar clave segura
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"

# Copiar el output a tu .env o configuración de Heroku:
heroku config:set JWT_SECRET_KEY=<tu-clave-generada>
```

---

## 🧪 Testing

### Probar Registro de Usuario

```bash
curl -X POST http://localhost:3001/api/user \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "apellido": "User",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### Probar Login

```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "type": false
  }'
```

---

## 📝 Notas Adicionales

### Cambios en el Modelo

**Antes:**
```python
password = db.Column(db.String(80), nullable=False)
```

**Después:**
```python
password = db.Column(db.String(255), nullable=False)

def set_password(self, password):
    self.password = generate_password_hash(password)

def check_password(self, password):
    return check_password_hash(self.password, password)
```

### Uso en Código

**Antes:**
```python
if password != user.password:
    return error
```

**Después:**
```python
if not user.check_password(password):
    return error
```

---

## 🆘 Troubleshooting

### Error: "JWT_SECRET_KEY environment variable is not set"
**Solución:** Agregar `JWT_SECRET_KEY` a tu archivo `.env`

### Error: "Invalid credentials" al hacer login
**Solución:** Si migraste desde contraseñas en texto plano, necesitas resetear las contraseñas

### Error: Column 'password' too small
**Solución:** Ejecutar migración para aumentar tamaño de columna:
```bash
pipenv run flask db migrate -m "Increase password column size"
pipenv run flask db upgrade
```

---

## 📞 Soporte

Si encuentras problemas durante la migración, revisa:
1. Logs de Flask para errores específicos
2. Estado de la base de datos
3. Variables de entorno configuradas correctamente

---

**Fecha de Implementación:** 2025-10-27
**Versión:** 1.0.0
