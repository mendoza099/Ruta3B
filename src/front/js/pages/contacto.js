import React, { useState } from "react";
import { useFormspark } from "@formspark/use-formspark";
import Swal from "sweetalert2";
import "../../styles/forms.css";

export const Contacto = () => {
  const [submit, submitting] = useFormspark({
    formId: "vXF5Fe9t",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    await submit({ name, email, subject, message });
    
    Swal.fire({
      icon: "success",
      title: "¡Mensaje enviado!",
      html: `
        <p style="color: #718096;">Gracias por contactarnos.</p>
        <p style="color: #718096; font-size: 0.9rem;">Te responderemos lo antes posible.</p>
      `,
      confirmButtonColor: "#667eea",
    });
    
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
      padding: '3rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: '#2d3748',
            marginBottom: '1rem'
          }}>
            Contacta con nosotros
          </h1>
          <p style={{ 
            color: '#718096', 
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            ¿Tienes alguna pregunta, sugerencia o quieres registrar tu restaurante? 
            Estamos aquí para ayudarte.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Card 1 */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem'
              }}>
                🍽️
              </div>
              <h3 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                ¿Eres un restaurante?
              </h3>
              <p style={{ color: '#718096', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Únete a Ruta 3B y conecta con miles de comensales que buscan 
                experiencias gastronómicas auténticas. Gestiona reservas, 
                crea ofertas y haz crecer tu negocio.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #11998e, #38ef7d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem'
              }}>
                💡
              </div>
              <h3 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                Sugerencias
              </h3>
              <p style={{ color: '#718096', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Tu opinión nos importa. Si tienes ideas para mejorar la plataforma 
                o has encontrado algún problema, cuéntanos. Juntos hacemos 
                Ruta 3B mejor cada día.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem'
              }}>
                📍
              </div>
              <h3 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                Nuestra misión
              </h3>
              <p style={{ color: '#718096', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Conectar a las personas con los mejores restaurantes siguiendo 
                la filosofía 3B: <strong>Bueno, Bonito y Barato</strong>. 
                Porque comer bien no tiene que ser caro.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              padding: '2rem',
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📧</div>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Envíanos un mensaje</h2>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                Te responderemos en menos de 24 horas
              </p>
            </div>

            <form onSubmit={onSubmit} style={{ padding: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Asunto</label>
                <select
                  className="form-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  style={{
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23667eea' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center'
                  }}
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="registro-restaurante">Quiero registrar mi restaurante</option>
                  <option value="problema-tecnico">Problema técnico</option>
                  <option value="sugerencia">Sugerencia o mejora</option>
                  <option value="colaboracion">Colaboración o partnership</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mensaje</label>
                <textarea
                  className="form-input"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                  style={{ resize: 'vertical', minHeight: '120px' }}
                />
              </div>

              <button
                type="submit"
                className="form-btn form-btn-primary"
                disabled={submitting}
                style={{ marginTop: '0.5rem' }}
              >
                {submitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
