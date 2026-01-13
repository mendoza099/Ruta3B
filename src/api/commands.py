
import click
import random
from datetime import datetime, timedelta
from api.models import db, User, Locales, GastronomicEvent, Offer
from api.seed_data import CIUDADES, TIPOS_LOCAL, FOTOS, NOMBRES_BASE, CALLES, DESCRIPCIONES

"""
Comandos de Flask para gestionar la base de datos.
"""

def setup_commands(app):
    
    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_data(count):
        """Crear usuarios de prueba"""
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")
        print("All test users created")

    @app.cli.command("seed-db")
    @click.option("--restaurants", default=2000, help="Número de restaurantes a crear")
    def seed_database(restaurants):
        """Poblar la base de datos con datos de prueba completos"""
        print(f"🚀 Iniciando seed de base de datos...")
        
        # Limpiar tablas existentes
        print("🗑️  Limpiando datos existentes...")
        Offer.query.delete()
        GastronomicEvent.query.delete()
        Locales.query.delete()
        db.session.commit()
        
        nombres_usados = set()
        emails_usados = set()
        locales_creados = []
        
        # Distribuir restaurantes por ciudad
        ciudades_lista = list(CIUDADES.keys())
        base_por_ciudad = restaurants // len(ciudades_lista)
        
        print(f"📍 Creando {restaurants} restaurantes en {len(ciudades_lista)} ciudades...")
        
        contador = 0
        for ciudad, data in CIUDADES.items():
            # Ciudades grandes tienen más restaurantes
            cantidad = base_por_ciudad
            if ciudad in ["Madrid", "Barcelona", "París", "Lisboa"]:
                cantidad = int(base_por_ciudad * 2)
            elif ciudad in ["Valencia", "Sevilla", "Lyon", "Porto"]:
                cantidad = int(base_por_ciudad * 1.5)
            
            for i in range(cantidad):
                # Generar nombre único
                base_nombre = random.choice(NOMBRES_BASE)
                sufijo = ""
                nombre = f"{base_nombre} {ciudad[:3]}"
                intentos = 0
                while nombre in nombres_usados and intentos < 100:
                    sufijo = str(random.randint(1, 999))
                    nombre = f"{base_nombre} {sufijo}"
                    intentos += 1
                nombres_usados.add(nombre)
                
                # Email único
                email_base = nombre.lower().replace(" ", "").replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u").replace("ñ","n")
                email_base = ''.join(c for c in email_base if c.isalnum())[:15]
                email = f"{email_base}@ruta3b.com"
                num = 1
                while email in emails_usados:
                    email = f"{email_base}{num}@ruta3b.com"
                    num += 1
                emails_usados.add(email)
                
                # Coordenadas aleatorias cerca del centro
                lat = data["lat"] + random.uniform(-0.04, 0.04)
                lng = data["lng"] + random.uniform(-0.04, 0.04)
                
                local = Locales(
                    nombre=nombre,
                    email=email,
                    tipo_local=random.choice(TIPOS_LOCAL),
                    descripcion=random.choice(DESCRIPCIONES),
                    precio=random.choice([1, 1, 1, 2, 2, 2, 2, 3, 3]),  # 1=económico, 2=moderado, 3=premium
                    foto=random.choice(FOTOS),
                    direccion=f"{random.choice(CALLES)}, {random.randint(1, 150)}",
                    ciudad=ciudad,
                    codigo_postal=f"{data['cp']}{random.randint(10, 99)}",
                    latitud=round(lat, 6),
                    longitud=round(lng, 6)
                )
                local.set_password("ruta3b2024")
                db.session.add(local)
                locales_creados.append(local)
                contador += 1
                
                if contador % 200 == 0:
                    db.session.commit()
                    print(f"   ✓ {contador} restaurantes creados...")
        
        db.session.commit()
        print(f"✅ {contador} restaurantes creados")
        
        # Crear eventos gastronómicos
        print("🎉 Creando eventos gastronómicos...")
        eventos_tipos = ["cata", "pack", "taller", "degustacion"]
        eventos_titulos = {
            "cata": ["Cata de Vinos Reserva", "Cata de Vinos Ecológicos", "Cata Maridaje", "Cata de Vinos Premium", "Cata Nocturna"],
            "pack": ["Pack Gourmet Navideño", "Pack Degustación Ibérica", "Pack Mariscos", "Pack Quesos Artesanos", "Pack Tapas Premium"],
            "taller": ["Taller de Paella", "Taller de Sushi", "Taller de Pasta Fresca", "Taller de Repostería", "Taller de Cocina Vasca"],
            "degustacion": ["Menú Degustación 7 Pasos", "Degustación Mediterránea", "Degustación de Temporada", "Degustación Chef", "Degustación Fusión"]
        }
        eventos_descripciones = {
            "cata": "Descubre los mejores vinos de la región con nuestro sommelier experto.",
            "pack": "Llévate a casa una selección exclusiva de productos gourmet.",
            "taller": "Aprende los secretos de la cocina profesional con nuestros chefs.",
            "degustacion": "Una experiencia gastronómica única con los mejores productos."
        }
        eventos_fotos = [
            "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
            "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
            "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800",
        ]
        
        ciudades_eventos = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Lisboa", "Porto", "París", "Lyon"]
        eventos_creados = 0
        
        for ciudad in ciudades_eventos:
            if ciudad not in CIUDADES:
                continue
            data = CIUDADES[ciudad]
            for tipo in eventos_tipos:
                for titulo in eventos_titulos[tipo][:2]:  # 2 eventos por tipo por ciudad
                    start = datetime.now() + timedelta(days=random.randint(5, 60))
                    evento = GastronomicEvent(
                        title=f"{titulo} - {ciudad}",
                        description=eventos_descripciones[tipo],
                        event_type=tipo,
                        price=random.choice([35, 45, 55, 65, 75, 85, 95, 120]),
                        image_url=random.choice(eventos_fotos),
                        start_date=start,
                        end_date=start + timedelta(hours=3),
                        max_participants=random.randint(10, 30),
                        current_participants=random.randint(0, 8),
                        city=ciudad,
                        address=f"{random.choice(CALLES)}, {random.randint(1, 100)}",
                        is_active=True
                    )
                    db.session.add(evento)
                    eventos_creados += 1
        
        db.session.commit()
        print(f"✅ {eventos_creados} eventos gastronómicos creados")
        
        # Crear ofertas
        print("🏷️  Creando ofertas...")
        ofertas_titulos = [
            "Menú del Día Especial", "Happy Hour 2x1", "Descuento Fin de Semana",
            "Menú Degustación", "Oferta Familiar", "Descuento Estudiantes",
            "Promoción Aniversario", "Menú Ejecutivo", "Oferta Grupo"
        ]
        ofertas_creadas = 0
        
        # Seleccionar restaurantes aleatorios para ofertas
        locales_con_ofertas = random.sample(locales_creados, min(500, len(locales_creados)))
        
        for local in locales_con_ofertas:
            descuento = random.choice([15, 20, 25, 30, 35, 40, 50])
            precio_original = random.choice([25, 30, 35, 40, 45, 50, 60, 70])
            precio_descuento = round(precio_original * (1 - descuento/100), 2)
            
            oferta = Offer(
                local_id=local.id,
                title=random.choice(ofertas_titulos),
                description=f"Disfruta de un {descuento}% de descuento en nuestra carta.",
                discount_percentage=descuento,
                original_price=precio_original,
                discounted_price=precio_descuento,
                start_date=datetime.now(),
                end_date=datetime.now() + timedelta(days=random.randint(15, 90)),
                terms_conditions="Válido de lunes a jueves. No acumulable con otras ofertas.",
                max_uses=random.randint(50, 200),
                current_uses=random.randint(0, 30),
                is_active=True
            )
            db.session.add(oferta)
            ofertas_creadas += 1
            
            if ofertas_creadas % 100 == 0:
                db.session.commit()
        
        db.session.commit()
        print(f"✅ {ofertas_creadas} ofertas creadas")
        
        # Resumen final
        print("\n" + "="*50)
        print("📊 RESUMEN DE DATOS CREADOS:")
        print("="*50)
        print(f"   🍽️  Restaurantes: {Locales.query.count()}")
        print(f"   🎉 Eventos: {GastronomicEvent.query.count()}")
        print(f"   🏷️  Ofertas: {Offer.query.count()}")
        print("="*50)
        print("\n✅ ¡Base de datos poblada exitosamente!")
        
        # Estadísticas por ciudad
        print("\n📍 Restaurantes por ciudad (top 10):")
        from sqlalchemy import func
        stats = db.session.query(Locales.ciudad, func.count(Locales.id)).group_by(Locales.ciudad).order_by(func.count(Locales.id).desc()).limit(10).all()
        for ciudad, count in stats:
            print(f"   {ciudad}: {count}")