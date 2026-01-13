"""
Datos de seed para la aplicación Ruta3B.
Este archivo contiene todos los datos necesarios para poblar la base de datos.
"""
from datetime import datetime, timedelta
import random

# Ciudades con coordenadas y códigos postales
CIUDADES = {
    # España
    "Madrid": {"lat": 40.4168, "lng": -3.7038, "cp": "280", "pais": "España"},
    "Barcelona": {"lat": 41.3851, "lng": 2.1734, "cp": "080", "pais": "España"},
    "Valencia": {"lat": 39.4699, "lng": -0.3763, "cp": "460", "pais": "España"},
    "Sevilla": {"lat": 37.3891, "lng": -5.9845, "cp": "410", "pais": "España"},
    "Zaragoza": {"lat": 41.6488, "lng": -0.8891, "cp": "500", "pais": "España"},
    "Málaga": {"lat": 36.7213, "lng": -4.4214, "cp": "290", "pais": "España"},
    "Bilbao": {"lat": 43.2630, "lng": -2.9350, "cp": "480", "pais": "España"},
    "Alicante": {"lat": 38.3452, "lng": -0.4810, "cp": "030", "pais": "España"},
    "Córdoba": {"lat": 37.8882, "lng": -4.7794, "cp": "140", "pais": "España"},
    "Granada": {"lat": 37.1773, "lng": -3.5986, "cp": "180", "pais": "España"},
    "San Sebastián": {"lat": 43.3183, "lng": -1.9812, "cp": "200", "pais": "España"},
    "Salamanca": {"lat": 40.9701, "lng": -5.6635, "cp": "370", "pais": "España"},
    "Toledo": {"lat": 39.8628, "lng": -4.0273, "cp": "450", "pais": "España"},
    "Murcia": {"lat": 37.9922, "lng": -1.1307, "cp": "300", "pais": "España"},
    "Palma de Mallorca": {"lat": 39.5696, "lng": 2.6502, "cp": "070", "pais": "España"},
    "Las Palmas": {"lat": 28.1235, "lng": -15.4363, "cp": "350", "pais": "España"},
    "Valladolid": {"lat": 41.6523, "lng": -4.7245, "cp": "470", "pais": "España"},
    "Vigo": {"lat": 42.2406, "lng": -8.7207, "cp": "362", "pais": "España"},
    "Gijón": {"lat": 43.5453, "lng": -5.6635, "cp": "332", "pais": "España"},
    "Cáceres": {"lat": 39.4753, "lng": -6.3724, "cp": "100", "pais": "España"},
    # Portugal
    "Lisboa": {"lat": 38.7223, "lng": -9.1393, "cp": "100", "pais": "Portugal"},
    "Porto": {"lat": 41.1579, "lng": -8.6291, "cp": "400", "pais": "Portugal"},
    "Faro": {"lat": 37.0194, "lng": -7.9322, "cp": "800", "pais": "Portugal"},
    "Coimbra": {"lat": 40.2033, "lng": -8.4103, "cp": "300", "pais": "Portugal"},
    "Braga": {"lat": 41.5518, "lng": -8.4229, "cp": "470", "pais": "Portugal"},
    "Évora": {"lat": 38.5667, "lng": -7.9, "cp": "700", "pais": "Portugal"},
    "Funchal": {"lat": 32.6669, "lng": -16.9241, "cp": "900", "pais": "Portugal"},
    "Aveiro": {"lat": 40.6443, "lng": -8.6455, "cp": "380", "pais": "Portugal"},
    "Setúbal": {"lat": 38.5244, "lng": -8.8882, "cp": "290", "pais": "Portugal"},
    "Cascais": {"lat": 38.6979, "lng": -9.4215, "cp": "275", "pais": "Portugal"},
    # Francia
    "París": {"lat": 48.8566, "lng": 2.3522, "cp": "750", "pais": "Francia"},
    "Marsella": {"lat": 43.2965, "lng": 5.3698, "cp": "130", "pais": "Francia"},
    "Lyon": {"lat": 45.7640, "lng": 4.8357, "cp": "690", "pais": "Francia"},
    "Toulouse": {"lat": 43.6047, "lng": 1.4442, "cp": "310", "pais": "Francia"},
    "Niza": {"lat": 43.7102, "lng": 7.2620, "cp": "060", "pais": "Francia"},
    "Nantes": {"lat": 47.2184, "lng": -1.5536, "cp": "440", "pais": "Francia"},
    "Estrasburgo": {"lat": 48.5734, "lng": 7.7521, "cp": "670", "pais": "Francia"},
    "Montpellier": {"lat": 43.6108, "lng": 3.8767, "cp": "340", "pais": "Francia"},
    "Burdeos": {"lat": 44.8378, "lng": -0.5792, "cp": "330", "pais": "Francia"},
    "Lille": {"lat": 50.6292, "lng": 3.0573, "cp": "590", "pais": "Francia"},
}

TIPOS_LOCAL = [
    "Restaurante", "Bar", "Cafetería", "Taberna", "Gastrobar", 
    "Asador", "Marisquería", "Pizzería", "Tapas", "Bistró"
]

FOTOS = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800",
    "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
    "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800",
    "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800",
    "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800",
    "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800",
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800",
]

NOMBRES_BASE = [
    "La Abuela", "El Fogón", "Casa María", "Taberna del Puerto", "El Rincón",
    "La Terraza", "Mesón Castilla", "Bodega Real", "El Jardín", "La Plaza",
    "Casa Antonio", "El Olivo", "La Viña", "Gastro Bar", "El Patio",
    "La Cocina", "Sabor Local", "El Mercado", "Casa Pedro", "La Tradición",
    "El Asador", "Mar y Tierra", "La Esquina", "Delicias", "El Sabor",
    "Casa Rosa", "La Parrilla", "El Huerto", "Fusión", "La Brasa",
    "El Txoko", "Casa Carmen", "La Tasca", "Gourmet", "El Bodegón",
    "Casa Luis", "La Cazuela", "El Mirador", "Aromas", "La Despensa"
]

CALLES = [
    "Gran Vía", "Calle Mayor", "Paseo del Prado", "Avenida Principal",
    "Calle Real", "Plaza Mayor", "Calle del Carmen", "Paseo de Gracia",
    "Ramblas", "Calle Sierpes", "Calle Larios", "Avenida Diagonal",
    "Calle Alcalá", "Paseo Marítimo", "Calle Serrano", "Calle Nueva",
    "Avenida del Puerto", "Calle Ancha", "Plaza del Sol", "Calle Colón"
]

DESCRIPCIONES = [
    "Cocina tradicional con productos frescos del mercado local.",
    "Especialistas en platos de la región con recetas de la abuela.",
    "Fusión de sabores mediterráneos en un ambiente acogedor.",
    "Los mejores productos del mar preparados al momento.",
    "Carnes a la brasa con el auténtico sabor de siempre.",
    "Tapas creativas y vinos selectos en pleno centro.",
    "Cocina de autor con toques innovadores y presentación única.",
    "Ambiente familiar donde disfrutar de la mejor gastronomía.",
    "Sabores auténticos de la cocina regional más tradicional.",
    "Experiencia gastronómica única con vistas espectaculares."
]
