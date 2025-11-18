import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/experiencia.css";
import Swal from "sweetalert2";

export const ExperienciaGastronomica = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedType, setSelectedType] = useState("todos");
  const [selectedCity, setSelectedCity] = useState("todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [selectedType, selectedCity, events]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + "/api/gastronomic-events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (selectedType !== "todos") {
      filtered = filtered.filter(event => event.event_type === selectedType);
    }

    if (selectedCity !== "todas") {
      filtered = filtered.filter(event => event.city === selectedCity);
    }

    setFilteredEvents(filtered);
  };

  const getEventTypeLabel = (type) => {
    const types = {
      cata: "Cata de Vinos",
      pack: "Pack Gastronómico",
      taller: "Taller de Cocina",
      degustacion: "Degustación"
    };
    return types[type] || type;
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      cata: "🍷",
      pack: "🎁",
      taller: "👨‍🍳",
      degustacion: "🍽️"
    };
    return icons[type] || "🎉";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleReserveEvent = (event) => {
    if (event.available_spots === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Evento completo',
        text: 'Lo sentimos, no quedan plazas disponibles',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    Swal.fire({
      title: `Reservar: ${event.title}`,
      html: `
        <p><strong>Precio:</strong> ${event.price}€</p>
        <p><strong>Fecha:</strong> ${formatDate(event.start_date)}</p>
        <p><strong>Plazas disponibles:</strong> ${event.available_spots}</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#f5576c',
      confirmButtonText: 'Reservar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: '¡Reserva confirmada!',
          text: 'Recibirás un email con los detalles',
          confirmButtonColor: '#667eea'
        });
      }
    });
  };

  const cities = ["todas", ...new Set(events.map(e => e.city))].sort();
  const eventTypes = ["todos", "cata", "pack", "taller", "degustacion"];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando experiencias...</p>
      </div>
    );
  }

  return (
    <div className="experiencia-container">
      <div className="experiencia-hero">
        <h1 className="experiencia-title">Experiencia Gastronómica</h1>
        <p className="experiencia-subtitle">
          Descubre eventos únicos, catas exclusivas y packs especiales con tiempo limitado
        </p>
      </div>

      <div className="experiencia-filters">
        <div className="filter-group">
          <label>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            Tipo de Evento
          </label>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {eventTypes.map(type => (
              <option key={type} value={type}>
                {type === "todos" ? "Todos los tipos" : getEventTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Ciudad
          </label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            {cities.map(city => (
              <option key={city} value={city}>
                {city === "todas" ? "Todas las ciudades" : city}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-results">
          {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} disponible{filteredEvents.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const daysRemaining = getDaysRemaining(event.end_date);
            const isUrgent = daysRemaining <= 3;
            const isFull = event.available_spots === 0;

            return (
              <div key={event.id} className={`event-card ${isFull ? 'full' : ''}`}>
                {isUrgent && !isFull && (
                  <div className="event-badge urgent">
                    ⏰ ¡Últimos {daysRemaining} días!
                  </div>
                )}
                {isFull && (
                  <div className="event-badge full-badge">
                    ❌ Completo
                  </div>
                )}

                <div className="event-image">
                  <img 
                    src={event.image_url || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"} 
                    alt={event.title}
                  />
                  <div className="event-type-badge">
                    {getEventTypeIcon(event.event_type)} {getEventTypeLabel(event.event_type)}
                  </div>
                </div>

                <div className="event-content">
                  <h3>{event.title}</h3>
                  <p className="event-description">{event.description}</p>

                  <div className="event-details">
                    <div className="event-detail">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {formatDate(event.start_date)}
                    </div>

                    <div className="event-detail">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {event.city}
                    </div>

                    <div className="event-detail">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      {event.available_spots} plazas disponibles
                    </div>
                  </div>

                  <div className="event-footer">
                    <div className="event-price">{event.price}€</div>
                    <button 
                      className="event-reserve-btn"
                      onClick={() => handleReserveEvent(event)}
                      disabled={isFull}
                    >
                      {isFull ? 'Completo' : 'Reservar'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-events">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <h3>No hay eventos disponibles</h3>
            <p>Intenta cambiar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};
