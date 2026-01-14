# 🐛 Análisis del Sistema de Reservas - BUGS CRÍTICOS

## ❌ PROBLEMAS IDENTIFICADOS

He encontrado **múltiples bugs graves** en el sistema de reservas que hacen que NO funcione correctamente.

---

## 🔴 BUG #1: Sistema de Fecha Roto

### Problema:
El sistema guarda **UNA SOLA FECHA** para el usuario, no una fecha por reserva.

### Ubicación:
**Modelo User** (`src/api/models.py` línea 31):
```python
date = db.Column(db.Date, nullable=True)
```

### ¿Qué está mal?
- La fecha está en la tabla `User`, no en la relación `reservations`
- Cuando haces múltiples reservas, **la fecha se sobrescribe**
- Solo puedes tener UNA fecha para TODAS tus reservas
- No hay forma de saber qué fecha corresponde a qué restaurante

### Ejemplo del problema:
```
Usuario hace reserva en Restaurante A para el 15 de enero
→ user.date = "2025-01-15"

Usuario hace reserva en Restaurante B para el 20 de enero
→ user.date = "2025-01-20" (SE SOBRESCRIBE)

Ahora AMBAS reservas muestran "20 de enero"
```

---

## 🔴 BUG #2: Visualización Incorrecta de Reservas

### Problema:
El modal de reservas muestra información mezclada e incorrecta.

### Ubicación:
**usuario.js** (líneas 34-47):
```javascript
const verResera = () => {
  Swal.fire({
    title: "Tienes una reserva en " + 
           store.reserva[store.reserva.length - 1]?.nombre,  // ❌ ÚLTIMA reserva
    text: "El dia " + store.profiles?.date,                  // ❌ ÚNICA fecha del usuario
    imageUrl: store.reserva[0]?.foto,                        // ❌ PRIMERA foto
    // ...
  });
};
```

### ¿Qué está mal?
1. **Título:** Muestra el nombre del ÚLTIMO restaurante (`length - 1`)
2. **Fecha:** Muestra la ÚNICA fecha del usuario (no específica de reserva)
3. **Foto:** Muestra la foto del PRIMER restaurante (`[0]`)

### Resultado:
Si tienes 3 reservas:
- Restaurante A (foto de pizza)
- Restaurante B (foto de sushi)
- Restaurante C (foto de tacos)

El modal muestra:
- **Título:** "Restaurante C" (último)
- **Foto:** Pizza (primero)
- **Fecha:** La última fecha que guardaste

**¡Información completamente mezclada!**

---

## 🔴 BUG #3: No Hay Tabla de Reservas Real

### Problema:
La tabla `reservations` es solo una relación many-to-many SIN información adicional.

### Ubicación:
**models.py** (líneas 12-15):
```python
reservations = db.Table('reservations',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('locales_id', db.Integer, db.ForeignKey('locales.id'), primary_key=True)
)
```

### ¿Qué está mal?
- Solo guarda: "Usuario X tiene reserva en Local Y"
- **NO guarda:**
  - Fecha de la reserva
  - Hora de la reserva
  - Número de personas
  - Estado (confirmada, cancelada, completada)
  - Notas o comentarios

### Comparación:

**Actual (Incorrecto):**
```
reservations
-----------
user_id | locales_id
   1    |     5
   1    |     8
```

**Debería ser:**
```
reservations
-----------
id | user_id | locales_id | date       | time  | people | status
1  |    1    |     5      | 2025-01-15 | 20:00 |   2    | confirmed
2  |    1    |     8      | 2025-01-20 | 19:30 |   4    | confirmed
```

---

## 🔴 BUG #4: Endpoint Confuso y Duplicado

### Problema:
Hay DOS endpoints para crear reservas que hacen cosas diferentes.

### Ubicación:

**Endpoint 1:** `/api/addReserva/<id>` (línea 318)
```python
def add_reserva(id):
    user = User.query.get(id)
    date = request.json.get('date', None)
    if date != None:
        user.date = date  # ❌ Guarda fecha en User
    db.session.commit()
```

**Endpoint 2:** `/api/reservarlocal/<id>` (línea 233)
```python
def make_reservation(local_id):
    user.reservalocales.append(local)  # ❌ Solo agrega relación
    db.session.commit()
```

### ¿Qué está mal?
1. **Dos endpoints** para una sola acción
2. **Endpoint 1** guarda la fecha en el usuario (sobrescribe)
3. **Endpoint 2** solo crea la relación (sin fecha)
4. El frontend llama a AMBOS:
   ```javascript
   actions.addReserva(store.profiles?.id, date);      // Guarda fecha
   actions.reservarlocal(store.restaurantes[theid-1]?.id); // Crea relación
   ```

---

## 🔴 BUG #5: Acceso por Índice de Array

### Problema:
Se accede a restaurantes por índice de array en lugar de ID.

### Ubicación:
**rutaComida.js** (línea 17):
```javascript
actions.reservarlocal(store.restaurantes[theid-1]?.id);
```

### ¿Qué está mal?
- `theid` es el ID del restaurante (ej: 5)
- `store.restaurantes[theid-1]` asume que el array está ordenado por ID
- Si el restaurante con ID 5 está en la posición 2 del array, falla
- Si hay restaurantes eliminados, los índices no coinciden

### Ejemplo del problema:
```javascript
// Base de datos:
Restaurante ID 1 - "Pizza Place"
Restaurante ID 3 - "Sushi Bar" (ID 2 fue eliminado)
Restaurante ID 5 - "Taco Shop"

// Array en frontend:
store.restaurantes[0] = {id: 1, nombre: "Pizza Place"}
store.restaurantes[1] = {id: 3, nombre: "Sushi Bar"}
store.restaurantes[2] = {id: 5, nombre: "Taco Shop"}

// Usuario va a /ruta-comida/5 (Taco Shop)
theid = 5
store.restaurantes[5-1] = store.restaurantes[4] = undefined ❌

// Debería buscar por ID:
store.restaurantes.find(r => r.id === 5) ✅
```

---

## 🔴 BUG #6: No Hay Validación de Fecha

### Problema:
No se valida que la fecha sea futura.

### Ubicación:
Backend y frontend

### ¿Qué está mal?
- Usuario puede reservar para ayer
- Usuario puede reservar para hace 5 años
- No hay validación de formato de fecha
- No hay validación de que el restaurante esté abierto ese día

---

## 🔴 BUG #7: Múltiples Reservas Muestran Solo Una

### Problema:
El botón "Ver mis reservas" solo muestra UNA reserva, aunque tengas varias.

### Ubicación:
**usuario.js** (línea 34):
```javascript
const verResera = () => {
  Swal.fire({
    title: "Tienes una reserva en " + 
           store.reserva[store.reserva.length - 1]?.nombre,
    // Solo muestra la última
  });
};
```

### ¿Qué está mal?
- `store.reserva` es un array con TODAS las reservas
- El modal solo muestra información de UNA
- No hay forma de ver las otras reservas
- No hay lista o carrusel de reservas

---

## 📊 Resumen de Problemas

| Bug | Severidad | Impacto |
|-----|-----------|---------|
| #1: Fecha única | 🔴 CRÍTICO | Todas las reservas tienen la misma fecha |
| #2: Visualización mezclada | 🔴 CRÍTICO | Muestra info incorrecta |
| #3: Sin tabla de reservas | 🔴 CRÍTICO | No se puede guardar info por reserva |
| #4: Endpoints duplicados | 🟠 ALTO | Confusión y código duplicado |
| #5: Acceso por índice | 🟠 ALTO | Falla con IDs no consecutivos |
| #6: Sin validación fecha | 🟡 MEDIO | Permite fechas inválidas |
| #7: Solo muestra una reserva | 🟠 ALTO | No se ven todas las reservas |

---

## ✅ SOLUCIÓN PROPUESTA

### 1. Crear Modelo de Reserva Propio

```python
class Reservation(db.Model):
    __tablename__ = 'reservation'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    local_id = db.Column(db.Integer, db.ForeignKey('locales.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=True)
    people = db.Column(db.Integer, default=2)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, cancelled
    notes = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    user = db.relationship('User', backref='reservations')
    local = db.relationship('Locales', backref='reservations')
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "local_id": self.local_id,
            "local_name": self.local.nombre,
            "local_foto": self.local.foto,
            "date": self.date.isoformat() if self.date else None,
            "time": self.time.isoformat() if self.time else None,
            "people": self.people,
            "status": self.status,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
```

### 2. Actualizar Modelo User

```python
class User(db.Model):
    # ... campos existentes ...
    # ELIMINAR: date = db.Column(db.Date, nullable=True)
    
    # Las reservas ahora vienen de la relación en Reservation
    # reservations = relationship definida en Reservation con backref
```

### 3. Nuevo Endpoint de Reserva

```python
@api.route('/reservations', methods=['POST'])
@jwt_required()
def create_reservation():
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        data = request.get_json()
        local_id = data.get('local_id')
        date_str = data.get('date')
        time_str = data.get('time', None)
        people = data.get('people', 2)
        
        # Validaciones
        if not local_id or not date_str:
            return jsonify({'message': 'local_id and date are required'}), 400
        
        # Validar que el local existe
        local = Locales.query.get(local_id)
        if not local:
            return jsonify({'message': 'Local not found'}), 404
        
        # Validar fecha futura
        reservation_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        if reservation_date < datetime.now().date():
            return jsonify({'message': 'Date must be in the future'}), 400
        
        # Verificar si ya tiene reserva para ese día en ese local
        existing = Reservation.query.filter_by(
            user_id=user.id,
            local_id=local_id,
            date=reservation_date,
            status='confirmed'
        ).first()
        
        if existing:
            return jsonify({'message': 'You already have a reservation for this date'}), 409
        
        # Crear reserva
        new_reservation = Reservation(
            user_id=user.id,
            local_id=local_id,
            date=reservation_date,
            time=datetime.strptime(time_str, '%H:%M').time() if time_str else None,
            people=people,
            status='confirmed'
        )
        
        db.session.add(new_reservation)
        db.session.commit()
        
        return jsonify(new_reservation.serialize()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Server error'}), 500


@api.route('/reservations', methods=['GET'])
@jwt_required()
def get_user_reservations():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    reservations = Reservation.query.filter_by(user_id=user.id).order_by(Reservation.date.desc()).all()
    
    return jsonify([r.serialize() for r in reservations]), 200


@api.route('/reservations/<int:reservation_id>', methods=['DELETE'])
@jwt_required()
def cancel_reservation(reservation_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    reservation = Reservation.query.get(reservation_id)
    
    if not reservation:
        return jsonify({'message': 'Reservation not found'}), 404
    
    if reservation.user_id != user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    reservation.status = 'cancelled'
    db.session.commit()
    
    return jsonify({'message': 'Reservation cancelled'}), 200
```

### 4. Actualizar Frontend - flux.js

```javascript
// Crear reserva
createReservation: async (localId, date, time, people) => {
  try {
    const response = await fetch(
      process.env.BACKEND_URL + "/api/reservations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          local_id: localId,
          date: date,
          time: time,
          people: people
        }),
      }
    );
    
    if (response.status === 201) {
      const data = await response.json();
      alert("Reserva creada exitosamente");
      return true;
    } else if (response.status === 409) {
      alert("Ya tienes una reserva para esta fecha en este restaurante");
      return false;
    } else {
      alert("Error al crear la reserva");
      return false;
    }
  } catch (err) {
    alert("Error al crear la reserva");
    return false;
  }
},

// Obtener reservas
getReservations: async () => {
  try {
    const response = await fetch(
      process.env.BACKEND_URL + "/api/reservations",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      setStore({ reservations: data });
    }
  } catch (err) {
    console.error("Error fetching reservations");
  }
},

// Cancelar reserva
cancelReservation: async (reservationId) => {
  try {
    const response = await fetch(
      process.env.BACKEND_URL + "/api/reservations/" + reservationId,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    
    if (response.ok) {
      alert("Reserva cancelada");
      // Recargar reservas
      getActions().getReservations();
      return true;
    }
  } catch (err) {
    alert("Error al cancelar la reserva");
    return false;
  }
}
```

### 5. Actualizar rutaComida.js

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Buscar restaurante por ID, no por índice
  const restaurant = store.restaurantes.find(r => r.id === parseInt(theid));
  
  if (!restaurant) {
    alert("Restaurante no encontrado");
    return;
  }
  
  const success = await actions.createReservation(
    restaurant.id,
    date,
    null,  // time (opcional)
    2      // people (default)
  );
  
  if (success) {
    setDate("");  // Limpiar formulario
  }
};
```

### 6. Actualizar usuario.js - Mostrar TODAS las reservas

```javascript
const verReservas = () => {
  if (!store.reservations || store.reservations.length === 0) {
    Swal.fire({
      title: "Sin reservas",
      text: "No tienes reservas activas",
      icon: "info"
    });
    return;
  }
  
  // Crear HTML con todas las reservas
  const reservasHTML = store.reservations
    .filter(r => r.status === 'confirmed')
    .map(reserva => `
      <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px;">
        <h4>${reserva.local_name}</h4>
        <p><strong>Fecha:</strong> ${new Date(reserva.date).toLocaleDateString()}</p>
        ${reserva.time ? `<p><strong>Hora:</strong> ${reserva.time}</p>` : ''}
        <p><strong>Personas:</strong> ${reserva.people}</p>
        <img src="${reserva.local_foto}" style="width: 100%; max-width: 300px; border-radius: 5px;" />
        <button onclick="cancelReservation(${reserva.id})" class="btn btn-danger btn-sm mt-2">
          Cancelar Reserva
        </button>
      </div>
    `).join('');
  
  Swal.fire({
    title: "Mis Reservas",
    html: reservasHTML,
    width: 800,
    confirmButtonColor: "#ffc843",
  });
};

useEffect(() => {
  actions.getReservations();  // Cargar reservas
  actions.getFavorit();
  actions.getInformationCurrentMember();
}, []);
```

---

## 🎯 Beneficios de la Solución

### Antes (Actual - Roto):
- ❌ Una sola fecha para todas las reservas
- ❌ Información mezclada
- ❌ No se pueden ver todas las reservas
- ❌ No se puede cancelar
- ❌ No hay validaciones

### Después (Propuesto - Funcional):
- ✅ Cada reserva tiene su propia fecha
- ✅ Información correcta por reserva
- ✅ Ver lista completa de reservas
- ✅ Cancelar reservas individuales
- ✅ Validación de fechas futuras
- ✅ Validación de duplicados
- ✅ Información adicional (hora, personas)
- ✅ Estados de reserva (confirmada, cancelada)

---

## 📋 Pasos para Implementar

1. **Crear modelo Reservation** en `models.py`
2. **Eliminar campo `date`** de modelo User
3. **Crear nuevos endpoints** en `routes.py`
4. **Eliminar endpoints antiguos** (`/addReserva`, `/reservarlocal`)
5. **Actualizar flux.js** con nuevas funciones
6. **Actualizar rutaComida.js** para crear reservas correctamente
7. **Actualizar usuario.js** para mostrar todas las reservas
8. **Migrar base de datos:**
   ```bash
   pipenv run flask db migrate -m "Add Reservation model"
   pipenv run flask db upgrade
   ```

---

## ⚠️ CONCLUSIÓN

**El sistema de reservas actual NO funciona correctamente.**

### Problemas principales:
1. Solo guarda UNA fecha para TODAS las reservas
2. Muestra información mezclada e incorrecta
3. No se pueden ver todas las reservas
4. No hay validaciones
5. Código confuso con endpoints duplicados

### Recomendación:
**Implementar la solución propuesta** para tener un sistema de reservas funcional y profesional.

---

**Fecha de análisis:** 2025-10-27  
**Estado:** 🔴 SISTEMA ROTO - Requiere refactorización completa
