"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Locales, Direccion, Reservation, Review, GastronomicEvent, Offer, UserList, ListItem
from api.utils import generate_sitemap, APIException
import json
import datetime
from datetime import datetime as dt

# # flask jwt paquete de instalacion
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

# Geopy para geocodificación
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError


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
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'message': 'Email y contraseña son requeridos'}), 400
        
        # Primero intentar buscar en la tabla de restaurantes
        restaurante = Locales.query.filter_by(email=email).one_or_none()
        if restaurante:
            if not restaurante.check_password(password):
                return jsonify({"message": "Email o contraseña incorrectos"}), 401
            # Es un restaurante
            expired = datetime.timedelta(minutes=240)
            access_token = create_access_token(identity=email, expires_delta=expired)
            return jsonify({
                "access_token": access_token, 
                "type": True,
                "user_type": "restaurant",
                "name": restaurante.nombre
            }), 200
        
        # Si no es restaurante, buscar en la tabla de usuarios
        usuario = User.query.filter_by(email=email).one_or_none()
        if usuario:
            if not usuario.check_password(password):
                return jsonify({"message": "Email o contraseña incorrectos"}), 401
            # Es un usuario normal
            expired = datetime.timedelta(minutes=240)
            access_token = create_access_token(identity=email, expires_delta=expired)
            return jsonify({
                "access_token": access_token, 
                "type": False,
                "user_type": "user",
                "name": usuario.nombre
            }), 200
        
        # Si no se encuentra en ninguna tabla
        return jsonify({'message': 'Email o contraseña incorrectos'}), 401
    
    except Exception as e:
        print(f"Error en login: {str(e)}")
        return jsonify({'message': 'Error del servidor. Por favor, intenta de nuevo.'}), 500

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
        
        # Geocodificar la dirección si se proporciona
        latitud = None
        longitud = None
        if data.get('direccion') and data.get('ciudad'):
            try:
                geolocator = Nominatim(user_agent="ruta3b_app")
                direccion_completa = f"{data['direccion']}, {data['ciudad']}, {data.get('codigo_postal', '')}, España"
                location = geolocator.geocode(direccion_completa, timeout=10)
                if location:
                    latitud = location.latitude
                    longitud = location.longitude
                    print(f"Geocodificación exitosa: {latitud}, {longitud}")
                else:
                    print("No se pudo geocodificar la dirección")
            except (GeocoderTimedOut, GeocoderServiceError) as e:
                print(f"Error en geocodificación: {str(e)}")
        
        new_user_local = Locales(
            nombre=data["nombre"],
            email=data["email"],
            tipo_local=data["tipo_local"],
            descripcion=data["descripcion"],
            direccion=data.get("direccion"),
            ciudad=data.get("ciudad"),
            codigo_postal=data.get("codigo_postal"),
            latitud=latitud,
            longitud=longitud
        )
        new_user_local.set_password(data["password"])
        
        db.session.add(new_user_local)
        db.session.commit()
        
        access_token = create_access_token(identity=data["email"])
        return jsonify(access_token=access_token), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Error en registro: {str(e)}")
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

@api.route('/reservations', methods=['GET'])
@jwt_required()
def get_user_reservations():
    """Obtener todas las reservas del usuario actual"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Obtener todas las reservas del usuario
        reservations = Reservation.query.filter_by(user_id=user.id).order_by(Reservation.date.desc()).all()
        
        return jsonify([r.serialize() for r in reservations]), 200
        
    except Exception as e:
        return jsonify({'message': 'Error fetching reservations', 'error': str(e)}), 500

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

@api.route('/reservations/<int:reservation_id>', methods=['DELETE'])
@jwt_required()
def cancel_reservation(reservation_id):
    """Cancelar una reserva"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Buscar la reserva
        reservation = Reservation.query.get(reservation_id)
        
        if not reservation:
            return jsonify({'message': 'Reservation not found'}), 404
        
        # Verificar que la reserva pertenece al usuario
        if reservation.user_id != user.id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        # Eliminar la reserva
        db.session.delete(reservation)
        db.session.commit()
        
        return jsonify({'message': 'Reservation cancelled successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Server error', 'error': str(e)}), 500


# ============================================
# ENDPOINTS DE COMENTARIOS/RESEÑAS
# ============================================

@api.route('/reviews/<int:local_id>', methods=['GET'])
def get_restaurant_reviews(local_id):
    """Obtener todas las reseñas de un restaurante"""
    try:
        reviews = Review.query.filter_by(local_id=local_id).order_by(Review.created_at.desc()).all()
        return jsonify([review.serialize() for review in reviews]), 200
    except Exception as e:
        print(f"Error al obtener reseñas: {str(e)}")
        return jsonify({'message': 'Error al obtener reseñas'}), 500


@api.route('/reviews', methods=['POST'])
@jwt_required()
def create_review():
    """Crear una nueva reseña"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        local_id = data.get('local_id')
        rating = data.get('rating')
        comment = data.get('comment', '').strip()
        
        # Validaciones
        if not local_id or not rating:
            return jsonify({'message': 'Faltan datos requeridos'}), 400
        
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({'message': 'La calificación debe ser entre 1 y 5'}), 400
        
        if not comment:
            return jsonify({'message': 'El comentario no puede estar vacío'}), 400
        
        if len(comment) < 10:
            return jsonify({'message': 'El comentario debe tener al menos 10 caracteres'}), 400
        
        # Verificar que el restaurante existe
        local = Locales.query.get(local_id)
        if not local:
            return jsonify({'message': 'Restaurante no encontrado'}), 404
        
        # Verificar si el usuario ya dejó una reseña en este restaurante
        existing_review = Review.query.filter_by(user_id=user.id, local_id=local_id).first()
        if existing_review:
            return jsonify({'message': 'Ya has dejado una reseña en este restaurante'}), 400
        
        # Crear la reseña
        new_review = Review(
            user_id=user.id,
            local_id=local_id,
            rating=rating,
            comment=comment
        )
        
        db.session.add(new_review)
        db.session.commit()
        
        return jsonify({
            'message': 'Reseña creada exitosamente',
            'review': new_review.serialize()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error al crear reseña: {str(e)}")
        return jsonify({'message': 'Error al crear la reseña'}), 500


@api.route('/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    """Eliminar una reseña (solo el autor puede eliminarla)"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        review = Review.query.get(review_id)
        if not review:
            return jsonify({'message': 'Reseña no encontrada'}), 404
        
        # Verificar que el usuario es el autor de la reseña
        if review.user_id != user.id:
            return jsonify({'message': 'No tienes permiso para eliminar esta reseña'}), 403
        
        db.session.delete(review)
        db.session.commit()
        
        return jsonify({'message': 'Reseña eliminada exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar reseña: {str(e)}")
        return jsonify({'message': 'Error al eliminar la reseña'}), 500


@api.route('/reviews/stats/<int:local_id>', methods=['GET'])
def get_review_stats(local_id):
    """Obtener estadísticas de reseñas de un restaurante"""
    try:
        reviews = Review.query.filter_by(local_id=local_id).all()
        
        if not reviews:
            return jsonify({
                'total': 0,
                'average': 0,
                'ratings': {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            }), 200
        
        total = len(reviews)
        average = sum(r.rating for r in reviews) / total
        ratings = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        
        for review in reviews:
            ratings[review.rating] += 1
        
        return jsonify({
            'total': total,
            'average': round(average, 1),
            'ratings': ratings
        }), 200
        
    except Exception as e:
        print(f"Error al obtener estadísticas: {str(e)}")
        return jsonify({'message': 'Error al obtener estadísticas'}), 500


# ============================================
# ENDPOINTS DE EVENTOS GASTRONÓMICOS
# ============================================

@api.route('/gastronomic-events', methods=['GET'])
def get_gastronomic_events():
    """Obtener todos los eventos gastronómicos activos"""
    try:
        events = GastronomicEvent.query.filter_by(is_active=True).filter(
            GastronomicEvent.end_date >= dt.now()
        ).order_by(GastronomicEvent.start_date).all()
        
        return jsonify([event.serialize() for event in events]), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching events', 'error': str(e)}), 500

@api.route('/gastronomic-events/<int:event_id>', methods=['GET'])
def get_gastronomic_event(event_id):
    """Obtener un evento específico"""
    try:
        event = GastronomicEvent.query.get(event_id)
        if not event:
            return jsonify({'message': 'Event not found'}), 404
        
        return jsonify(event.serialize()), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching event', 'error': str(e)}), 500

@api.route('/gastronomic-events', methods=['POST'])
@jwt_required()
def create_gastronomic_event():
    """Crear un nuevo evento gastronómico (solo restaurantes)"""
    try:
        email = get_jwt_identity()
        local = Locales.query.filter_by(email=email).first()
        
        if not local:
            return jsonify({'message': 'Only restaurants can create events'}), 403
        
        data = request.get_json()
        
        new_event = GastronomicEvent(
            title=data['title'],
            description=data['description'],
            event_type=data['event_type'],
            price=data['price'],
            image_url=data.get('image_url'),
            start_date=dt.fromisoformat(data['start_date']),
            end_date=dt.fromisoformat(data['end_date']),
            max_participants=data.get('max_participants', 20),
            local_id=local.id,
            city=local.ciudad,
            address=data.get('address', local.direccion)
        )
        
        db.session.add(new_event)
        db.session.commit()
        
        return jsonify(new_event.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating event', 'error': str(e)}), 500


# ============================================
# ENDPOINTS DE OFERTAS
# ============================================

@api.route('/offers', methods=['GET'])
def get_offers():
    """Obtener todas las ofertas activas"""
    try:
        offers = Offer.query.filter_by(is_active=True).filter(
            Offer.end_date >= dt.now()
        ).order_by(Offer.end_date).all()
        
        return jsonify([offer.serialize() for offer in offers]), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching offers', 'error': str(e)}), 500

@api.route('/offers/<int:local_id>', methods=['GET'])
def get_local_offers(local_id):
    """Obtener ofertas de un restaurante específico"""
    try:
        offers = Offer.query.filter_by(local_id=local_id, is_active=True).filter(
            Offer.end_date >= dt.now()
        ).all()
        
        return jsonify([offer.serialize() for offer in offers]), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching offers', 'error': str(e)}), 500

@api.route('/offers', methods=['POST'])
@jwt_required()
def create_offer():
    """Crear una nueva oferta (solo restaurantes)"""
    try:
        email = get_jwt_identity()
        local = Locales.query.filter_by(email=email).first()
        
        if not local:
            return jsonify({'message': 'Only restaurants can create offers'}), 403
        
        data = request.get_json()
        
        new_offer = Offer(
            local_id=local.id,
            title=data['title'],
            description=data['description'],
            discount_percentage=data['discount_percentage'],
            original_price=data.get('original_price'),
            discounted_price=data.get('discounted_price'),
            start_date=dt.fromisoformat(data['start_date']),
            end_date=dt.fromisoformat(data['end_date']),
            terms_conditions=data.get('terms_conditions'),
            max_uses=data.get('max_uses', 100)
        )
        
        db.session.add(new_offer)
        db.session.commit()
        
        return jsonify(new_offer.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating offer', 'error': str(e)}), 500


# ============================================
# ENDPOINTS DE LISTAS PERSONALIZADAS
# ============================================

@api.route('/user-lists', methods=['GET'])
@jwt_required()
def get_user_lists():
    """Obtener todas las listas del usuario"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        lists = UserList.query.filter_by(user_id=user.id).all()
        
        return jsonify([lst.serialize() for lst in lists]), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching lists', 'error': str(e)}), 500

@api.route('/user-lists/<int:list_id>', methods=['GET'])
@jwt_required()
def get_user_list(list_id):
    """Obtener una lista específica con sus items"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        user_list = UserList.query.get(list_id)
        
        if not user_list or user_list.user_id != user.id:
            return jsonify({'message': 'List not found'}), 404
        
        list_data = user_list.serialize()
        list_data['items'] = [item.serialize() for item in user_list.items]
        
        return jsonify(list_data), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching list', 'error': str(e)}), 500

@api.route('/user-lists', methods=['POST'])
@jwt_required()
def create_user_list():
    """Crear una nueva lista"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        
        new_list = UserList(
            user_id=user.id,
            name=data['name'],
            description=data.get('description'),
            is_public=data.get('is_public', False)
        )
        
        db.session.add(new_list)
        db.session.commit()
        
        return jsonify(new_list.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating list', 'error': str(e)}), 500

@api.route('/user-lists/<int:list_id>/items', methods=['POST'])
@jwt_required()
def add_item_to_list(list_id):
    """Añadir un restaurante a una lista"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        user_list = UserList.query.get(list_id)
        
        if not user_list or user_list.user_id != user.id:
            return jsonify({'message': 'List not found'}), 404
        
        data = request.get_json()
        
        # Obtener la última posición
        last_item = ListItem.query.filter_by(list_id=list_id).order_by(ListItem.position.desc()).first()
        next_position = (last_item.position + 1) if last_item else 0
        
        new_item = ListItem(
            list_id=list_id,
            local_id=data['local_id'],
            position=next_position,
            notes=data.get('notes')
        )
        
        db.session.add(new_item)
        db.session.commit()
        
        return jsonify(new_item.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error adding item', 'error': str(e)}), 500

@api.route('/user-lists/<int:list_id>/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_item_from_list(list_id, item_id):
    """Eliminar un restaurante de una lista"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        user_list = UserList.query.get(list_id)
        
        if not user_list or user_list.user_id != user.id:
            return jsonify({'message': 'List not found'}), 404
        
        item = ListItem.query.get(item_id)
        
        if not item or item.list_id != list_id:
            return jsonify({'message': 'Item not found'}), 404
        
        db.session.delete(item)
        db.session.commit()
        
        return jsonify({'message': 'Item removed successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error removing item', 'error': str(e)}), 500

@api.route('/user-lists/<int:list_id>/reorder', methods=['PUT'])
@jwt_required()
def reorder_list_items(list_id):
    """Reordenar items de una lista"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        user_list = UserList.query.get(list_id)
        
        if not user_list or user_list.user_id != user.id:
            return jsonify({'message': 'List not found'}), 404
        
        data = request.get_json()
        items_order = data['items']  # Array de {id, position}
        
        for item_data in items_order:
            item = ListItem.query.get(item_data['id'])
            if item and item.list_id == list_id:
                item.position = item_data['position']
        
        db.session.commit()
        
        return jsonify({'message': 'List reordered successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error reordering list', 'error': str(e)}), 500
