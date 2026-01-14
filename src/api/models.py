from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()



# Many to Many likes
likes = db.Table('likes',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('locales_id', db.Integer, db.ForeignKey('locales.id'), primary_key=True)
)




# TABLA PARA REGISTRO DE USUARIO

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    apellido = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    foto_user = db.Column(db.String(200), nullable=True)
    password = db.Column(db.String(255), nullable=False)
    localesfav = db.relationship('Locales', secondary=likes, lazy='subquery', backref=db.backref('users_who_like', lazy=True))

    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f'<User {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "email": self.email,
            "foto_user": self.foto_user,
            "likes": [favorite.serialize() for favorite in self.localesfav]
        }



# TABLA PARA REGISTRO DE RESTAURANT
class Locales(db.Model):
    __tablename__ = 'locales'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    tipo_local = db.Column(db.String(80), nullable=False)
    descripcion = db.Column(db.String(250), nullable=False)
    precio = db.Column(db.Integer, nullable=True)
    foto = db.Column(db.String(500), nullable=True)
    
    # Campos de dirección y ubicación
    direccion = db.Column(db.String(300), nullable=True)
    ciudad = db.Column(db.String(100), nullable=True)
    codigo_postal = db.Column(db.String(20), nullable=True)
    latitud = db.Column(db.Float, nullable=True)
    longitud = db.Column(db.Float, nullable=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f'<Locales> {self.id} {self.email}'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "tipo_local": self.tipo_local,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "foto": self.foto,
            "direccion": self.direccion,
            "ciudad": self.ciudad,
            "codigo_postal": self.codigo_postal,
            "latitud": self.latitud,
            "longitud": self.longitud
        }

# TABLA DE DIRECCIÓN
class Direccion(db.Model):
    __tablename__ = 'direccion'
    id = db.Column(db.Integer, primary_key=True)
    barrio = db.Column(db.String(120), nullable=False)
    calle = db.Column(db.String(120), nullable=False)
    numero = db.Column(db.Integer,  nullable=False)
    

    def __repr__(self):
        return f'<Direccion {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "barrio": self.barrio,
            "calle": self.calle,
            "numero": self.numero
        }


# TABLA DE RESERVAS
class Reservation(db.Model):
    __tablename__ = 'reservation'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    local_id = db.Column(db.Integer, db.ForeignKey('locales.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=True)
    people = db.Column(db.Integer, default=2)
    status = db.Column(db.String(20), default='confirmed')
    notes = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    user = db.relationship('User', backref=db.backref('reservations', lazy=True))
    local = db.relationship('Locales', backref=db.backref('reservations', lazy=True))
    
    def __repr__(self):
        return f'<Reservation {self.id} - User {self.user_id} - Local {self.local_id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "local_id": self.local_id,
            "local_name": self.local.nombre if self.local else None,
            "local_foto": self.local.foto if self.local else None,
            "local_tipo": self.local.tipo_local if self.local else None,
            "date": self.date.isoformat() if self.date else None,
            "time": self.time.isoformat() if self.time else None,
            "people": self.people,
            "status": self.status,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


# TABLA DE COMENTARIOS/RESEÑAS
class Review(db.Model):
    __tablename__ = 'review'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    local_id = db.Column(db.Integer, db.ForeignKey('locales.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 estrellas
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    user = db.relationship('User', backref=db.backref('reviews', lazy=True))
    local = db.relationship('Locales', backref=db.backref('reviews', lazy=True))
    
    def __repr__(self):
        return f'<Review {self.id} - User {self.user_id} - Local {self.local_id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": f"{self.user.nombre} {self.user.apellido}" if self.user else None,
            "local_id": self.local_id,
            "local_name": self.local.nombre if self.local else None,
            "rating": self.rating,
            "comment": self.comment,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


# TABLA PARA EVENTOS GASTRONÓMICOS
class GastronomicEvent(db.Model):
    __tablename__ = 'gastronomic_event'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    event_type = db.Column(db.String(50), nullable=False)  # cata, pack, taller, degustacion
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    max_participants = db.Column(db.Integer, default=20)
    current_participants = db.Column(db.Integer, default=0)
    local_id = db.Column(db.Integer, db.ForeignKey('locales.id'), nullable=True)
    city = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(300), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relación
    local = db.relationship('Locales', backref=db.backref('events', lazy=True))
    
    def __repr__(self):
        return f'<GastronomicEvent {self.id} - {self.title}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "event_type": self.event_type,
            "price": self.price,
            "image_url": self.image_url,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "max_participants": self.max_participants,
            "current_participants": self.current_participants,
            "available_spots": self.max_participants - self.current_participants,
            "local_id": self.local_id,
            "local_name": self.local.nombre if self.local else None,
            "city": self.city,
            "address": self.address,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


# TABLA PARA OFERTAS DE RESTAURANTES
class Offer(db.Model):
    __tablename__ = 'offer'
    id = db.Column(db.Integer, primary_key=True)
    local_id = db.Column(db.Integer, db.ForeignKey('locales.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    discount_percentage = db.Column(db.Integer, nullable=False)  # 10, 20, 30, etc.
    original_price = db.Column(db.Float, nullable=True)
    discounted_price = db.Column(db.Float, nullable=True)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    terms_conditions = db.Column(db.Text, nullable=True)
    max_uses = db.Column(db.Integer, default=100)
    current_uses = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relación
    local = db.relationship('Locales', backref=db.backref('offers', lazy=True))
    
    def __repr__(self):
        return f'<Offer {self.id} - {self.title}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "local_id": self.local_id,
            "local_name": self.local.nombre if self.local else None,
            "local_city": self.local.ciudad if self.local else None,
            "local_address": self.local.direccion if self.local else None,
            "local_latitude": self.local.latitud if self.local else None,
            "local_longitude": self.local.longitud if self.local else None,
            "title": self.title,
            "description": self.description,
            "discount_percentage": self.discount_percentage,
            "original_price": self.original_price,
            "discounted_price": self.discounted_price,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "terms_conditions": self.terms_conditions,
            "max_uses": self.max_uses,
            "current_uses": self.current_uses,
            "available_uses": self.max_uses - self.current_uses,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


# TABLA PARA RESERVAS DE EXPERIENCIAS GASTRONÓMICAS
class EventReservation(db.Model):
    __tablename__ = 'event_reservation'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('gastronomic_event.id'), nullable=False)
    participants = db.Column(db.Integer, default=1)
    status = db.Column(db.String(20), default='confirmed')  # confirmed, cancelled, completed
    notes = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    user = db.relationship('User', backref=db.backref('event_reservations', lazy=True))
    event = db.relationship('GastronomicEvent', backref=db.backref('reservations', lazy=True))
    
    def __repr__(self):
        return f'<EventReservation {self.id} - User {self.user_id} - Event {self.event_id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "event_title": self.event.title if self.event else None,
            "event_type": self.event.event_type if self.event else None,
            "event_price": self.event.price if self.event else None,
            "event_start_date": self.event.start_date.isoformat() if self.event and self.event.start_date else None,
            "event_end_date": self.event.end_date.isoformat() if self.event and self.event.end_date else None,
            "event_city": self.event.city if self.event else None,
            "event_address": self.event.address if self.event else None,
            "event_image": self.event.image_url if self.event else None,
            "local_name": self.event.local.nombre if self.event and self.event.local else None,
            "participants": self.participants,
            "status": self.status,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


# TABLA PARA LISTAS PERSONALIZADAS DE USUARIOS
class UserList(db.Model):
    __tablename__ = 'user_list'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_public = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relación
    user = db.relationship('User', backref=db.backref('lists', lazy=True))
    
    def __repr__(self):
        return f'<UserList {self.id} - {self.name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
            "is_public": self.is_public,
            "items_count": len(self.items),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


# TABLA PARA ITEMS DE LISTAS
class ListItem(db.Model):
    __tablename__ = 'list_item'
    id = db.Column(db.Integer, primary_key=True)
    list_id = db.Column(db.Integer, db.ForeignKey('user_list.id'), nullable=False)
    local_id = db.Column(db.Integer, db.ForeignKey('locales.id'), nullable=False)
    position = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    list = db.relationship('UserList', backref=db.backref('items', lazy=True, order_by='ListItem.position'))
    local = db.relationship('Locales', backref=db.backref('list_items', lazy=True))
    
    def __repr__(self):
        return f'<ListItem {self.id} - List {self.list_id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "list_id": self.list_id,
            "local_id": self.local_id,
            "local_name": self.local.nombre if self.local else None,
            "local_type": self.local.tipo_local if self.local else None,
            "local_city": self.local.ciudad if self.local else None,
            "local_photo": self.local.foto if self.local else None,
            "position": self.position,
            "notes": self.notes,
            "added_at": self.added_at.isoformat() if self.added_at else None
        }
