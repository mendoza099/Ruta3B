# 📱 RUTA-3B - Documentación de la Aplicación

## 🎯 ¿Qué es RUTA-3B?

**RUTA-3B** es una plataforma web que conecta usuarios con restaurantes y locales de comida en la ciudad, siguiendo la filosofía **3B: Bueno, Bonito y Barato**.

La aplicación permite a los usuarios descubrir lugares sorprendentes para comer y beber, mientras que los restaurantes pueden promocionar sus servicios de manera simple y efectiva.

---

## 👥 Tipos de Usuarios

La aplicación tiene **dos tipos de usuarios** con funcionalidades diferentes:

### 1. 👤 Usuario Normal (Cliente)
Personas que buscan lugares para comer, beber y disfrutar.

### 2. 🍽️ Usuario Restaurante (Local)
Propietarios de restaurantes, bares, cafeterías que quieren promocionar su negocio.

---

## 🏠 Páginas Públicas (Sin Login)

### 🏡 Home (`/`)
**Descripción:** Página principal de bienvenida

**Funcionalidades:**
- Muestra mensaje de bienvenida a RUTA-3B
- Explica el concepto 3B (Bueno, Bonito, Barato)
- Carrusel con restaurantes destacados:
  - Pez Tortilla
  - Taberna Gordinflón
  - Asador El Pastoret
- Muestra 2 tarjetas aleatorias de restaurantes
- Invita a registrarse

**Objetivo:** Atraer nuevos usuarios y mostrar la propuesta de valor

---

### 📋 Restaurantes (`/restaurantes`)
**Descripción:** Listado completo de todos los restaurantes

**Funcionalidades:**
- Muestra todos los restaurantes registrados
- Cada restaurante se muestra en una tarjeta con:
  - Foto del local
  - Nombre
  - Tipo de local (bar, restaurante, cafetería, etc.)
  - Descripción
  - Precio medio del ticket
- Click en tarjeta lleva a página de detalle

**Objetivo:** Permitir explorar todos los locales disponibles

---

### 📖 Sobre Nosotros (`/sobre-nosotros`)
**Descripción:** Información sobre el proyecto

**Funcionalidades:**
- Explica la filosofía 3B
- Historia del proyecto
- Misión y visión
- Política de la plataforma

**Objetivo:** Dar a conocer el proyecto y sus valores

---

### 📧 Contacto (`/contacto`)
**Descripción:** Formulario de contacto

**Funcionalidades:**
- Formulario para enviar mensajes
- Integración con Formspark
- Campos: nombre, email, mensaje
- Confirmación con SweetAlert2

**Objetivo:** Permitir comunicación con el equipo

---

### 🔐 Login (`/login`)
**Descripción:** Página de inicio de sesión

**Funcionalidades:**
- Formulario con email y contraseña
- Checkbox: "¿Eres propietario de un restaurante?"
  - ✅ Marcado → Login como restaurante
  - ❌ Sin marcar → Login como usuario normal
- Redirección automática según tipo:
  - Usuario → `/usuario`
  - Restaurante → `/restaurante`
- Validación de credenciales
- Mensajes de error

**Objetivo:** Autenticar usuarios y restaurantes

---

### 📝 Selección de Registro (`/seleccion-registro`)
**Descripción:** Página para elegir tipo de registro

**Funcionalidades:**
- Botón: "Registrarse como Usuario"
- Botón: "Registrarse como Restaurante"
- Redirección a formulario correspondiente

**Objetivo:** Separar el flujo de registro

---

### 📝 Registro Usuario (`/registro-usuario`)
**Descripción:** Formulario de registro para clientes

**Funcionalidades:**
- Campos requeridos:
  - Nombre
  - Apellido
  - Email
  - Contraseña
  - Confirmar contraseña
- Validación de contraseñas coincidentes
- Verificación de email único
- Mensaje de éxito con SweetAlert2
- Redirección a login tras registro

**Objetivo:** Crear cuenta de usuario normal

---

### 📝 Registro Restaurante (`/registro-Locales`)
**Descripción:** Formulario de registro para locales

**Funcionalidades:**
- Campos requeridos:
  - Nombre del local
  - Email
  - Contraseña
  - Confirmar contraseña
  - Tipo de local (bar, restaurante, cafetería, etc.)
  - Descripción del local
- Validación de contraseñas coincidentes
- Verificación de email único
- Mensaje de éxito con SweetAlert2
- Redirección a login tras registro

**Objetivo:** Crear cuenta de restaurante

---

## 👤 Funcionalidades del USUARIO NORMAL

### 🏠 Panel de Usuario (`/usuario`)
**Acceso:** Solo usuarios autenticados (no restaurantes)

**Funcionalidades:**

#### 1. Bienvenida Personalizada
- Saludo con nombre y apellido del usuario
- Mensaje de bienvenida a la comunidad RUTA-3B
- Explicación de beneficios

#### 2. Ver Mis Reservas
- Botón "Ver mis reservas"
- Muestra modal con:
  - Nombre del restaurante reservado
  - Fecha de la reserva
  - Foto del local
- Muestra la última reserva realizada

#### 3. Mis Sitios Favoritos
- Carrusel con todos los restaurantes marcados como favoritos
- Cada tarjeta muestra:
  - Foto
  - Nombre
  - Descripción
  - Botón para eliminar de favoritos
- Si no hay favoritos, muestra mensaje

#### 4. Navegación
- Acceso rápido a explorar más restaurantes
- Logout desde navbar

**Objetivo:** Dashboard personal del usuario

---

### 🍽️ Detalle de Restaurante (`/ruta-comida/:id`)
**Acceso:** Público, pero funcionalidades requieren login

**Funcionalidades:**

#### Para Todos (Sin Login)
- Ver foto del restaurante
- Ver nombre
- Ver descripción
- Ver precio medio del ticket
- Ver tipo de local

#### Para Usuarios Autenticados
- **Hacer Reserva:**
  - Selector de fecha
  - Botón "Hacer una reserva"
  - Guarda fecha y asocia al usuario
  - Confirmación de reserva

- **Agregar a Favoritos:**
  - Botón de corazón/estrella
  - Guarda en lista de favoritos
  - Notificación si ya está en favoritos

- **Comentarios:**
  - Sección de comentarios (integración Facebook)
  - Dejar opiniones y valoraciones

**Objetivo:** Información detallada e interacción con el local

---

### 📊 Funcionalidades Adicionales Usuario

#### Gestión de Favoritos
- **Agregar:** Click en botón favorito en tarjeta de restaurante
- **Ver:** En panel de usuario, sección "Mis sitios favoritos"
- **Eliminar:** Botón en carrusel de favoritos
- **Notificación:** Si intenta agregar duplicado

#### Gestión de Reservas
- **Crear:** Desde página de detalle del restaurante
- **Ver:** Botón "Ver mis reservas" en panel
- **Información:** Fecha, restaurante, foto
- **Limitación:** Una reserva activa por restaurante

---

## 🍽️ Funcionalidades del RESTAURANTE

### 🏢 Panel de Restaurante (`/restaurante`)
**Acceso:** Solo restaurantes autenticados

**Funcionalidades:**

#### 1. Mensaje de Bienvenida
- Saludo personalizado con nombre del local
- Explicación de beneficios de la plataforma
- Enlace a política 3B

#### 2. Perfil del Local
- **Tarjeta de Información:**
  - Foto principal del local
  - Nombre
  - Descripción
  - Tipo de local
  - Precio medio del ticket

#### 3. Gestión de Precio
- **Si NO tiene precio configurado:**
  - Mensaje: "Deberías introducir el precio medio del ticket"
  - Input numérico para precio
  - Botón "Añadir Precio"
  
- **Si YA tiene precio:**
  - Muestra: "Ya has introducido el precio: X €"
  - Opción para cambiar el valor
  - Input para nuevo precio
  - Botón "Añadir Precio"

#### 4. Gestión de Fotos
- **Componente de Carga de Foto:**
  - Subir foto principal del local
  - Integración con Cloudinary
  - Preview de imagen
  - Actualización automática

#### 5. Galería de Fotos
- Carrusel con 3 imágenes de ejemplo
- Navegación entre fotos
- Indicadores de posición

#### 6. Editar Información
- Botón "Editar Info"
- Redirección a página de edición

**Objetivo:** Dashboard de gestión del restaurante

---

### ✏️ Editar Información (`/editInfo`)
**Acceso:** Solo restaurantes autenticados

**Funcionalidades:**

#### Formulario de Edición
- **Campos editables:**
  - Nombre del local
  - Tipo de local
  - Descripción

- **Validación:**
  - Todos los campos requeridos
  - Actualización en tiempo real

- **Acciones:**
  - Botón "Modificar Datos"
  - Actualización en base de datos
  - Confirmación de cambios
  - Botón "Volver al perfil"

**Objetivo:** Permitir actualizar información del local

---

### 📊 Funcionalidades Adicionales Restaurante

#### Gestión de Perfil
- **Ver:** Información completa en panel
- **Editar:** Nombre, tipo, descripción
- **Actualizar:** Precio medio del ticket
- **Subir:** Foto principal

#### Visibilidad
- **Listado:** Aparece en página de restaurantes
- **Búsqueda:** Los usuarios pueden encontrarlo
- **Detalle:** Página propia con toda la información
- **Reservas:** Recibe reservas de usuarios

#### Estadísticas (Potencial)
- Ver cuántos usuarios lo tienen en favoritos
- Ver número de reservas
- Ver comentarios y valoraciones

---

## 🗄️ Base de Datos

### Tablas Principales

#### 1. **User** (Usuarios Normales)
```
- id (PK)
- nombre
- apellido
- email (único)
- password (hash)
- foto_user
- date (fecha de reserva)
```

**Relaciones:**
- `localesfav` → Restaurantes favoritos (many-to-many)
- `reservalocales` → Restaurantes con reserva (many-to-many)

---

#### 2. **Locales** (Restaurantes)
```
- id (PK)
- nombre (único)
- email (único)
- password (hash)
- tipo_local
- descripcion
- precio
- foto
```

**Relaciones:**
- `users_who_like` → Usuarios que lo tienen en favoritos
- `users_with_reservations` → Usuarios con reserva

---

#### 3. **Direccion** (No implementada completamente)
```
- id (PK)
- barrio
- calle
- numero
```

**Estado:** Tabla creada pero sin relaciones activas

---

### Relaciones Many-to-Many

#### Tabla `likes` (Favoritos)
Conecta usuarios con sus restaurantes favoritos
```
- user_id (FK → User)
- locales_id (FK → Locales)
```

#### Tabla `reservations` (Reservas)
Conecta usuarios con restaurantes donde tienen reserva
```
- user_id (FK → User)
- locales_id (FK → Locales)
```

---

## 🔐 Sistema de Autenticación

### Flujo de Registro

#### Usuario Normal:
1. Click en "Registrarse"
2. Selecciona "Usuario"
3. Completa formulario
4. Sistema crea cuenta con password hasheado
5. Redirección a login
6. Login exitoso → Panel de usuario

#### Restaurante:
1. Click en "Registrarse"
2. Selecciona "Restaurante"
3. Completa formulario con info del local
4. Sistema crea cuenta con password hasheado
5. Redirección a login
6. Login exitoso → Panel de restaurante

---

### Flujo de Login

1. Usuario ingresa email y password
2. Marca checkbox si es restaurante
3. Sistema valida credenciales
4. Genera JWT token
5. Guarda token en localStorage
6. Guarda tipo de usuario:
   - `esUsuario: "true"` → Usuario normal
   - `esLocal: "true"` → Restaurante
7. Redirección según tipo

---

### Protección de Rutas

#### Rutas Protegidas Usuario:
- `/usuario` - Requiere `esUsuario === "true"`
- Funciones de favoritos - Requiere JWT
- Funciones de reservas - Requiere JWT

#### Rutas Protegidas Restaurante:
- `/restaurante` - Requiere `esLocal === "true"`
- `/editInfo` - Requiere `esLocal === "true"`
- Subir fotos - Requiere JWT
- Editar precio - Requiere JWT

---

## 🎨 Características de Diseño

### Colores Principales
- **Amarillo RUTA-3B:** `rgb(255, 200, 67)` - Color principal
- **Negro:** Texto y contraste
- **Blanco:** Fondos y botones

### Componentes UI
- **Bootstrap 5:** Framework CSS
- **SweetAlert2:** Modales y alertas elegantes
- **React Router v6:** Navegación
- **Carruseles:** Galería de imágenes
- **Tarjetas:** Presentación de restaurantes

---

## 📱 Funcionalidades por Página

| Página | Usuario Normal | Restaurante | Público |
|--------|---------------|-------------|---------|
| Home | ✅ Ver | ✅ Ver | ✅ Ver |
| Restaurantes | ✅ Ver + Favoritos | ✅ Ver | ✅ Ver |
| Detalle | ✅ Ver + Reservar | ❌ | ✅ Ver |
| Panel Usuario | ✅ Acceso completo | ❌ | ❌ |
| Panel Restaurante | ❌ | ✅ Acceso completo | ❌ |
| Editar Info | ❌ | ✅ Acceso completo | ❌ |
| Contacto | ✅ Enviar | ✅ Enviar | ✅ Enviar |

---

## 🔄 Flujos de Usuario Completos

### Flujo 1: Usuario Descubre y Reserva

1. **Descubrimiento:**
   - Entra a la home
   - Ve restaurantes destacados
   - Click en "Ver todos los restaurantes"

2. **Exploración:**
   - Navega por listado completo
   - Ve fotos, precios, descripciones
   - Click en restaurante que le interesa

3. **Detalle:**
   - Ve información completa
   - Lee descripción detallada
   - Ve precio medio del ticket

4. **Registro (si no tiene cuenta):**
   - Click en "Registrarse"
   - Completa formulario
   - Confirma email

5. **Login:**
   - Ingresa credenciales
   - Accede a su panel

6. **Interacción:**
   - Vuelve a página del restaurante
   - Agrega a favoritos (corazón)
   - Selecciona fecha
   - Hace reserva

7. **Gestión:**
   - Va a su panel
   - Ve sus favoritos
   - Ve sus reservas
   - Puede eliminar favoritos

---

### Flujo 2: Restaurante se Registra y Configura

1. **Registro:**
   - Entra a la home
   - Click en "Registrarse"
   - Selecciona "Soy restaurante"
   - Completa formulario:
     - Nombre del local
     - Email
     - Password
     - Tipo de local
     - Descripción

2. **Login:**
   - Ingresa credenciales
   - Marca checkbox "Soy restaurante"
   - Accede a panel de restaurante

3. **Configuración Inicial:**
   - Ve mensaje de bienvenida
   - Lee política 3B
   - Ve su perfil básico

4. **Agregar Precio:**
   - Ve mensaje: "Deberías agregar precio"
   - Ingresa precio medio del ticket
   - Guarda información

5. **Subir Foto:**
   - Click en componente de carga
   - Selecciona foto del local
   - Sube a Cloudinary
   - Ve preview

6. **Editar Información:**
   - Click en "Editar Info"
   - Actualiza nombre si necesario
   - Actualiza tipo de local
   - Mejora descripción
   - Guarda cambios

7. **Visibilidad:**
   - Su local aparece en listado
   - Usuarios pueden verlo
   - Usuarios pueden reservar
   - Usuarios pueden agregarlo a favoritos

---

## 🎯 Casos de Uso Principales

### Usuario Normal:

1. **Buscar lugares para comer**
   - Explorar listado completo
   - Ver detalles de cada local
   - Comparar precios

2. **Guardar favoritos**
   - Marcar restaurantes que le gustan
   - Acceder rápidamente a ellos
   - Gestionar su lista

3. **Hacer reservas**
   - Seleccionar fecha
   - Confirmar reserva
   - Ver sus reservas activas

4. **Descubrir nuevos lugares**
   - Ver recomendaciones aleatorias
   - Explorar diferentes tipos de locales
   - Leer descripciones

---

### Restaurante:

1. **Promocionar su negocio**
   - Crear perfil atractivo
   - Subir fotos de calidad
   - Escribir descripción llamativa

2. **Gestionar información**
   - Actualizar precio
   - Cambiar descripción
   - Modificar tipo de local

3. **Recibir visibilidad**
   - Aparecer en listado público
   - Ser encontrado por usuarios
   - Recibir favoritos

4. **Gestionar reservas**
   - Ver quién ha reservado
   - Conocer fechas de reservas
   - Planificar capacidad

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 16.14.0** - Framework JavaScript
- **React Router v6** - Navegación
- **Bootstrap 5** - Estilos y componentes
- **SweetAlert2** - Alertas y modales
- **Webpack** - Bundler
- **Babel** - Transpilador

### Backend
- **Flask** - Framework Python
- **SQLAlchemy** - ORM
- **Flask-JWT-Extended** - Autenticación JWT
- **Flask-CORS** - Manejo de CORS
- **Flask-Migrate** - Migraciones de BD
- **Werkzeug** - Hash de contraseñas
- **PostgreSQL** - Base de datos

### Servicios Externos
- **Cloudinary** - Almacenamiento de imágenes
- **Formspark** - Formulario de contacto
- **Heroku** - Deployment (configurado)

---

## 📊 Estadísticas del Proyecto

- **Páginas:** 12 rutas principales
- **Componentes React:** 15+
- **Endpoints API:** 15+
- **Modelos de BD:** 3 (User, Locales, Direccion)
- **Relaciones:** 2 many-to-many
- **Tipos de usuario:** 2 (Usuario, Restaurante)

---

## 🎯 Propuesta de Valor

### Para Usuarios:
- ✅ Descubrir lugares 3B (Bueno, Bonito, Barato)
- ✅ Guardar favoritos
- ✅ Hacer reservas fácilmente
- ✅ Ver precios antes de ir
- ✅ Explorar nuevos lugares

### Para Restaurantes:
- ✅ Promoción gratuita
- ✅ Visibilidad en la ciudad
- ✅ Gestión simple de perfil
- ✅ Recibir reservas
- ✅ Conectar con clientes

---

## 🔮 Funcionalidades Futuras (Potencial)

### Para Usuarios:
- [ ] Sistema de valoraciones (estrellas)
- [ ] Comentarios y reseñas
- [ ] Filtros de búsqueda (precio, tipo, ubicación)
- [ ] Mapa interactivo con Google Maps
- [ ] Historial de visitas
- [ ] Compartir en redes sociales
- [ ] Notificaciones de nuevos locales

### Para Restaurantes:
- [ ] Dashboard con estadísticas
- [ ] Ver número de favoritos
- [ ] Ver número de reservas
- [ ] Responder a comentarios
- [ ] Subir múltiples fotos
- [ ] Horarios de apertura
- [ ] Menú/Carta digital
- [ ] Promociones especiales

### Sistema:
- [ ] Sistema de roles y permisos
- [ ] Admin panel mejorado
- [ ] Búsqueda avanzada
- [ ] Geolocalización
- [ ] Integración con redes sociales
- [ ] App móvil
- [ ] Sistema de puntos/recompensas

---

## 📞 Soporte y Contacto

Para más información sobre el funcionamiento de la aplicación:
- Página de contacto: `/contacto`
- Sobre nosotros: `/sobre-nosotros`

---

**Versión:** 2.0.0  
**Última actualización:** 2025-10-27  
**Estado:** ✅ Funcional con mejoras de seguridad implementadas
