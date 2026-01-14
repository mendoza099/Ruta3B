import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/dashboard.css";
import { Chart, registerables } from 'chart.js';
import Swal from "sweetalert2";

Chart.register(...registerables);

export const Restaurante = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [timePeriod, setTimePeriod] = useState('180'); // días
  
  // Form states
  const [formData, setFormData] = useState({
    descripcion: "",
    precio: "",
    direccion: "",
    ciudad: "",
    codigo_postal: ""
  });

  // Chart refs
  const reservationsChartRef = useRef(null);
  const ratingsChartRef = useRef(null);
  const reservationsChartInstance = useRef(null);
  const ratingsChartInstance = useRef(null);

  useEffect(() => {
    if (!store.auth || localStorage.getItem("esLocal") !== "true") {
      return;
    }
    loadDashboard();
  }, [store.auth]);

  const loadDashboard = async (period = timePeriod) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/restaurant/dashboard?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setDashboard(data);
        setFormData({
          descripcion: data.restaurant_info.description || "",
          precio: data.restaurant_info.price || "",
          direccion: data.restaurant_info.address || "",
          ciudad: data.restaurant_info.city || "",
          codigo_postal: data.restaurant_info.postal_code || ""
        });
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize charts when dashboard data is loaded
  useEffect(() => {
    if (dashboard && dashboard.charts) {
      // Small delay to ensure canvas is rendered
      const timer = setTimeout(() => {
        initCharts();
      }, 100);
      return () => clearTimeout(timer);
    }
    
    return () => {
      if (reservationsChartInstance.current) {
        reservationsChartInstance.current.destroy();
      }
      if (ratingsChartInstance.current) {
        ratingsChartInstance.current.destroy();
      }
    };
  }, [dashboard]);

  const initCharts = () => {
    // Destroy existing charts
    if (reservationsChartInstance.current) {
      reservationsChartInstance.current.destroy();
    }
    if (ratingsChartInstance.current) {
      ratingsChartInstance.current.destroy();
    }

    // Reservations Chart
    if (reservationsChartRef.current && dashboard.charts.reservations_by_month) {
      const ctx = reservationsChartRef.current.getContext('2d');
      reservationsChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dashboard.charts.reservations_by_month.labels,
          datasets: [{
            label: 'Reservas',
            data: dashboard.charts.reservations_by_month.data,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }
      });
    }

    // Ratings Chart
    if (ratingsChartRef.current && dashboard.charts.rating_distribution) {
      const ctx = ratingsChartRef.current.getContext('2d');
      ratingsChartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: dashboard.charts.rating_distribution.labels,
          datasets: [{
            data: dashboard.charts.rating_distribution.data,
            backgroundColor: [
              '#f56565',
              '#ed8936',
              '#ecc94b',
              '#48bb78',
              '#38a169'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 20 }
            }
          },
          cutout: '60%'
        }
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/profile-restaurante`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData)
        }
      );
      
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Perfil actualizado',
          text: 'Los cambios se han guardado correctamente',
          confirmButtonColor: '#667eea'
        });
        setEditMode(false);
        loadDashboard();
      } else {
        throw new Error('Error al guardar');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron guardar los cambios',
        confirmButtonColor: '#667eea'
      });
    }
  };

  const getPriceSymbol = (price) => {
    if (!price) return "€";
    return "€".repeat(Math.min(price, 3));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Not logged in or not a restaurant
  if (!store.auth || localStorage.getItem("esLocal") !== "true") {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</span>
          <h2>Acceso restringido</h2>
          <p className="text-muted mb-4">Debes iniciar sesión como restaurante para acceder al dashboard</p>
          <Link to="/login" className="btn-save">Iniciar Sesión</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p className="mt-3">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</span>
          <h2>Error al cargar</h2>
          <p className="text-muted">No se pudo cargar la información del dashboard</p>
          <button onClick={loadDashboard} className="btn-save mt-3">Reintentar</button>
        </div>
      </div>
    );
  }

  const { restaurant_info, stats, charts, reservations, reviews, offers, events } = dashboard;

  // Crear nueva oferta
  const crearOferta = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { value: formValues } = await Swal.fire({
      title: '🏷️ Nueva Oferta',
      html: `
        <div style="text-align: left;">
          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Título:</label>
          <input type="text" id="swal-titulo" class="swal2-input" placeholder="Ej: 2x1 en pizzas" style="width: 100%;">
          
          <label style="display: block; margin: 15px 0 5px; font-weight: 600;">Descripción:</label>
          <textarea id="swal-descripcion" class="swal2-textarea" placeholder="Describe tu oferta..." style="width: 100%;"></textarea>
          
          <label style="display: block; margin: 15px 0 5px; font-weight: 600;">Descuento (%):</label>
          <input type="number" id="swal-descuento" class="swal2-input" placeholder="20" min="1" max="100" style="width: 100%;">
          
          <label style="display: block; margin: 15px 0 5px; font-weight: 600;">Válido hasta:</label>
          <input type="date" id="swal-fecha" class="swal2-input" min="${today}" style="width: 100%;">
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Crear Oferta',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const titulo = document.getElementById('swal-titulo').value;
        const descripcion = document.getElementById('swal-descripcion').value;
        const descuento = document.getElementById('swal-descuento').value;
        const fecha = document.getElementById('swal-fecha').value;
        
        if (!titulo || !descuento || !fecha) {
          Swal.showValidationMessage('Completa todos los campos obligatorios');
          return false;
        }
        return { titulo, descripcion, descuento, fecha };
      }
    });

    if (formValues) {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/offers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title: formValues.titulo,
            description: formValues.descripcion || '',
            discount_percentage: parseInt(formValues.descuento),
            start_date: new Date().toISOString(),
            end_date: formValues.fecha + 'T23:59:59'
          })
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: '¡Oferta creada!',
            text: 'Tu oferta ya está visible en el mapa de ofertas',
            confirmButtonColor: '#667eea'
          });
          loadDashboard();
        } else {
          const error = await response.json();
          throw new Error(error.message || 'Error al crear oferta');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo crear la oferta',
          confirmButtonColor: '#667eea'
        });
      }
    }
  };

  // Crear nueva experiencia
  const crearExperiencia = async () => {
    const { value: formValues } = await Swal.fire({
      title: '🎉 Nueva Experiencia',
      html: `
        <div style="text-align: left;">
          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Título:</label>
          <input type="text" id="swal-titulo" class="swal2-input" placeholder="Ej: Cata de vinos" style="width: 100%;">
          
          <label style="display: block; margin: 15px 0 5px; font-weight: 600;">Tipo:</label>
          <select id="swal-tipo" class="swal2-select" style="width: 100%;">
            <option value="cata">🍷 Cata</option>
            <option value="taller">👨‍🍳 Taller</option>
            <option value="degustacion">🍽️ Degustación</option>
            <option value="pack">🎁 Pack Especial</option>
          </select>
          
          <label style="display: block; margin: 15px 0 5px; font-weight: 600;">Descripción:</label>
          <textarea id="swal-descripcion" class="swal2-textarea" placeholder="Describe la experiencia..." style="width: 100%;"></textarea>
          
          <label style="display: block; margin: 15px 0 5px; font-weight: 600;">Precio por persona (€):</label>
          <input type="number" id="swal-precio" class="swal2-input" placeholder="25" min="1" style="width: 100%;">
          
          <label style="display: block; margin: 15px 0 5px; font-weight: 600;">Plazas máximas:</label>
          <input type="number" id="swal-plazas" class="swal2-input" placeholder="10" min="1" style="width: 100%;">
          
          <label style="display: block; margin: 15px 0 5px; font-weight: 600;">Duración (horas):</label>
          <input type="number" id="swal-duracion" class="swal2-input" placeholder="2" min="1" max="8" value="2" style="width: 100%;">
          
          <label style="display: block; margin: 15px 0 5px; font-weight: 600;">Fecha y hora de inicio:</label>
          <input type="datetime-local" id="swal-fecha" class="swal2-input" style="width: 100%;">
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#38a169',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Crear Experiencia',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const titulo = document.getElementById('swal-titulo').value;
        const tipo = document.getElementById('swal-tipo').value;
        const descripcion = document.getElementById('swal-descripcion').value;
        const precio = document.getElementById('swal-precio').value;
        const plazas = document.getElementById('swal-plazas').value;
        const duracion = document.getElementById('swal-duracion').value;
        const fecha = document.getElementById('swal-fecha').value;
        
        if (!titulo || !precio || !plazas || !fecha) {
          Swal.showValidationMessage('Completa todos los campos obligatorios');
          return false;
        }
        return { titulo, tipo, descripcion, precio, plazas, duracion, fecha };
      }
    });

    if (formValues) {
      try {
        // Calcular fecha de fin basada en duración
        const startDate = new Date(formValues.fecha);
        const endDate = new Date(startDate.getTime() + (parseInt(formValues.duracion) * 60 * 60 * 1000));
        
        const response = await fetch(`${process.env.BACKEND_URL}/api/gastronomic-events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title: formValues.titulo,
            event_type: formValues.tipo,
            description: formValues.descripcion || '',
            price: parseFloat(formValues.precio),
            max_participants: parseInt(formValues.plazas),
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            city: restaurant_info.city,
            address: restaurant_info.address
          })
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: '¡Experiencia creada!',
            text: 'Tu experiencia ya está visible en Experiencias Gastronómicas',
            confirmButtonColor: '#38a169'
          });
          loadDashboard();
        } else {
          const error = await response.json();
          throw new Error(error.message || 'Error al crear experiencia');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo crear la experiencia',
          confirmButtonColor: '#667eea'
        });
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Bienvenido, {restaurant_info.name}</p>
        </div>
        <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
          <button 
            onClick={crearOferta} 
            className="btn-save"
            style={{ background: 'linear-gradient(135deg, #f6ad55, #ed8936)' }}
          >
            🏷️ Nueva Oferta
          </button>
          <button 
            onClick={crearExperiencia} 
            className="btn-save"
            style={{ background: 'linear-gradient(135deg, #48bb78, #38a169)' }}
          >
            🎉 Nueva Experiencia
          </button>
          <button 
            onClick={() => setEditMode(!editMode)} 
            className="btn-save"
            style={{ background: editMode ? '#e53e3e' : 'linear-gradient(135deg, #667eea, #764ba2)' }}
          >
            {editMode ? '✕ Cancelar' : '✏️ Editar Perfil'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{stats.total_reservations}</div>
          <div className="stat-label">Reservas Totales</div>
          {stats.reservation_trend !== 0 && (
            <span className={`stat-trend ${stats.reservation_trend > 0 ? 'up' : 'down'}`}>
              {stats.reservation_trend > 0 ? '↑' : '↓'} {Math.abs(stats.reservation_trend)}%
            </span>
          )}
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.total_people_served}</div>
          <div className="stat-label">Personas Atendidas</div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{stats.average_rating || '—'}</div>
          <div className="stat-label">{stats.total_reviews} Reseñas</div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon">❤️</div>
          <div className="stat-value">{stats.favorites_count}</div>
          <div className="stat-label">En Favoritos</div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">👁️</div>
          <div className="stat-value">{stats.estimated_profile_visits}</div>
          <div className="stat-label">Visitas Estimadas</div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">🏷️</div>
          <div className="stat-value">{offers.active}</div>
          <div className="stat-label">Ofertas Activas</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">🎉</div>
          <div className="stat-value">{events.active}</div>
          <div className="stat-label">Eventos Activos</div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.confirmed_reservations}</div>
          <div className="stat-label">Reservas Confirmadas</div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-image-container">
            <img 
              src={restaurant_info.photo || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"} 
              alt={restaurant_info.name}
              className="profile-image"
            />
            <div className="profile-image-overlay">
              <span className="profile-badge">{restaurant_info.type}</span>
            </div>
          </div>
          <div className="profile-content">
            <h2 className="profile-name">{restaurant_info.name}</h2>
            <div className="profile-location">
              📍 {restaurant_info.address}, {restaurant_info.city}
            </div>
            <p className="profile-description">{restaurant_info.description}</p>
            <div className="profile-price">
              <span>{getPriceSymbol(restaurant_info.price)}</span>
              <span style={{ fontSize: '0.875rem', color: '#718096' }}>
                {restaurant_info.price === 1 && "Económico"}
                {restaurant_info.price === 2 && "Moderado"}
                {restaurant_info.price === 3 && "Premium"}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="edit-section">
          <h3 className="edit-title">
            {editMode ? '✏️ Editar Información' : '📋 Información del Local'}
          </h3>
          
          <form onSubmit={handleSaveProfile}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Descripción</label>
                <textarea
                  name="descripcion"
                  className="form-input form-textarea"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="Describe tu restaurante..."
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Precio Medio</label>
                <select
                  name="precio"
                  className="form-input"
                  value={formData.precio}
                  onChange={handleInputChange}
                  disabled={!editMode}
                >
                  <option value="1">€ - Económico</option>
                  <option value="2">€€ - Moderado</option>
                  <option value="3">€€€ - Premium</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  className="form-input"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  className="form-input"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Código Postal</label>
                <input
                  type="text"
                  name="codigo_postal"
                  className="form-input"
                  value={formData.codigo_postal}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
            </div>
            
            {editMode && (
              <div className="mt-3">
                <button type="submit" className="btn-save">
                  💾 Guardar Cambios
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Time Filter */}
      <div className="chart-card mb-4" style={{ padding: '1rem 1.5rem' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <h3 className="chart-title m-0">📊 Análisis de Datos</h3>
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: '0.875rem', color: '#718096' }}>Período:</span>
            <select 
              className="form-input" 
              style={{ width: 'auto', padding: '0.5rem 1rem' }}
              value={timePeriod}
              onChange={(e) => {
                setTimePeriod(e.target.value);
                loadDashboard(e.target.value);
              }}
            >
              <option value="7">Última semana</option>
              <option value="30">Último mes</option>
              <option value="90">Último trimestre</option>
              <option value="180">Últimos 6 meses</option>
              <option value="365">Último año</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">📈 Reservas por Mes</h3>
          <div className="chart-container">
            {charts && charts.reservations_by_month && charts.reservations_by_month.data && charts.reservations_by_month.data.some(v => v > 0) ? (
              <canvas ref={reservationsChartRef}></canvas>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <p>No hay reservas en este período</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="chart-card">
          <h3 className="chart-title">⭐ Distribución de Valoraciones</h3>
          <div className="chart-container">
            {charts && charts.rating_distribution && charts.rating_distribution.data && charts.rating_distribution.data.some(v => v > 0) ? (
              <canvas ref={ratingsChartRef}></canvas>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">⭐</div>
                <p>No hay reseñas en este período</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        {/* Recent Reservations */}
        <div className="activity-card">
          <h3 className="activity-title">
            📅 Últimas Reservas
            <span style={{ fontSize: '0.875rem', color: '#718096' }}>
              {reservations.total} total
            </span>
          </h3>
          
          {reservations.recent && reservations.recent.length > 0 ? (
            <ul className="activity-list">
              {reservations.recent.map((res, index) => (
                <li key={index} className="activity-item">
                  <div className="activity-icon reservation">📅</div>
                  <div className="activity-content">
                    <div className="activity-text">
                      <strong>{res.people} personas</strong> - {res.status === 'confirmed' ? '✅ Confirmada' : '❌ Cancelada'}
                    </div>
                    <div className="activity-date">
                      {formatDate(res.date)} {res.time && `a las ${res.time}`}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <p>No hay reservas recientes</p>
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="activity-card">
          <h3 className="activity-title">
            ⭐ Últimas Reseñas
            <span style={{ fontSize: '0.875rem', color: '#718096' }}>
              {reviews.total} total
            </span>
          </h3>
          
          {reviews.recent && reviews.recent.length > 0 ? (
            <ul className="activity-list">
              {reviews.recent.map((review, index) => (
                <li key={index} className="activity-item">
                  <div className="activity-icon review">⭐</div>
                  <div className="activity-content">
                    <div className="activity-text">
                      <strong>{review.user_name}</strong>
                      <span className="activity-rating ms-2">
                        {"⭐".repeat(review.rating)}
                      </span>
                    </div>
                    <div className="activity-date">{review.comment?.substring(0, 50)}...</div>
                    <div className="activity-date">{formatDate(review.created_at)}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">⭐</div>
              <p>No hay reseñas aún</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
