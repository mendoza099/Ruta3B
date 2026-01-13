import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/forms.css";

const RegistroUsuario = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    
    setIsSubmitting(true);
    
    try {
      await actions.registroUsuario(nombre, apellido, email, password);
      
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido a Ruta 3B!',
        html: `
          <p style="color: #718096;">Tu cuenta ha sido creada correctamente.</p>
          <p style="color: #718096; font-size: 0.9rem;">Ahora puedes descubrir los mejores restaurantes: buenos, bonitos y baratos.</p>
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
        text: 'No se pudo crear la cuenta. Inténtalo de nuevo.',
        confirmButtonColor: '#667eea'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (store.auth) {
    return <Navigate to="/usuario" />;
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <div className="form-header-icon">👤</div>
          <h2>Crear Cuenta</h2>
          <p>Únete a la comunidad Ruta 3B</p>
        </div>
        
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-input"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Apellido</label>
              <input
                type="text"
                className="form-input"
                placeholder="Tu apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
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
            {!passwordMatch && confirmPassword && (
              <div className="form-error">
                ⚠️ Las contraseñas no coinciden
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="form-btn form-btn-primary"
            disabled={isSubmitting || !passwordMatch}
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>
        
        <div className="form-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuario;
