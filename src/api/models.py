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
            "foto": self.foto
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
