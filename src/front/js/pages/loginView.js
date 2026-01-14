import React, { useState, useContext } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import "../../styles/forms.css";

export const LoginView = () => {
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos",
        icon: "warning",
        confirmButtonColor: "#667eea"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await actions.login(email, password);
      
      if (result.success) {
        Swal.fire({
          title: "¡Bienvenido!",
          html: result.isRestaurant 
            ? "Accediendo a tu panel de restaurante..." 
            : "Accediendo a tu perfil...",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: "#667eea"
        }).then(() => {
          if (result.isRestaurant) {
            navigate("/restaurante", { replace: true });
          } else {
            navigate("/usuario", { replace: true });
          }
        });
      } else {
        Swal.fire({
          title: "Error al iniciar sesión",
          text: result.message || "Credenciales incorrectas",
          icon: "error",
          confirmButtonColor: "#667eea"
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
        icon: "error",
        confirmButtonColor: "#667eea"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (store.auth) {
    return <Navigate to="/" />;
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <div className="form-header-icon">🔐</div>
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta de Ruta 3B</p>
        </div>
        
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-input"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="form-btn form-btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>
        
        <div className="form-footer">
          <p>¿No tienes cuenta? <Link to="/seleccion-registro">Regístrate</Link></p>
        </div>
      </div>
    </div>
  );
};
