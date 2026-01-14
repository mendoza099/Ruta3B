import React from "react";
import { Link } from "react-router-dom";

export const Nosotros = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          marginBottom: '1rem',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          Sobre Ruta 3B
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          opacity: 0.95,
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: '1.8'
        }}>
          Conectamos a las personas con los mejores restaurantes siguiendo 
          una filosofía simple: <strong>Bueno, Bonito y Barato</strong>.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Mission */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🎯</span>
            <h2 style={{ margin: 0, color: '#2d3748', fontSize: '1.75rem' }}>Nuestra Misión</h2>
          </div>
          <p style={{ color: '#4a5568', fontSize: '1.1rem', lineHeight: '1.8', margin: 0 }}>
            En Ruta 3B creemos que disfrutar de una buena comida no debería ser un lujo. 
            Nuestra misión es descubrir y dar visibilidad a esos restaurantes, bares y 
            cafeterías que ofrecen experiencias gastronómicas auténticas a precios justos. 
            Desde el pequeño bar de barrio con las mejores tapas hasta el restaurante 
            familiar con recetas de toda la vida.
          </p>
        </div>

        {/* 3B Philosophy */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            borderTop: '4px solid #667eea'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ⭐
            </div>
            <h3 style={{ color: '#2d3748', marginBottom: '0.75rem' }}>Bueno</h3>
            <p style={{ color: '#718096', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              Calidad en cada plato. Ingredientes frescos, recetas con sabor 
              y atención al detalle que marca la diferencia.
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            borderTop: '4px solid #11998e'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #11998e, #38ef7d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ✨
            </div>
            <h3 style={{ color: '#2d3748', marginBottom: '0.75rem' }}>Bonito</h3>
            <p style={{ color: '#718096', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              Ambientes acogedores y un trato cercano. Lugares donde te sientes 
              como en casa y quieres volver.
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            borderTop: '4px solid #f5576c'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              💰
            </div>
            <h3 style={{ color: '#2d3748', marginBottom: '0.75rem' }}>Barato</h3>
            <p style={{ color: '#718096', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              Precios honestos que respetan tu bolsillo. Porque comer bien 
              no tiene que ser sinónimo de gastar mucho.
            </p>
          </div>
        </div>

        {/* For Restaurants */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '2.5rem',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🏪</span>
            <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Para Restaurantes</h2>
          </div>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem', opacity: 0.95 }}>
            ¿Tienes un restaurante, bar o cafetería que cumple con la filosofía 3B? 
            Únete a nuestra comunidad y conecta con miles de comensales que buscan 
            exactamente lo que ofreces. No importa si eres grande o pequeño, si estás 
            en el centro o en un barrio: lo que importa es la calidad de tu propuesta.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link 
              to="/seleccion-registro" 
              style={{
                background: 'white',
                color: '#667eea',
                padding: '0.875rem 2rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'transform 0.3s'
              }}
            >
              Registrar mi local
            </Link>
            <Link 
              to="/contacto" 
              style={{
                background: 'transparent',
                color: 'white',
                padding: '0.875rem 2rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600',
                border: '2px solid white'
              }}
            >
              Más información
            </Link>
          </div>
        </div>

        {/* For Users */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>👥</span>
            <h2 style={{ margin: 0, color: '#2d3748', fontSize: '1.75rem' }}>Para Ti</h2>
          </div>
          <p style={{ color: '#4a5568', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            Explora restaurantes verificados, lee reseñas de otros usuarios, 
            guarda tus favoritos y reserva mesa en segundos. Descubre ofertas 
            exclusivas, experiencias gastronómicas únicas como catas y talleres, 
            y encuentra ese rincón especial que se convertirá en tu nuevo lugar favorito.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link 
              to="/restaurantes" 
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '0.875rem 2rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Explorar restaurantes
            </Link>
            <Link 
              to="/experiencia-gastronomica" 
              style={{
                background: '#f7fafc',
                color: '#4a5568',
                padding: '0.875rem 2rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Ver experiencias
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
