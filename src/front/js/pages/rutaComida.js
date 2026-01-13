import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/perfilRestaurante.css";
import "../../styles/restaurantDetail.css";
import { Reviews } from "../component/reviews";
import RestaurantMap from "../component/restaurantMap";
import Swal from "sweetalert2";

export const RutaComida = ({ nombre, descripcion, id, tipo_local }) => {
  const { store, actions } = useContext(Context);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(2);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);

  const { theid } = useParams();

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await actions.getRestaurantes();
      // Solo cargar datos de usuario si está logueado
      if (localStorage.getItem("token")) {
        actions.getInformationCurrentMember();
        actions.getFavorit();
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Buscar restaurante cuando se carguen los datos
  useEffect(() => {
    if (store.restaurantes && store.restaurantes.length > 0) {
      const found = store.restaurantes.find(r => r.id === parseInt(theid));
      setRestaurant(found);
      setLoading(false);
    }
  }, [store.restaurantes, theid]);

  // Verificar si es favorito
  useEffect(() => {
    if (restaurant && store.likes && Array.isArray(store.likes)) {
      setIsFavorite(store.likes.some(fav => fav.id === restaurant.id));
    } else {
      setIsFavorite(false);
    }
  }, [restaurant, store.likes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!restaurant) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Restaurante no encontrado',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    if (!date) {
      Swal.fire({
        icon: 'warning',
        title: 'Fecha requerida',
        text: 'Por favor selecciona una fecha',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    const success = await actions.createReservation(
      restaurant.id,
      date,
      time || null,
      people
    );
    
    if (success) {
      setDate("");
      setTime("");
      setPeople(2);
    }
  };

  const toggleFavorite = async () => {
    if (!restaurant) return;
    
    if (isFavorite) {
      await actions.deleteFavorite(restaurant.id);
    } else {
      await actions.addFavorite(restaurant.id);
    }
    setIsFavorite(!isFavorite);
  };

  const getPriceSymbol = (precio) => {
    if (!precio) return "€";
    return "€".repeat(precio);
  };

  if (loading) {
    return (
      <div className="container text-center mt-5" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <h3 style={{ color: '#667eea' }}>Cargando restaurante...</h3>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container text-center mt-5" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ fontSize: '4rem' }}>🍽️</span>
        <h3 className="mt-3">Restaurante no encontrado</h3>
        <p className="text-muted">El restaurante que buscas no existe o ha sido eliminado.</p>
        <Link to="/restaurantes" className="btn mt-3" style={{ backgroundColor: '#667eea', color: 'white', borderRadius: '10px', padding: '0.75rem 2rem' }}>
          Ver todos los restaurantes
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section con imagen de fondo */}
      <div className="restaurant-hero" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${restaurant.foto})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '500px',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        marginBottom: '2rem'
      }}>
        <div className="container pb-5">
          <div className="row">
            <div className="col-lg-8">
              <div className="restaurant-hero-content" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="badge" style={{
                      backgroundColor: '#667eea',
                      color: 'white',
                      fontSize: '0.9rem',
                      padding: '0.5rem 1rem',
                      marginBottom: '0.5rem'
                    }}>
                      {restaurant.tipo_local}
                    </span>
                    <h1 className="display-4 fw-bold mb-2" style={{ color: '#2d3748' }}>
                      {restaurant.nombre}
                    </h1>
                  </div>
                  {store.auth && localStorage.getItem("esUsuario") === "true" && (
                    <button
                      onClick={toggleFavorite}
                      className="btn btn-light"
                      style={{
                        fontSize: '1.5rem',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        border: '2px solid #e2e8f0',
                        transition: 'all 0.3s'
                      }}
                    >
                      {isFavorite ? '❤️' : '🤍'}
                    </button>
                  )}
                </div>
                
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="d-flex align-items-center">
                    <span style={{ fontSize: '1.2rem', color: '#f59e0b' }}>
                      {getPriceSymbol(restaurant.precio)}
                    </span>
                    <span className="ms-2 text-muted">Precio medio</span>
                  </div>
                  {restaurant.ciudad && (
                    <>
                      <span className="text-muted">•</span>
                      <div className="d-flex align-items-center">
                        <span style={{ fontSize: '1.2rem' }}>📍</span>
                        <span className="ms-2">{restaurant.ciudad}</span>
                      </div>
                    </>
                  )}
                </div>

                <p className="lead mb-0" style={{ color: '#4a5568', lineHeight: '1.6' }}>
                  {restaurant.descripcion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sección de Información y Reservas */}
      <div className="container mb-5">
        <div className="row g-4">
          {/* Información del Restaurante */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
              <div className="card-body p-4">
                <h3 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                  📋 Información
                </h3>
                
                <div className="info-grid">
                  {restaurant.direccion && (
                    <div className="info-item mb-3 p-3" style={{
                      backgroundColor: '#f7fafc',
                      borderRadius: '10px',
                      borderLeft: '4px solid #667eea'
                    }}>
                      <div className="d-flex align-items-start">
                        <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>📍</span>
                        <div>
                          <strong style={{ color: '#2d3748' }}>Dirección</strong>
                          <p className="mb-0 text-muted">{restaurant.direccion}</p>
                          {restaurant.codigo_postal && (
                            <small className="text-muted">CP: {restaurant.codigo_postal}</small>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="info-item mb-3 p-3" style={{
                    backgroundColor: '#f7fafc',
                    borderRadius: '10px',
                    borderLeft: '4px solid #f59e0b'
                  }}>
                    <div className="d-flex align-items-start">
                      <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>💰</span>
                      <div>
                        <strong style={{ color: '#2d3748' }}>Rango de Precio</strong>
                        <p className="mb-0">
                          <span style={{ fontSize: '1.3rem', color: '#f59e0b' }}>
                            {getPriceSymbol(restaurant.precio)}
                          </span>
                          <span className="ms-2 text-muted">
                            {restaurant.precio === 1 && "Económico"}
                            {restaurant.precio === 2 && "Moderado"}
                            {restaurant.precio === 3 && "Premium"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="info-item mb-3 p-3" style={{
                    backgroundColor: '#f7fafc',
                    borderRadius: '10px',
                    borderLeft: '4px solid #10b981'
                  }}>
                    <div className="d-flex align-items-start">
                      <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>🍽️</span>
                      <div>
                        <strong style={{ color: '#2d3748' }}>Tipo de Cocina</strong>
                        <p className="mb-0 text-muted">{restaurant.tipo_local}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Reserva */}
          <div className="col-lg-5">
            {store.auth && localStorage.getItem("esUsuario") === "true" ? (
              <div className="card border-0 shadow-sm sticky-top" style={{
                borderRadius: '15px',
                top: '20px'
              }}>
                <div className="card-body p-4">
                  <h3 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                    🎫 Hacer una Reserva
                  </h3>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>
                        📅 Fecha
                      </label>
                      <input
                        className="form-control form-control-lg"
                        onChange={(e) => setDate(e.target.value)}
                        value={date}
                        type="date"
                        required
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e2e8f0',
                          padding: '0.75rem'
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>
                        🕐 Hora (opcional)
                      </label>
                      <input
                        className="form-control form-control-lg"
                        onChange={(e) => setTime(e.target.value)}
                        value={time}
                        type="time"
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e2e8f0',
                          padding: '0.75rem'
                        }}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>
                        👥 Número de Personas
                      </label>
                      <input
                        className="form-control form-control-lg"
                        onChange={(e) => setPeople(e.target.value)}
                        value={people}
                        type="number"
                        min="1"
                        max="20"
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e2e8f0',
                          padding: '0.75rem'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-lg w-100"
                      style={{
                        backgroundColor: '#667eea',
                        color: 'white',
                        borderRadius: '10px',
                        padding: '1rem',
                        fontWeight: '600',
                        border: 'none',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#5568d3'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#667eea'}
                    >
                      Confirmar Reserva
                    </button>
                  </form>

                  <div className="mt-3 p-3" style={{
                    backgroundColor: '#f0fdf4',
                    borderRadius: '10px',
                    border: '1px solid #86efac'
                  }}>
                    <small className="text-muted d-flex align-items-center">
                      <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>✓</span>
                      Confirmación inmediata • Cancelación gratuita
                    </small>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                <div className="card-body p-4 text-center">
                  <span style={{ fontSize: '3rem' }}>🔐</span>
                  <h4 className="mt-3 mb-3">Inicia sesión para reservar</h4>
                  <p className="text-muted mb-4">
                    Crea una cuenta o inicia sesión para hacer reservas en este restaurante
                  </p>
                  <Link to="/login" className="btn btn-lg" style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '0.75rem 2rem',
                    fontWeight: '600'
                  }}>
                    Iniciar Sesión
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mapa de ubicación */}
      <div className="container my-5">
        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
          <div className="card-header" style={{
            backgroundColor: '#667eea',
            color: 'white',
            padding: '1.5rem',
            border: 'none'
          }}>
            <h3 className="mb-0 d-flex align-items-center">
              <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>🗺️</span>
              Ubicación
            </h3>
          </div>
          <div className="card-body p-0">
            <RestaurantMap
              latitud={restaurant?.latitud}
              longitud={restaurant?.longitud}
              nombre={restaurant?.nombre}
              direccion={restaurant?.direccion}
              ciudad={restaurant?.ciudad}
            />
          </div>
        </div>
      </div>

      {/* Reseñas */}
      <div className="container my-5">
        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
          <div className="card-header" style={{
            backgroundColor: '#f7fafc',
            padding: '1.5rem',
            border: 'none',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h3 className="mb-0 d-flex align-items-center" style={{ color: '#2d3748' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>⭐</span>
              Reseñas y Opiniones
            </h3>
          </div>
          <div className="card-body p-4">
            <Reviews localId={parseInt(theid)} />
          </div>
        </div>
      </div>

      {/* Botón volver */}
      <div className="container mb-5">
        <div className="text-center">
          <Link to="/restaurantes">
            <button className="btn btn-lg" style={{
              backgroundColor: '#f7fafc',
              color: '#2d3748',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.75rem 2rem',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#e2e8f0';
              e.target.style.borderColor = '#cbd5e0';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#f7fafc';
              e.target.style.borderColor = '#e2e8f0';
            }}>
              ← Volver a Restaurantes
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};
