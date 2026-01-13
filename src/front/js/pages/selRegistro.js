import React from "react";
import { Link } from "react-router-dom";

export const SelSignup = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: '#2d3748',
            marginBottom: '1rem'
          }}>
            Únete a Ruta 3B
          </h1>
          <p style={{ color: '#718096', fontSize: '1.1rem' }}>
            Elige cómo quieres formar parte de nuestra comunidad
          </p>
        </div>

        {/* Options */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {/* User Option */}
          <Link 
            to="/registro-usuario" 
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2.5rem',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              transition: 'all 0.3s',
              border: '3px solid transparent',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(102, 126, 234, 0.2)';
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            >
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '3rem'
              }}>
                👤
              </div>
              <h2 style={{ 
                color: '#2d3748', 
                fontSize: '1.5rem', 
                marginBottom: '1rem' 
              }}>
                Soy Usuario
              </h2>
              <p style={{ 
                color: '#718096', 
                fontSize: '0.95rem', 
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Descubre restaurantes, guarda favoritos, haz reservas y 
                disfruta de experiencias gastronómicas únicas.
              </p>
              <div style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '0.875rem 2rem',
                borderRadius: '10px',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                Crear cuenta de usuario
              </div>
            </div>
          </Link>

          {/* Restaurant Option */}
          <Link 
            to="/registro-Locales" 
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2.5rem',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              transition: 'all 0.3s',
              border: '3px solid transparent',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(17, 153, 142, 0.2)';
              e.currentTarget.style.borderColor = '#11998e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            >
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #11998e, #38ef7d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '3rem'
              }}>
                🏪
              </div>
              <h2 style={{ 
                color: '#2d3748', 
                fontSize: '1.5rem', 
                marginBottom: '1rem' 
              }}>
                Soy Restaurante
              </h2>
              <p style={{ 
                color: '#718096', 
                fontSize: '0.95rem', 
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Registra tu local, gestiona reservas, crea ofertas y 
                conecta con nuevos clientes cada día.
              </p>
              <div style={{
                background: 'linear-gradient(135deg, #11998e, #38ef7d)',
                color: 'white',
                padding: '0.875rem 2rem',
                borderRadius: '10px',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                Registrar mi local
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#718096' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: '#667eea', fontWeight: '600' }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
