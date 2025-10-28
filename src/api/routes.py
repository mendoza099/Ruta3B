"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Locales, Direccion, Reservation
from api.utils import generate_sitemap, APIException
import json
import datetime
from datetime import datetime as dt

# # flask jwt paquete de instalacion
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required


api = Blueprint('api', __name__)

@api.route('/login-required', methods=['GET'])
def login_required_message():
    return jsonify({'message': 'Authentication required to access admin panel'}), 401




#GET de restaurantes 

@api.route('/restaurantes', methods=['GET'])
def get_restaurantes():
    
    restaurantes = Locales.query.all()
    all_restaurantes = list(map(lambda x: x.serialize(), restaurantes))

    return jsonify(all_restaurantes), 200
 # Create a route to authenticate your users and return JWTs. The
 # create_access_token() function is used to actually generate the JWT.





@api.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        email = data.get('email', None)
        password = data.get('password', None)
        type = data.get('type', None)
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        user = None
        if type:
            # restaurante
            user = Locales.query.filter_by(email=email).one_or_none()
            if not user:
                return jsonify({'message': 'Invalid credentials'}), 401
            if not user.check_password(password):
                return jsonify({"message": "Invalid credentials"}), 401
        else:
            # usuario
            user = User.query.filter_by(email=email).one_or_none()
            if not user:
                return jsonify({'message': 'Invalid credentials'}), 401
            if not user.check_password(password):
                return jsonify({"message": "Invalid credentials"}), 401
        
        expired = datetime.timedelta(minutes=240)
        access_token = create_access_token(identity=email, expires_delta=expired)
        return jsonify({"access_token": access_token, "type": type}), 200
    
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500

# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.




@api.route("/profile", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    
    return jsonify(user.serialize()), 200


@api.route("/profile-restaurante", methods=["GET"])
@jwt_required()
def profile_protected():
    # Access the identity of the current user with get_jwt_identity
    current_local = get_jwt_identity()
    local = Locales.query.filter_by(email=current_local).first()
    
    return jsonify(local.serialize()), 200



# #NUEVO USUARIO
@api.route('/user', methods=['POST'])   
def create_new_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        required_fields = ['nombre', 'apellido', 'email', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data["email"]).first()
        if existing_user:
            return jsonify({'message': 'Email already registered'}), 409
        
        new_user = User(
            nombre=data["nombre"],
            apellido=data["apellido"],
            email=data["email"]
        )
        new_user.set_password(data["password"])
        
        db.session.add(new_user)
        db.session.commit()
        
        access_token = create_access_token(identity=data["email"])
        return jsonify(access_token=access_token), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Server error'}), 500 



# #NUEVO USUARIO LOCAL
@api.route('/locales', methods=['POST'])   
def create_new_user_locales():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        required_fields = ['nombre', 'email', 'password', 'tipo_local', 'descripcion']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Check if local already exists
        existing_local = Locales.query.filter_by(email=data["email"]).first()
        if existing_local:
            return jsonify({'message': 'Email already registered'}), 409
        
        new_user_local = Locales(
            nombre=data["nombre"],
            email=data["email"],
            tipo_local=data["tipo_local"],
            descripcion=data["descripcion"]
        )
        new_user_local.set_password(data["password"])
        
        db.session.add(new_user_local)
        db.session.commit()
        
        access_token = create_access_token(identity=data["email"])
        return jsonify(access_token=access_token), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Server error'}), 500 



@api.route('/favlocales/<int:local_id>', methods=['POST', 'DELETE'])
@jwt_required()
def save_fav_local(local_id):

    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if request.method=='POST':
        local = Locales.query.get(local_id)
        if local not in user.localesfav:
            user.localesfav.append(local)
            db.session.add(local)
            db.session.commit()
            return jsonify({'response': "Favorit add"}),200
        
        else: 
            return jsonify({"response" : "Ya tienes este local favorito"}), 208
        

    if request.method=="DELETE":
        local = Locales.query.get(local_id)
        user.localesfav.remove(local)
        db.session.commit()
        user = User.query.filter_by(email=email).first()
        user_favorites = user.localesfav
        all_favorites = [favorite.serialize() for favorite in user_favorites]
        return jsonify(all_favorites),200

        




@api.route('/user/favoritos', methods=['GET'])
@jwt_required()
def get_fav_list():
    email = get_jwt_identity()
    userfavs = User.query.filter_by(email=email).first()
    print(email)
    print(userfavs)

    if userfavs:
        user_favorites = userfavs.localesfav
        all_favorites = [favorite.serialize() for favorite in user_favorites] # serializame por cada favorito, en user_favorites
        if len(all_favorites)==0:
            return jsonify(all_favorites),404
        return jsonify(all_favorites), 200
    
   
# DEPRECATED: Old reservation endpoints removed
# Use /api/reservations instead


#Añadir precio desde perfil de restaurante:

@api.route('/addPrice/<int:id>', methods=['PUT'])
@jwt_required()
def edit_precio_local(id):
    
    
    local = Locales.query.get(id)
    
    nombre = request.json.get('nombre', None)
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    tipo_local = request.json.get('tipo_local', None)
    descripcion = request.json.get('descripcion', None)
    precio = request.json.get('precio', None)
    

    if  (nombre or email or password or tipo_local or descripcion or precio):
            if nombre != None:
                local.nombre = nombre
            if email != None:  
                local.email = email
            if password != None:
                local.password = password
            if tipo_local != None:
                local.tipo_local = tipo_local
            if descripcion !=None:
                local.descripcion = descripcion
            if precio != None:
                local.precio = precio
            
            
            
            db.session.commit()
            
            return jsonify({'results': local.serialize()}),201


# DEPRECATED: Old addReserva endpoint removed
# Use POST /api/reservations instead



#Añadir foto desde perfil de restaurante:

@api.route('/addPhoto/<int:id>', methods=['PUT'])
@jwt_required()
def add_foto_local(id):
    
    
    local = Locales.query.get(id)
    
    nombre = request.json.get('nombre', None)
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    tipo_local = request.json.get('tipo_local', None)
    descripcion = request.json.get('descripcion', None)
    precio = request.json.get('precio', None)
    foto = request.json.get('foto', None)

    if  (nombre or email or password or tipo_local or descripcion or precio or foto):
            if nombre != None:
                local.nombre = nombre
            if email != None:  
                local.email = email
            if password != None:
                local.password = password
            if tipo_local != None:
                local.tipo_local = tipo_local
            if descripcion !=None:
                local.descripcion = descripcion
            if precio != None:
                local.precio = precio
            if foto != None:
                local.foto = foto
            
            
            db.session.commit()
            
            return jsonify({'results': local.serialize()}),201
    


#Añadir fotos para el restaurante:

@api.route('/editInfoRestaurantes/<int:id>', methods=['PUT'])
@jwt_required()
def edit_info_general_locales(id):
    
    
    local = Locales.query.get(id)
    
    nombre = request.json.get('nombre', None)
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    tipo_local = request.json.get('tipo_local', None)
    descripcion = request.json.get('descripcion', None)
    precio = request.json.get('precio', None)
    foto = request.json.get('foto', None)

    if  (nombre or email or password or tipo_local or descripcion or precio or foto):
            if nombre != None:
                local.nombre = nombre
            if email != None:  
                local.email = email
            if password != None:
                local.password = password
            if tipo_local != None:
                local.tipo_local = tipo_local
            if descripcion !=None:
                local.descripcion = descripcion
            if precio != None:
                local.precio = precio
            if foto != None:
                local.foto = foto
            
            
            db.session.commit()
            
            return jsonify({'results': local.serialize()}),201


# ============================================
# NUEVOS ENDPOINTS DE RESERVAS
# ============================================

@api.route('/reservations', methods=['POST'])
@jwt_required()
def create_reservation():
    """Crear una nueva reserva"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        local_id = data.get('local_id')
        date_str = data.get('date')
        time_str = data.get('time', None)
        people = data.get('people', 2)
        notes = data.get('notes', None)
        
        # Validaciones
        if not local_id or not date_str:
            return jsonify({'message': 'local_id and date are required'}), 400
        
        # Validar que el local existe
        local = Locales.query.get(local_id)
        if not local:
            return jsonify({'message': 'Local not found'}), 404
        
        # Validar y parsear fecha
        try:
            reservation_date = dt.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Validar fecha futura
        if reservation_date < dt.now().date():
            return jsonify({'message': 'Date must be in the future'}), 400
        
        # Parsear hora si existe
        reservation_time = None
        if time_str:
            try:
                reservation_time = dt.strptime(time_str, '%H:%M').time()
            except ValueError:
                return jsonify({'message': 'Invalid time format. Use HH:MM'}), 400
        
        # Verificar si ya tiene reserva activa para ese día en ese local
        existing = Reservation.query.filter_by(
            user_id=user.id,
            local_id=local_id,
            date=reservation_date,
            status='confirmed'
        ).first()
        
        if existing:
            return jsonify({'message': 'You already have a reservation for this date at this restaurant'}), 409
        
        # Crear reserva
        new_reservation = Reservation(
            user_id=user.id,
            local_id=local_id,
            date=reservation_date,
            time=reservation_time,
            people=people,
            status='confirmed',
            notes=notes
        )
        
        db.session.add(new_reservation)
        db.session.commit()
        
        return jsonify(new_reservation.serialize()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Server error', 'error': str(e)}), 500


@api.route('/reservations', methods=['GET'])
@jwt_required()
def get_user_reservations():
    """Obtener todas las reservas del usuario"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Obtener reservas ordenadas por fecha (más recientes primero)
        reservations = Reservation.query.filter_by(
            user_id=user.id
        ).order_by(Reservation.date.desc()).all()
        
        return jsonify([r.serialize() for r in reservations]), 200
    
    except Exception as e:
        return jsonify({'message': 'Server error', 'error': str(e)}), 500


@api.route('/reservations/<int:reservation_id>', methods=['DELETE'])
@jwt_required()
def cancel_reservation(reservation_id):
    """Cancelar una reserva"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        reservation = Reservation.query.get(reservation_id)
        
        if not reservation:
            return jsonify({'message': 'Reservation not found'}), 404
        
        # Verificar que la reserva pertenece al usuario
        if reservation.user_id != user.id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        # Cambiar estado a cancelada (no eliminar)
        reservation.status = 'cancelled'
        db.session.commit()
        
        return jsonify({'message': 'Reservation cancelled successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Server error', 'error': str(e)}), 500


@api.route('/reservations/<int:reservation_id>', methods=['PUT'])
@jwt_required()
def update_reservation(reservation_id):
    """Actualizar una reserva"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        reservation = Reservation.query.get(reservation_id)
        
        if not reservation:
            return jsonify({'message': 'Reservation not found'}), 404
        
        # Verificar que la reserva pertenece al usuario
        if reservation.user_id != user.id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        # Actualizar campos si se proporcionan
        if 'date' in data:
            try:
                new_date = dt.strptime(data['date'], '%Y-%m-%d').date()
                if new_date < dt.now().date():
                    return jsonify({'message': 'Date must be in the future'}), 400
                reservation.date = new_date
            except ValueError:
                return jsonify({'message': 'Invalid date format'}), 400
        
        if 'time' in data and data['time']:
            try:
                reservation.time = dt.strptime(data['time'], '%H:%M').time()
            except ValueError:
                return jsonify({'message': 'Invalid time format'}), 400
        
        if 'people' in data:
            reservation.people = data['people']
        
        if 'notes' in data:
            reservation.notes = data['notes']
        
        db.session.commit()
        
        return jsonify(reservation.serialize()), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Server error', 'error': str(e)}), 500








