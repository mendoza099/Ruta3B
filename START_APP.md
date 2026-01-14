# 🚀 Guía para Arrancar RUTA-3B

## 📋 Pasos para Probar la Aplicación

---

## 1️⃣ MIGRAR LA BASE DE DATOS (OBLIGATORIO)

**⚠️ IMPORTANTE:** Debes hacer esto PRIMERO antes de arrancar la aplicación.

### Opción A: Script Automático (Recomendado)

```bash
./migrate_reservations.sh
```

### Opción B: Manual

```bash
# Eliminar migraciones antiguas
rm -rf migrations/

# Inicializar sistema de migraciones
pipenv run flask db init

# Crear migración
pipenv run flask db migrate -m "Add security and reservation improvements"

# Aplicar migración
pipenv run flask db upgrade
```

**Qué hace esto:**
- Crea la tabla `reservation` (nueva)
- Elimina el campo `date` de la tabla `user`
- Actualiza las relaciones de la base de datos
- Aplica todas las mejoras de seguridad

---

## 2️⃣ ARRANCAR EL BACKEND (Terminal 1)

```bash
# Asegúrate de estar en el directorio del proyecto
cd /workspaces/Ruta3B

# Iniciar el servidor Flask
pipenv run start
```

**Deberías ver:**
```
 * Running on http://0.0.0.0:3001
 * Debug mode: on
```

**⚠️ Si hay errores:**
- Verifica que la migración se completó
- Verifica que `.env` tiene `JWT_SECRET_KEY`
- Verifica que las dependencias están instaladas

---

## 3️⃣ ARRANCAR EL FRONTEND (Terminal 2)

**Abre una NUEVA terminal** y ejecuta:

```bash
# Asegúrate de estar en el directorio del proyecto
cd /workspaces/Ruta3B

# Iniciar el servidor de desarrollo
npm run start
```

**Deberías ver:**
```
webpack compiled successfully
```

**La aplicación se abrirá automáticamente en el navegador.**

---

## 4️⃣ PROBAR LA APLICACIÓN

### A. Registrarse como Usuario

1. **Ir a la home:** La aplicación debería abrirse automáticamente
2. **Click en "Registrarse"** (navbar superior derecha)
3. **Seleccionar "Usuario"**
4. **Completar formulario:**
   - Nombre: Tu nombre
   - Apellido: Tu apellido
   - Email: tu@email.com
   - Contraseña: (mínimo 6 caracteres)
   - Confirmar contraseña
5. **Click "Registrar"**
6. **Deberías ver:** Mensaje de éxito con SweetAlert

---

### B. Iniciar Sesión

1. **Click en "Login"** (navbar)
2. **Ingresar credenciales:**
   - Email: tu@email.com
   - Contraseña: la que pusiste
   - ❌ NO marcar el checkbox (eres usuario, no restaurante)
3. **Click "Entrar"**
4. **Deberías ser redirigido a:** `/usuario` (tu panel personal)

---

### C. Explorar Restaurantes

1. **Click en "Restaurantes"** (navbar)
2. **Deberías ver:** Listado de restaurantes (si hay en la BD)
3. **Click en cualquier tarjeta** de restaurante
4. **Deberías ver:** Página de detalle con:
   - Foto del restaurante
   - Nombre
   - Descripción
   - Precio medio del ticket
   - Formulario de reserva (si estás logueado)

---

### D. Crear una Reserva (NUEVO SISTEMA)

1. **En la página de detalle del restaurante:**
2. **Completar formulario:**
   - **Fecha:** Selecciona una fecha futura
   - **Hora:** (Opcional) Ej: 20:00
   - **Personas:** Ej: 2
3. **Click "Hacer una reserva"**
4. **Deberías ver:** Alerta de éxito "¡Reserva creada exitosamente!"

**✅ Prueba crear VARIAS reservas en diferentes restaurantes**

---

### E. Ver Tus Reservas (NUEVO SISTEMA)

1. **Ir a tu panel:** Click en "Usuario" (navbar)
2. **Click en "Ver mis reservas (X)"** donde X es el número de reservas
3. **Deberías ver:** Modal con TODAS tus reservas:
   - Nombre del restaurante correcto
   - Foto correcta
   - Fecha individual de cada reserva
   - Hora (si la pusiste)
   - Número de personas
   - Botón "Cancelar Reserva" en cada una

**✅ Verifica que cada reserva muestra su propia información**

---

### F. Cancelar una Reserva

1. **En el modal de reservas**
2. **Click "Cancelar Reserva"** en cualquier reserva
3. **Confirmar** en el diálogo
4. **Deberías ver:** Mensaje de éxito
5. **El modal se actualiza** mostrando las reservas restantes

---

### G. Agregar a Favoritos

1. **En la página de detalle del restaurante**
2. **Click en el botón de favoritos** (corazón/estrella)
3. **Deberías ver:** Confirmación
4. **Ir a tu panel de usuario**
5. **Deberías ver:** Carrusel con tus restaurantes favoritos

---

### H. Registrarse como Restaurante

1. **Logout** (navbar)
2. **Click "Registrarse"**
3. **Seleccionar "Restaurante"**
4. **Completar formulario:**
   - Nombre del local: Ej: "Mi Restaurante"
   - Email: restaurante@email.com
   - Contraseña
   - Tipo de local: Ej: "Restaurante"
   - Descripción: Breve descripción
5. **Click "Registrar"**

---

### I. Login como Restaurante

1. **Click "Login"**
2. **Ingresar credenciales del restaurante**
3. **✅ MARCAR el checkbox** "¿Eres propietario de un restaurante?"
4. **Click "Entrar"**
5. **Deberías ser redirigido a:** `/restaurante` (panel del restaurante)

---

### J. Gestionar Restaurante

1. **En el panel del restaurante deberías ver:**
   - Mensaje de bienvenida con nombre del local
   - Tarjeta con información del perfil
   - Sección para agregar precio
   - Componente para subir foto
   - Botón "Editar Info"

2. **Agregar precio:**
   - Ingresar precio medio del ticket
   - Click "Añadir Precio"
   - Debería actualizarse sin recargar la página

3. **Editar información:**
   - Click "Editar Info"
   - Modificar nombre, tipo o descripción
   - Click "Modificar Datos"

---

## 🧪 TESTING COMPLETO

### Probar Sistema de Reservas (CRÍTICO)

**Escenario 1: Múltiples Reservas**
1. Login como usuario
2. Crear reserva en Restaurante A para el 15 de enero
3. Crear reserva en Restaurante B para el 20 de enero
4. Crear reserva en Restaurante C para el 25 de enero
5. Ir a "Ver mis reservas"
6. **✅ Verificar:** Cada reserva muestra su propia fecha (no todas la misma)

**Escenario 2: Información Correcta**
1. Ver tus reservas
2. **✅ Verificar:** 
   - Nombre del restaurante correcto en cada una
   - Foto correcta en cada una
   - Fecha correcta en cada una
   - No hay información mezclada

**Escenario 3: Cancelar Individual**
1. Ver tus reservas (3 reservas)
2. Cancelar la del medio (Restaurante B)
3. **✅ Verificar:** 
   - Solo se cancela esa
   - Las otras 2 siguen activas
   - El contador muestra 2 reservas

**Escenario 4: Validaciones**
1. Intentar crear reserva para ayer
2. **✅ Verificar:** Error "Date must be in the future"
3. Intentar crear reserva duplicada (mismo día, mismo restaurante)
4. **✅ Verificar:** Error "You already have a reservation..."

---

### Probar Seguridad

**Escenario 1: Contraseñas Hasheadas**
1. Registrar usuario
2. Ir al admin panel: `http://localhost:3001/admin`
3. **✅ Verificar:** Requiere autenticación (no acceso público)

**Escenario 2: Autenticación**
1. Logout
2. Intentar acceder a `/usuario`
3. **✅ Verificar:** Mensaje "Primero debería registrarse"

**Escenario 3: Separación Usuario/Restaurante**
1. Login como usuario
2. Intentar acceder a `/restaurante`
3. **✅ Verificar:** Mensaje de error o redirección

---

## 🔍 URLs Importantes

| Página | URL | Requiere Login |
|--------|-----|----------------|
| Home | http://localhost:3000/ | No |
| Restaurantes | http://localhost:3000/restaurantes | No |
| Login | http://localhost:3000/login | No |
| Registro | http://localhost:3000/seleccion-registro | No |
| Panel Usuario | http://localhost:3000/usuario | Sí (Usuario) |
| Panel Restaurante | http://localhost:3000/restaurante | Sí (Restaurante) |
| Detalle Restaurante | http://localhost:3000/ruta-comida/1 | No |
| Contacto | http://localhost:3000/contacto | No |
| Sobre Nosotros | http://localhost:3000/sobre-nosotros | No |

**Backend API:** http://localhost:3001/api/

---

## ⚠️ Problemas Comunes

### Error: "JWT_SECRET_KEY environment variable is not set"

**Solución:**
```bash
# Verificar que existe
cat .env | grep JWT_SECRET_KEY

# Si no existe, el archivo .env ya debería tenerlo
# Si no, agregar:
echo "JWT_SECRET_KEY=955b45173770d2a6ff97a04a92903c33b123f0931eee55a32256ea68e380504f" >> .env
```

---

### Error: "Module not found" en Frontend

**Solución:**
```bash
# Reinstalar dependencias
npm install
```

---

### Error: "Table doesn't exist" en Backend

**Solución:**
```bash
# Ejecutar migración
./migrate_reservations.sh
```

---

### Backend no arranca

**Solución:**
```bash
# Verificar dependencias Python
pipenv install

# Verificar que estás en el entorno virtual
pipenv shell

# Intentar arrancar de nuevo
flask run -p 3001 -h 0.0.0.0
```

---

### Frontend no arranca

**Solución:**
```bash
# Limpiar cache
rm -rf node_modules package-lock.json

# Reinstalar
npm install

# Arrancar
npm run start
```

---

### No hay restaurantes en el listado

**Solución:**
```bash
# Registrar un restaurante manualmente desde la UI
# O insertar datos de prueba en la BD
```

---

## 📊 Verificar que Todo Funciona

### Checklist de Testing

**Backend:**
- [ ] Backend arranca sin errores
- [ ] Puedo acceder a http://localhost:3001/api/
- [ ] Migración de BD completada

**Frontend:**
- [ ] Frontend arranca sin errores
- [ ] Puedo ver la home
- [ ] Puedo navegar entre páginas

**Autenticación:**
- [ ] Puedo registrarme como usuario
- [ ] Puedo hacer login como usuario
- [ ] Puedo registrarme como restaurante
- [ ] Puedo hacer login como restaurante
- [ ] Logout funciona

**Reservas (NUEVO):**
- [ ] Puedo crear una reserva
- [ ] Puedo crear múltiples reservas
- [ ] Cada reserva mantiene su propia fecha
- [ ] Puedo ver TODAS mis reservas
- [ ] La información es correcta (no mezclada)
- [ ] Puedo cancelar reservas individuales
- [ ] Validación de fecha futura funciona
- [ ] No permite duplicados

**Favoritos:**
- [ ] Puedo agregar a favoritos
- [ ] Puedo ver mis favoritos
- [ ] Puedo eliminar de favoritos

**Restaurante:**
- [ ] Puedo ver mi perfil
- [ ] Puedo agregar precio
- [ ] Puedo editar información
- [ ] Puedo subir foto

---

## 🎯 Flujo Completo de Prueba

### 1. Usuario Completo (15 minutos)

```
1. Registrarse como usuario
2. Login
3. Explorar restaurantes
4. Ver detalle de 3 restaurantes diferentes
5. Crear reserva en cada uno (diferentes fechas)
6. Agregar 2 a favoritos
7. Ir a panel de usuario
8. Ver favoritos en carrusel
9. Click "Ver mis reservas"
10. Verificar que muestra las 3 correctamente
11. Cancelar una reserva
12. Verificar que quedan 2
13. Logout
```

### 2. Restaurante Completo (10 minutos)

```
1. Registrarse como restaurante
2. Login (marcar checkbox)
3. Ver panel de restaurante
4. Agregar precio medio
5. Editar información
6. Subir foto (si Cloudinary está configurado)
7. Logout
8. Login como usuario
9. Buscar el restaurante que creaste
10. Verificar que aparece en el listado
```

---

## 🚀 Comandos Rápidos

### Arrancar Todo (2 terminales)

**Terminal 1 (Backend):**
```bash
cd /workspaces/Ruta3B
pipenv run start
```

**Terminal 2 (Frontend):**
```bash
cd /workspaces/Ruta3B
npm run start
```

### Reiniciar Base de Datos

```bash
./migrate_reservations.sh
```

### Ver Logs

**Backend:** Los logs aparecen en la terminal donde arrancaste Flask

**Frontend:** Los logs aparecen en la consola del navegador (F12)

---

## 📞 Si Algo No Funciona

1. **Verificar que la migración se ejecutó:** `ls migrations/versions/`
2. **Verificar .env:** `cat .env`
3. **Verificar dependencias backend:** `pipenv install`
4. **Verificar dependencias frontend:** `npm install`
5. **Reiniciar ambos servidores**
6. **Limpiar cache del navegador**

---

## ✅ Resumen

**Para arrancar la aplicación:**
1. Migrar BD: `./migrate_reservations.sh`
2. Backend: `pipenv run start` (Terminal 1)
3. Frontend: `npm run start` (Terminal 2)
4. Abrir navegador: http://localhost:3000

**Para probar reservas:**
1. Registrarse como usuario
2. Login
3. Ir a restaurante
4. Crear varias reservas
5. Ver "Mis reservas"
6. Verificar que cada una tiene su propia información

---

**¡Listo para probar! 🎉**
