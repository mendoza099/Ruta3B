import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/navbar.css";
import logo3 from "../../img/logo3.png";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Inicio", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { path: "/restaurantes", label: "Restaurantes", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { path: "/experiencia-gastronomica", label: "Experiencias", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
    { path: "/mapa-ofertas", label: "Ofertas", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { path: "/sobre-nosotros", label: "Nosotros", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { path: "/contacto", label: "Contacto", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo3} alt="Ruta 3B" className="logo-img" />
          <div className="logo-text">
            <span className="logo-name">Ruta 3B</span>
            <span className="logo-tagline">Bueno · Bonito · Barato</span>
          </div>
        </Link>

        {/* Hamburger */}
        <button 
          className={`hamburger ${menuOpen ? 'active' : ''}`} 
          onClick={toggleMenu} 
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-menu">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <svg 
                    className="nav-icon" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth */}
          <div className="nav-auth">
            {store.auth ? (
              <>
                <button
                  className="btn-auth btn-profile"
                  onClick={() => {
                    closeMenu();
                    localStorage.getItem("esLocal") && !localStorage.getItem("esUsuario")
                      ? navigate("/restaurante")
                      : navigate("/usuario");
                  }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mi Perfil
                </button>
                <button
                  className="btn-auth btn-logout"
                  onClick={() => {
                    closeMenu();
                    actions.logout();
                    navigate("/");
                  }}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-auth btn-login" onClick={closeMenu}>
                  Entrar
                </Link>
                <Link to="/seleccion-registro" className="btn-auth btn-register" onClick={closeMenu}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
