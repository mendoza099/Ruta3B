import React, { useState, useEffect, useRef } from "react";
import "../../styles/mapa.css";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importar leaflet.heat de forma segura
let HeatLayer;
try {
  require('leaflet.heat');
  HeatLayer = L.heatLayer;
} catch (error) {
  console.error("Error loading leaflet.heat:", error);
}

// Configurar iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export const MapaOfertas = () => {
  const [offers, setOffers] = useState([]);
  const [selectedCity, setSelectedCity] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    fetchOffers();
    return () => {
      // Cleanup al desmontar
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Esperar a que el DOM esté listo antes de inicializar el mapa
    if (offers.length > 0 && !mapInstanceRef.current && mapRef.current) {
      // Usar setTimeout para asegurar que el contenedor está en el DOM
      const timer = setTimeout(() => {
        if (mapRef.current) {
          initializeMap();
        }
      }, 100);
      return () => clearTimeout(timer);
    } else if (mapInstanceRef.current) {
      updateHeatmap();
    }
  }, [offers, selectedCity]);

  const fetchOffers = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + "/api/offers");
      if (response.ok) {
        const data = await response.json();
        console.log("Offers loaded:", data.length);
        setOffers(data);
        setError(null);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      setError("No se pudieron cargar las ofertas. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    try {
      if (!mapRef.current) {
        console.error("Map container not found");
        return;
      }

      // Centro de España
      const map = L.map(mapRef.current).setView([40.4168, -3.7038], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
      console.log("Map initialized successfully");
      updateHeatmap();
    } catch (error) {
      console.error("Error initializing map:", error);
      setError("Error al inicializar el mapa. Por favor, recarga la página.");
    }
  };

  const updateHeatmap = () => {
    if (!mapInstanceRef.current) return;

    try {
      // Remover capa anterior si existe
      if (heatLayerRef.current) {
        mapInstanceRef.current.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }

      // Remover marcadores anteriores
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];

      // Filtrar ofertas por ciudad
      let filteredOffers = offers;
      if (selectedCity !== "todas") {
        filteredOffers = offers.filter(offer => offer.local_city === selectedCity);
      }

      console.log(`Filtered offers: ${filteredOffers.length}`);

      // Preparar datos para el mapa de calor
      const heatData = filteredOffers
        .filter(offer => offer.local_latitude && offer.local_longitude)
        .map(offer => {
          // Intensidad basada en el descuento
          const intensity = offer.discount_percentage / 100;
          return [offer.local_latitude, offer.local_longitude, intensity];
        });

      console.log(`Heat data points: ${heatData.length}`);

      if (heatData.length > 0 && HeatLayer) {
        // Crear capa de calor solo si leaflet.heat está disponible
        const heatLayer = HeatLayer(heatData, {
          radius: 25,
          blur: 35,
          maxZoom: 17,
          max: 1.0,
          gradient: {
            0.0: 'blue',
            0.3: 'cyan',
            0.5: 'lime',
            0.7: 'yellow',
            1.0: 'red'
          }
        });

        // Configurar willReadFrequently para mejor performance
        const canvas = heatLayer._canvas;
        if (canvas) {
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
        }

        heatLayer.addTo(mapInstanceRef.current);
        heatLayerRef.current = heatLayer;
      }

      // Añadir marcadores para cada oferta
      filteredOffers.forEach(offer => {
        if (offer.local_latitude && offer.local_longitude) {
          const marker = L.marker([offer.local_latitude, offer.local_longitude])
            .addTo(mapInstanceRef.current);

          marker.bindPopup(`
            <div class="offer-popup">
              <h4>${offer.local_name || 'Restaurante'}</h4>
              <p class="offer-title">${offer.title || 'Oferta especial'}</p>
              <p class="offer-discount">${offer.discount_percentage}% OFF</p>
              <p class="offer-city">${offer.local_city || ''}</p>
            </div>
          `);

          markersRef.current.push(marker);
        }
      });

      // Ajustar vista al primer resultado
      if (filteredOffers.length > 0 && filteredOffers[0].local_latitude) {
        mapInstanceRef.current.setView(
          [filteredOffers[0].local_latitude, filteredOffers[0].local_longitude],
          selectedCity !== "todas" ? 12 : 6
        );
      }
    } catch (error) {
      console.error("Error updating heatmap:", error);
      setError("Error al actualizar el mapa. Algunos elementos pueden no mostrarse correctamente.");
    }
  };

  const cities = ["todas", ...new Set(offers.map(o => o.local_city))].sort();

  const getOffersByCity = () => {
    const cityStats = {};
    
    offers.forEach(offer => {
      const city = offer.local_city;
      if (!cityStats[city]) {
        cityStats[city] = {
          count: 0,
          avgDiscount: 0,
          totalDiscount: 0
        };
      }
      cityStats[city].count++;
      cityStats[city].totalDiscount += offer.discount_percentage;
    });

    Object.keys(cityStats).forEach(city => {
      cityStats[city].avgDiscount = Math.round(
        cityStats[city].totalDiscount / cityStats[city].count
      );
    });

    return Object.entries(cityStats)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando mapa de ofertas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Recargar página</button>
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="empty-container">
        <h2>No hay ofertas disponibles</h2>
        <p>Vuelve más tarde para ver nuevas ofertas.</p>
      </div>
    );
  }

  const topCities = getOffersByCity();

  return (
    <div className="mapa-container">
      <div className="mapa-header">
        <h1>Mapa de Calor de Ofertas</h1>
        <p>Descubre las zonas con más ofertas y descuentos</p>
      </div>

      <div className="mapa-controls">
        <div className="filter-group">
          <label>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Filtrar por ciudad
          </label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            {cities.map(city => (
              <option key={city} value={city}>
                {city === "todas" ? "Todas las ciudades" : city}
              </option>
            ))}
          </select>
        </div>

        <div className="mapa-legend">
          <h4>Leyenda</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color" style={{background: 'blue'}}></span>
              <span>Bajo (0-30%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{background: 'lime'}}></span>
              <span>Medio (30-50%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{background: 'red'}}></span>
              <span>Alto (50%+)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mapa-content">
        <div className="map-wrapper">
          <div ref={mapRef} className="leaflet-map"></div>
        </div>

        <div className="mapa-stats">
          <h3>Top Ciudades con Ofertas</h3>
          <div className="city-stats-list">
            {topCities.map(([city, stats], index) => (
              <div key={city} className="city-stat-item">
                <div className="city-rank">#{index + 1}</div>
                <div className="city-info">
                  <h4>{city}</h4>
                  <p>{stats.count} ofertas activas</p>
                  <p className="avg-discount">{stats.avgDiscount}% descuento promedio</p>
                </div>
                <button 
                  className="city-view-btn"
                  onClick={() => setSelectedCity(city)}
                >
                  Ver
                </button>
              </div>
            ))}
          </div>

          <div className="total-stats">
            <div className="stat-box">
              <div className="stat-number">{offers.length}</div>
              <div className="stat-label">Ofertas Activas</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{cities.length - 1}</div>
              <div className="stat-label">Ciudades</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
