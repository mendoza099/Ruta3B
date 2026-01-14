import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/userProfile.css";

export const Usuario = () => {
  const { store, actions } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        actions.getFavorit(),
        actions.getInformationCurrentMember(),
        actions.getReservations(),
        actions.getEventReservations()
      ]);
      setLoading(false);
    };
    
    if (store.auth && localStorage.getItem("esUsuario") === "true") {
      loadData();
    } else {
      setLoading(false);
    }
  }, [store.auth]);

  const confirmedReservations = (store.reservations || []).filter(r => r.status !== 'cancelled');
  const confirmedExperiences = (store.eventReservations || []).filter(r => r.status !== 'cancelled');
  const favorites = store.likes || [];

  const verReservas = () => {
    if (confirmedReservations.length === 0) {
      Swal.fire({
        title: "Sin reservas",
        text: "No tienes reservas activas en este momento",
        icon: "info",
        confirmButtonColor: "#667eea",
      });
      return;
    }
    
    const reservasHTML = confirmedReservations.map((reserva) => {
      const fecha = new Date(reserva.date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return `
        <div style="border: 2px solid #667eea; padding: 15px; margin: 15px 0; border-radius: 12px; background: linear-gradient(135deg, #f8fafc, #edf2f7);">
          <div style="display: flex; gap: 15px; align-items: center;">
            <img src="${reserva.local_foto}" style="width: 80px; height: 80px; border-radius: 10px; object-fit: cover;" />
            <div style="flex: 1; text-align: left;">
              <h4 style="color: #2d3748; margin: 0 0 5px 0; font-size: 1.1rem;">${reserva.local_name}</h4>
              <p style="margin: 3px 0; color: #718096; font-size: 0.9rem;">📅 ${fecha}</p>
              ${reserva.time ? `<p style="margin: 3px 0; color: #718096; font-size: 0.9rem;">🕐 ${reserva.time}</p>` : ''}
              <p style="margin: 3px 0; color: #718096; font-size: 0.9rem;">👥 ${reserva.people} personas</p>
            </div>
          </div>
          <button 
            onclick="window.cancelReservation(${reserva.id})" 
            style="width: 100%; margin-top: 10px; background: linear-gradient(135deg, #fc8181, #f56565); color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: 600;"
          >
            Cancelar Reserva
          </button>
        </div>
      `;
    }).join('');
    
    Swal.fire({
      title: `<span style="color: #667eea;">📅 Mis Reservas</span>`,
      html: `<div style="max-height: 400px; overflow-y: auto;">${reservasHTML}</div>`,
      width: 500,
      confirmButtonColor: "#667eea",
      confirmButtonText: "Cerrar"
    });
  };

  window.cancelReservation = async (reservationId) => {
    const result = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#a0aec0',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    });
    
    if (result.isConfirmed) {
      const success = await actions.cancelReservation(reservationId);
      if (success) {
        Swal.close();
        verReservas();
      }
    }
  };

  const verExperiencias = () => {
    if (confirmedExperiences.length === 0) {
      Swal.fire({
        title: "Sin experiencias",
        text: "No tienes experiencias reservadas",
        icon: "info",
        confirmButtonColor: "#667eea",
      });
      return;
    }
    
    const tipoEvento = {
      'cata': '🍷 Cata',
      'pack': '🎁 Pack',
      'taller': '👨‍🍳 Taller',
      'degustacion': '🍽️ Degustación'
    };
    
    const experienciasHTML = confirmedExperiences.map((reserva) => {
      const fecha = new Date(reserva.event_start_date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return `
        <div style="border: 2px solid #38a169; padding: 15px; margin: 15px 0; border-radius: 12px; background: linear-gradient(135deg, #f0fff4, #c6f6d5);">
          <div style="display: flex; gap: 15px; align-items: center;">
            ${reserva.event_image ? `<img src="${reserva.event_image}" style="width: 80px; height: 80px; border-radius: 10px; object-fit: cover;" />` : ''}
            <div style="flex: 1; text-align: left;">
              <h4 style="color: #2d3748; margin: 0 0 5px 0; font-size: 1.1rem;">${reserva.event_title}</h4>
              <p style="margin: 3px 0; color: #38a169; font-size: 0.85rem; font-weight: 600;">${tipoEvento[reserva.event_type] || reserva.event_type}</p>
              <p style="margin: 3px 0; color: #718096; font-size: 0.9rem;">📅 ${fecha}</p>
              <p style="margin: 3px 0; color: #718096; font-size: 0.9rem;">👥 ${reserva.participants} participantes</p>
              <p style="margin: 3px 0; color: #718096; font-size: 0.9rem;">💰 ${reserva.event_price}€</p>
            </div>
          </div>
          <button 
            onclick="window.cancelEventReservation(${reserva.id})"
            style="width: 100%; margin-top: 10px; background: linear-gradient(135deg, #fc8181, #f56565); color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: 600;"
          >
            Cancelar Experiencia
          </button>
        </div>
      `;
    }).join('');
    
    Swal.fire({
      title: `<span style="color: #38a169;">🎉 Mis Experiencias</span>`,
      html: `<div style="max-height: 400px; overflow-y: auto;">${experienciasHTML}</div>`,
      width: 500,
      confirmButtonColor: "#38a169",
      confirmButtonText: "Cerrar"
    });
  };

  window.cancelEventReservation = async (reservationId) => {
    const result = await Swal.fire({
      title: '¿Cancelar experiencia?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#38a169',
      cancelButtonColor: '#a0aec0',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    });
    
    if (result.isConfirmed) {
      const success = await actions.cancelEventReservation(reservationId);
      if (success) {
        Swal.close();
        verExperiencias();
      }
    }
  };

  const removeFavorite = async (localId) => {
    const result = await Swal.fire({
      title: '¿Eliminar de favoritos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#a0aec0',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No'
    });
    
    if (result.isConfirmed) {
      await actions.deleteFavorit(localId);
      actions.getFavorit();
    }
  };

  // Not logged in
  if (!store.auth || localStorage.getItem("esUsuario") !== "true") {
    return (
      <div className="user-dashboard">
        <div className="user-not-logged">
          <span style={{ fontSize: '5rem' }}>👤</span>
          <h2>Accede a tu perfil</h2>
          <p>Inicia sesión para ver tus reservas, favoritos y más</p>
          <Link to="/login" className="user-login-btn">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="user-not-logged">
          <div className="loading-spinner" style={{ width: '50px', height: '50px', border: '4px solid #e2e8f0', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p className="mt-3">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    const nombre = store.profiles?.nombre || '';
    const apellido = store.profiles?.apellido || '';
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="user-header">
        <div className="user-welcome">
          <h1>¡Hola, {store.profiles?.nombre}!</h1>
          <p>Bienvenido a tu espacio personal en Ruta 3B</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="user-profile-card">
        <div className="user-profile-header">
          <div className="user-avatar-container">
            <div className="user-avatar">
              {store.profiles?.foto_user ? (
                <img src={store.profiles.foto_user} alt="Avatar" />
              ) : (
                getInitials()
              )}
            </div>
          </div>
        </div>
        <div className="user-profile-body">
          <h2 className="user-profile-name">
            {store.profiles?.nombre} {store.profiles?.apellido}
          </h2>
          <p className="user-profile-email">{store.profiles?.email}</p>
          <span className="user-profile-badge">Miembro Ruta 3B</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="user-stats-grid">
        <div className="user-stat-card reservations" onClick={verReservas}>
          <div className="user-stat-icon">📅</div>
          <div className="user-stat-value">{confirmedReservations.length}</div>
          <div className="user-stat-label">Reservas Activas</div>
        </div>
        
        <div className="user-stat-card experiences" onClick={verExperiencias}>
          <div className="user-stat-icon">🎉</div>
          <div className="user-stat-value">{confirmedExperiences.length}</div>
          <div className="user-stat-label">Experiencias</div>
        </div>
        
        <div className="user-stat-card favorites">
          <div className="user-stat-icon">❤️</div>
          <div className="user-stat-value">{favorites.length}</div>
          <div className="user-stat-label">Favoritos</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="user-actions-grid">
        <Link to="/restaurantes" className="user-action-btn primary">
          <div className="action-icon">🍽️</div>
          <div className="action-text">
            <div className="action-title">Explorar Restaurantes</div>
            <div className="action-subtitle">Descubre nuevos lugares</div>
          </div>
        </Link>
        
        <Link to="/experiencia-gastronomica" className="user-action-btn success">
          <div className="action-icon">🎉</div>
          <div className="action-text">
            <div className="action-title">Experiencias</div>
            <div className="action-subtitle">Catas, talleres y más</div>
          </div>
        </Link>
        
        <Link to="/mapa-ofertas" className="user-action-btn warning">
          <div className="action-icon">🗺️</div>
          <div className="action-text">
            <div className="action-title">Mapa de Ofertas</div>
            <div className="action-subtitle">Encuentra descuentos cerca</div>
          </div>
        </Link>
        
        <Link to="/mis-listas" className="user-action-btn danger">
          <div className="action-icon">📋</div>
          <div className="action-text">
            <div className="action-title">Mis Listas</div>
            <div className="action-subtitle">Organiza tus favoritos</div>
          </div>
        </Link>
      </div>

      {/* Favorites Section */}
      <div className="user-favorites-section">
        <div className="user-section-header">
          <h3 className="user-section-title">❤️ Mis Favoritos</h3>
          <Link to="/restaurantes" style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.875rem' }}>
            Ver todos →
          </Link>
        </div>
        
        {favorites.length > 0 ? (
          <div className="user-favorites-grid">
            {favorites.slice(0, 6).map((local, index) => (
              <div key={index} className="user-favorite-card">
                <img 
                  src={local.foto || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"} 
                  alt={local.nombre}
                  className="user-favorite-image"
                />
                <div className="user-favorite-content">
                  <div className="user-favorite-name">{local.nombre}</div>
                  <div className="user-favorite-location">
                    📍 {local.ciudad}
                  </div>
                  <div className="user-favorite-actions">
                    <Link 
                      to={`/ruta-comida/${local.id}`} 
                      className="user-favorite-btn view"
                    >
                      Ver detalles
                    </Link>
                    <button 
                      onClick={() => removeFavorite(local.id)}
                      className="user-favorite-btn remove"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="user-empty-state">
            <div className="user-empty-icon">💔</div>
            <p>Aún no tienes favoritos</p>
            <Link to="/restaurantes" style={{ color: '#667eea' }}>
              Explora restaurantes y añade tus favoritos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
