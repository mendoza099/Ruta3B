import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/forms.css";

const RegistroDeLocales = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoLocal, setTipoLocal] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [precio, setPrecio] = useState(2);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    if (!tipoLocal) {
      Swal.fire({
        icon: 'warning',
        title: 'Tipo de local',
        text: 'Por favor selecciona el tipo de local',
        confirmButtonColor: '#667eea'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await actions.RegistroLocales(
        nombre,
        email,
        password,
        tipoLocal,
        descripcion,
        direccion,
        ciudad,
        codigoPostal
      );
      
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido a Ruta 3B!',
        html: `
          <p style="color: #718096;">Tu local ha sido registrado correctamente.</p>
          <p style="color: #718096; font-size: 0.9rem;">Ahora podrás gestionar tu perfil, recibir reservas y conectar con nuevos clientes.</p>
        `,
        confirmButtonColor: '#667eea',
        confirmButtonText: 'Iniciar Sesión'
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar el local. Inténtalo de nuevo.',
        confirmButtonColor: '#667eea'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (store.auth) {
    return <Navigate to="/restaurante" />;
  }

  const tiposLocal = [
    { value: "Restaurante", icon: "🍽️" },
    { value: "Bar", icon: "🍺" },
    { value: "Cafetería", icon: "☕" },
    { value: "Tapas", icon: "🥘" },
    { value: "Pizzería", icon: "🍕" },
    { value: "Marisquería", icon: "🦐" },
    { value: "Asador", icon: "🥩" },
    { value: "Gastrobar", icon: "🍸" }
  ];

  return (
    <div className="form-container">
      <div className="form-card wide">
        <div className="form-header">
          <div className="form-header-icon">🏪</div>
          <h2>Registra tu Local</h2>
          <p>Únete a la red de restaurantes Ruta 3B</p>
        </div>
        
        <form onSubmit={handleSubmit} className="form-body">
          {/* Información básica */}
          <div className="form-group">
            <label className="form-label">Nombre del Local</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Restaurante La Abuela"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-input"
                placeholder="contacto@tulocal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Ciudad</label>
              <input
                type="text"
                className="form-input"
                placeholder="Madrid, Barcelona..."
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-input"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                className={`form-input ${confirmPassword ? (passwordMatch ? 'is-valid' : 'is-invalid') : ''}`}
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          {!passwordMatch && confirmPassword && (
            <div className="form-error" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
              ⚠️ Las contraseñas no coinciden
            </div>
          )}
          
          {/* Tipo de local */}
          <div className="form-group">
            <label className="form-label">Tipo de Local</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {tiposLocal.map((tipo) => (
                <div
                  key={tipo.value}
                  onClick={() => setTipoLocal(tipo.value)}
                  style={{
                    padding: '0.75rem',
                    border: `2px solid ${tipoLocal === tipo.value ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: tipoLocal === tipo.value ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f8fafc',
                    color: tipoLocal === tipo.value ? 'white' : '#4a5568',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ fontSize: '1.5rem' }}>{tipo.icon}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{tipo.value}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Ubicación */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-input"
                placeholder="Calle, número..."
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Código Postal</label>
              <input
                type="text"
                className="form-input"
                placeholder="28001"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Descripción */}
          <div className="form-group">
            <label className="form-label">Descripción del Local</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Cuéntanos qué hace especial a tu local: tipo de cocina, ambiente, especialidades..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="form-btn form-btn-primary"
            disabled={isSubmitting || !passwordMatch}
          >
            {isSubmitting ? 'Registrando local...' : 'Registrar Local'}
          </button>
        </form>
        
        <div className="form-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegistroDeLocales;
