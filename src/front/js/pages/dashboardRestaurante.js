import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import "../../styles/dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

export const DashboardRestaurante = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + "/api/restaurant/dashboard", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div><p>Cargando dashboard...</p></div>;
  }

  if (!dashboardData) {
    return <div className="error-container"><p>Error al cargar el dashboard</p></div>;
  }

  const { restaurant_info, reservations, reviews, offers, events, engagement } = dashboardData;

  // Datos para gráficas
  const reservationsChartData = {
    labels: Object.keys(reservations.by_month),
    datasets: [{
      label: 'Reservas',
      data: Object.values(reservations.by_month),
      backgroundColor: 'rgba(102, 126, 234, 0.5)',
      borderColor: 'rgba(102, 126, 234, 1)',
      borderWidth: 2
    }]
  };

  const ratingsData = {
    labels: ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐', '⭐⭐', '⭐'],
    datasets: [{
      data: [
        reviews.recent.filter(r => r.rating === 5).length,
        reviews.recent.filter(r => r.rating === 4).length,
        reviews.recent.filter(r => r.rating === 3).length,
        reviews.recent.filter(r => r.rating === 2).length,
        reviews.recent.filter(r => r.rating === 1).length
      ],
      backgroundColor: ['#4ade80', '#a3e635', '#fbbf24', '#fb923c', '#f87171']
    }]
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard - {restaurant_info.name}</h1>
        <p>{restaurant_info.city} • {restaurant_info.type}</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{reservations.total}</h3>
            <p>Reservas Totales</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>{reviews.average_rating}</h3>
            <p>Valoración Media</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{offers.active}</h3>
            <p>Ofertas Activas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎉</div>
          <div className="stat-info">
            <h3>{events.active}</h3>
            <p>Eventos Activos</p>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Reservas por Mes</h3>
          <Bar data={reservationsChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        <div className="chart-card">
          <h3>Distribución de Valoraciones</h3>
          <Doughnut data={ratingsData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
      </div>

      <div className="dashboard-tables">
        <div className="table-card">
          <h3>Últimas Reservas</h3>
          <div className="table-content">
            {reservations.recent.map(res => (
              <div key={res.id} className="table-row">
                <span>{new Date(res.date).toLocaleDateString()}</span>
                <span>{res.people} personas</span>
                <span className={`status ${res.status}`}>{res.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="table-card">
          <h3>Últimas Reseñas</h3>
          <div className="table-content">
            {reviews.recent.map(rev => (
              <div key={rev.id} className="table-row">
                <span>{'⭐'.repeat(rev.rating)}</span>
                <span>{rev.comment?.substring(0, 50)}...</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
