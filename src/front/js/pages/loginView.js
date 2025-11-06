import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";

export const LoginView = () => {
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !password) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos",
        icon: "warning",
        confirmButtonColor: "#ffc843",
        backdrop: `rgba(255, 200, 67, 0.3)`
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await actions.login(email, password);
      
      if (result.success) {
        // Login exitoso
        Swal.fire({
          title: "¡Bienvenido!",
          html: result.isRestaurant 
            ? "Accediendo a tu panel de restaurante..." 
            : "Accediendo a tu perfil de usuario...",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: "#ffc843",
          backdrop: `rgba(255, 200, 67, 0.3)`
        }).then(() => {
          // Navegar después de mostrar el mensaje
          if (result.isRestaurant) {
            navigate("/restaurante", { replace: true });
          } else {
            navigate("/usuario", { replace: true });
          }
        });
      } else {
        // Error en el login
        Swal.fire({
          title: "Error al iniciar sesión",
          text: result.message || "Credenciales incorrectas",
          icon: "error",
          confirmButtonColor: "#ffc843",
          backdrop: `rgba(255, 200, 67, 0.3)`
        });
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
        icon: "error",
        confirmButtonColor: "#ffc843",
        backdrop: `rgba(255, 200, 67, 0.3)`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container text-center">
      <form
        style={{
          backgroundColor: "rgb(255, 200, 67)",
          padding: "18px",
          borderRadius: "10px",
        }}
        className="mt-5 h-50 w-50 m-auto"
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <h6 className="mb-3 text-start">
            Introduce tu cuenta de correo electrónico
          </h6>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="ejemplo@correo.com"
            disabled={isLoading}
            required
          />
        </div>
        <div className="mb-3">
          <h6 className="mb-3 text-start">Introduce tu contraseña</h6>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="form-control"
            placeholder="••••••••"
            disabled={isLoading}
            required
          />
        </div>
        <div className="union d-flex">
          <button
            style={{ backgroundColor: "white" }}
            type="submit"
            className="m-auto btn"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Entrar"}
          </button>
        </div>
        <div className="mt-3">
          <small>
            ¿No tienes cuenta?{" "}
            <Link to="/seleccion-registro" style={{ color: "#000" }}>
              Regístrate aquí
            </Link>
          </small>
        </div>
      </form>
    </div>
  );
};
