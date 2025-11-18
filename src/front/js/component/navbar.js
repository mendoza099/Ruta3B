import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

import logo3 from "../../img/logo3.png";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  return (
    <>
      <div className="navbar-logo-container">
        <img
          className="navbar-logo"
          src={logo3}
          alt="Logo"
        />
      </div>
      
      {store.auth ? (
        <nav className="navbar-modern">
          <div className="navbar-content">
            <div className="navbar-links-modern">
              <Link to="/" className="btn-navbar">
                Inicio
              </Link>
              <Link to="/restaurantes" className="btn-navbar">
                Restaurantes
              </Link>
              <Link to="/experiencia-gastronomica" className="btn-navbar">
                Experiencias
              </Link>
              <Link to="/mapa-ofertas" className="btn-navbar">
                Ofertas
              </Link>
            </div>
            
            <div className="navbar-actions">
              <div
                className="btn-navbar btn-navbar-icon"
                onClick={() =>
                  localStorage.getItem("esLocal") &&
                  !localStorage.getItem("esUsuario")
                    ? navigate("/restaurante")
                    : navigate("/usuario")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                </svg>
              </div>
              <Link
                to="/"
                className="btn-navbar btn-navbar-logout"
                onClick={() => actions.logout()}
              >
                Cerrar sesión
              </Link>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="navbar-modern">
          <div className="navbar-content">
            <div className="navbar-links-modern">
              <Link to="/" className="btn-navbar">
                Inicio
              </Link>
              <Link to="/restaurantes" className="btn-navbar">
                Restaurantes
              </Link>
              <Link to="/experiencia-gastronomica" className="btn-navbar">
                Experiencias
              </Link>
              <Link to="/mapa-ofertas" className="btn-navbar">
                Ofertas
              </Link>
            </div>
            
            <div className="navbar-actions">
              <Link to="/login" className="btn-navbar">
                Iniciar sesión
              </Link>
              <Link to="/seleccion-registro" className="btn-navbar btn-navbar-primary">
                Registrarse
              </Link>
            </div>
          </div>
        </nav>
      )}
      <hr className="navbar-divider" />
    </>
  );
};
