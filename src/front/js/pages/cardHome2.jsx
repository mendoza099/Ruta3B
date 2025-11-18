import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "./../../styles/card.css";

export const CardHome2 = ({ id, nombre, descripcion, tipo_local, foto }) => {
  const { store, actions } = useContext(Context);

  return (
    <div className="card-minimal card-minimal-reverse">
      <div className="card-minimal-image">
        <img src={foto} alt={nombre} />
      </div>
      <div className="card-minimal-content">
        <div className="card-minimal-header">
          <h2 className="card-minimal-title">{nombre}</h2>
          <span className="card-minimal-badge">{tipo_local}</span>
        </div>
        
        <p className="card-minimal-description">{descripcion}</p>
        
        <div className="card-minimal-actions">
          <button
            onClick={() => actions.addFavorite(id)}
            className="btn-minimal btn-minimal-icon"
            title="Añadir a favoritos"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button
            onClick={() => actions.removeFavorite(id)}
            className="btn-minimal btn-minimal-icon btn-minimal-danger"
            title="Eliminar de favoritos"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <Link
            to={"/ruta-comida/" + id}
            className="btn-minimal btn-minimal-primary"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};
