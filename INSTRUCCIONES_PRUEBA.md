# 🧪 Instrucciones para Probar la Aplicación

## 🌐 URLs de Acceso

### Frontend:
[https://3000--019a9806-7151-73a1-a913-c98b7074a7b4.eu-central-1-01.gitpod.dev](https://3000--019a9806-7151-73a1-a913-c98b7074a7b4.eu-central-1-01.gitpod.dev)

### Backend API:
`http://localhost:3001` (interno)

---

## 🎯 Prueba del Mapa de Calor (CORREGIDO)

### Paso 1: Acceder al Mapa
1. Abre el frontend en tu navegador
2. En el menú de navegación, busca **"Mapa de Ofertas"**
3. Haz click para acceder

### Paso 2: Verificar que Funciona
Deberías ver:
- ✅ Un mapa de España/Portugal
- ✅ Colores en el mapa (azul → verde → rojo)
- ✅ Marcadores en diferentes ciudades
- ✅ Filtro de ciudades en la parte superior
- ✅ Estadísticas en el lateral derecho

### Paso 3: Interactuar
1. **Click en un marcador**: Debe mostrar un popup con:
   - Nombre del restaurante
   - Título de la oferta
   - Porcentaje de descuento
   - Ciudad

2. **Cambiar filtro de ciudad**: 
   - Selecciona "Madrid" en el dropdown
   - El mapa debe hacer zoom a Madrid
   - Solo se muestran ofertas de Madrid

3. **Ver estadísticas**:
   - En el sidebar derecho verás "Top Ciudades"
   - Click en "Ver" para filtrar por esa ciudad

### Paso 4: Abrir Consola del Navegador
1. Presiona **F12** (o click derecho → Inspeccionar)
2. Ve a la pestaña **Console**
3. Deberías ver logs como:
   ```
   Offers loaded: 48
   Map initialized successfully
   Filtered offers: 48
   Heat data points: 48
   ```

### ❌ Si Ves Errores:
- Toma captura de pantalla de la consola
- Copia el mensaje de error
- Avísame para investigar

---

## 🎨 Prueba de Otras Funcionalidades

### 1. Chatbot Inteligente
1. Busca el **botón flotante** en la esquina inferior derecha
2. Click para abrir el chat
3. Escribe: "Busco restaurante vegetariano en Madrid por 20 euros"
4. Debe responder con recomendaciones

**Pruebas adicionales**:
- "Restaurante romántico en Barcelona"
- "Comida italiana económica"
- "Lugar familiar en Valencia"

---

### 2. Experiencia Gastronómica
1. En el menú, click en **"Experiencia Gastronómica"**
2. Deberías ver **8 eventos** (catas, packs, talleres, degustaciones)
3. Prueba los filtros:
   - Tipo de evento
   - Ciudad
   - Rango de precio
4. Click en **"Ver Detalles"** de un evento
5. Debe abrir un modal con información completa

---

### 3. Dashboard Restaurantes
1. En el menú, click en **"Dashboard"**
2. **Nota**: Requiere estar autenticado como restaurante
3. Si no estás autenticado, verás un mensaje de error
4. Si estás autenticado, verás:
   - 3 gráficas (barras, línea, dona)
   - Métricas de reservas e ingresos
   - Estadísticas de ofertas

---

### 4. Listas Personalizadas
1. En el menú, click en **"Mis Listas"**
2. **Nota**: Requiere estar autenticado
3. Click en **"Crear Nueva Lista"**
4. Ingresa un nombre (ej: "Mis Favoritos")
5. Añade restaurantes a la lista
6. Arrastra para reordenar (drag & drop)

---

## 🔍 Checklist de Verificación

### Mapa de Calor:
- [ ] El mapa se carga sin pantalla en blanco
- [ ] Se ven colores en el mapa (heatmap)
- [ ] Los marcadores son visibles
- [ ] Los popups funcionan al hacer click
- [ ] El filtro por ciudad funciona
- [ ] Las estadísticas se actualizan
- [ ] No hay errores en la consola

### Chatbot:
- [ ] El botón flotante es visible
- [ ] El chat se abre al hacer click
- [ ] Responde a mensajes
- [ ] Las recomendaciones son relevantes
- [ ] Se puede cerrar el chat

### Experiencia Gastronómica:
- [ ] Se cargan los 8 eventos
- [ ] Los filtros funcionan
- [ ] El modal de detalles se abre
- [ ] Se puede inscribir a eventos
- [ ] El diseño es responsive

### Dashboard:
- [ ] Requiere autenticación (correcto)
- [ ] Las gráficas se renderizan
- [ ] Los datos son coherentes
- [ ] El diseño es responsive

### Listas:
- [ ] Requiere autenticación (correcto)
- [ ] Se pueden crear listas
- [ ] Se pueden añadir restaurantes
- [ ] El drag & drop funciona
- [ ] Se pueden eliminar items

---

## 🐛 Problemas Conocidos

### 1. Bundle Size Grande
**Síntoma**: La primera carga puede ser lenta  
**Causa**: Bundle de 979 KB (por encima del límite)  
**Impacto**: Bajo (solo primera carga)  
**Solución futura**: Code splitting

### 2. Dashboard Sin Datos
**Síntoma**: Gráficas vacías si no hay datos  
**Causa**: Falta seed data para restaurantes de prueba  
**Impacto**: Bajo (solo en desarrollo)  
**Solución**: Crear cuenta de restaurante y añadir datos

### 3. Listas Requieren Autenticación
**Síntoma**: No se puede usar sin login  
**Causa**: Diseño intencional (requiere usuario)  
**Impacto**: Ninguno (comportamiento esperado)  
**Solución**: Crear cuenta de usuario

---

## 📊 Datos de Prueba

### Ofertas Disponibles:
- **48 ofertas** activas
- **30 restaurantes** con ofertas
- **Ciudades**: Madrid (25), Barcelona (10), Valencia (8), otras (5)
- **Descuentos**: 20% - 50%

### Eventos Disponibles:
- **8 eventos** activos
- **Tipos**: 2 catas, 2 packs, 2 talleres, 2 degustaciones
- **Ciudades**: Madrid, Barcelona, Sevilla, Lisboa
- **Precios**: 35€ - 120€

### Restaurantes:
- **265 restaurantes** en total
- **16 ciudades** (España y Portugal)
- **Tipos**: Italiano, Mexicano, Vegetariano, Mediterráneo, etc.

---

## 🎯 Casos de Uso Recomendados

### Caso 1: Buscar Ofertas en Madrid
1. Ir a "Mapa de Ofertas"
2. Seleccionar "Madrid" en el filtro
3. Ver las ~25 ofertas disponibles
4. Click en marcadores para ver detalles
5. Identificar las mejores ofertas (mayor descuento)

### Caso 2: Planificar Experiencia Gastronómica
1. Ir a "Experiencia Gastronómica"
2. Filtrar por "Catas"
3. Ver eventos disponibles
4. Seleccionar uno y ver detalles
5. Inscribirse (si hay plazas)

### Caso 3: Usar el Chatbot
1. Abrir el chatbot
2. Escribir: "Busco restaurante vegetariano económico en Barcelona"
3. Ver recomendaciones
4. Preguntar por más opciones
5. Cerrar el chat

---

## 📱 Prueba Responsive

### Desktop (1920x1080):
1. Abre en pantalla completa
2. Verifica que todo se ve bien
3. El mapa debe ocupar ~70% del ancho

### Tablet (768x1024):
1. Abre DevTools (F12)
2. Click en el icono de dispositivo móvil
3. Selecciona "iPad"
4. Verifica que el diseño se adapta

### Mobile (375x667):
1. En DevTools, selecciona "iPhone SE"
2. Verifica que:
   - El menú colapsa
   - Las cards se apilan verticalmente
   - El mapa ocupa toda la pantalla
   - El chatbot se minimiza

---

## 🔧 Troubleshooting

### Problema: "Mapa no carga"
**Solución**:
1. Abre la consola (F12)
2. Busca errores en rojo
3. Recarga la página (Ctrl+R)
4. Si persiste, limpia caché (Ctrl+Shift+R)

### Problema: "No se ven ofertas"
**Solución**:
1. Verifica que el backend está corriendo
2. Abre: `http://localhost:3001/api/offers`
3. Deberías ver JSON con 48 ofertas
4. Si no, reinicia el backend

### Problema: "Chatbot no responde"
**Solución**:
1. Verifica que escribiste un mensaje
2. Presiona Enter o click en enviar
3. Espera 1-2 segundos (simula typing)
4. Si no responde, recarga la página

### Problema: "Dashboard vacío"
**Solución**:
1. Esto es normal si no estás autenticado
2. Crea una cuenta de restaurante
3. Añade datos de prueba
4. Recarga el dashboard

---

## 📞 Reportar Problemas

Si encuentras algún problema:

1. **Captura de pantalla** de la página
2. **Captura de la consola** (F12 → Console)
3. **Descripción** del problema:
   - ¿Qué intentabas hacer?
   - ¿Qué esperabas que pasara?
   - ¿Qué pasó en realidad?
4. **Pasos para reproducir**:
   - Paso 1: ...
   - Paso 2: ...
   - Paso 3: ...

---

## ✅ Confirmación Final

Después de probar todo, confirma:

- [ ] El mapa de calor funciona correctamente
- [ ] No hay pantalla en blanco
- [ ] Todas las funcionalidades son accesibles
- [ ] El diseño es responsive
- [ ] No hay errores críticos en consola

---

## 🚀 Siguiente Paso

Una vez confirmado que todo funciona:
1. Revisar el archivo `ANALISIS_APLICACION.md` para detalles técnicos
2. Revisar el archivo `RESUMEN_EJECUTIVO.md` para el estado general
3. Decidir si hacer push a GitHub (ver `PUSH_INSTRUCTIONS.md`)

---

**Última actualización**: 18 Nov 2025  
**Estado**: ✅ LISTO PARA PRUEBAS  
**Versión**: 1.0.1
