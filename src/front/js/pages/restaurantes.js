import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../store/appContext";
import "../../styles/perfilRestaurante.css";
import "../../styles/filters.css";
import { Link, useParams } from "react-router-dom";
import { CardHome } from "./cardHome.jsx";
import { CardHome2 } from "./cardHome2.jsx";

export const Restaurantes = () => {
  const { store, actions } = useContext(Context);
  const [selectedCountry, setSelectedCountry] = useState("todos");
  const [selectedCity, setSelectedCity] = useState("todas");
  const [selectedType, setSelectedType] = useState("todos");
  const [selectedPrice, setSelectedPrice] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Definir países y sus ciudades
  const countryCities = {
    "España": ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia", "Palma de Mallorca", "Las Palmas", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón", "Granada", "San Sebastián", "Salamanca", "Toledo", "Cáceres"],
    "Portugal": ["Lisboa", "Porto", "Faro", "Coimbra", "Braga", "Évora", "Funchal", "Aveiro", "Setúbal", "Guimarães", "Viseu", "Leiria", "Cascais", "Sintra", "Portimão"],
    "Francia": ["París", "Marsella", "Lyon", "Toulouse", "Niza", "Nantes", "Estrasburgo", "Montpellier", "Burdeos", "Lille", "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes", "Aix-en-Provence"]
  };

  // Obtener países
  const countries = ["todos", ...Object.keys(countryCities)];

  // Obtener ciudades filtradas por país
  const getCitiesForCountry = () => {
    if (selectedCountry === "todos") {
      return ["todas", ...new Set(store.restaurantes.map(r => r.ciudad))].sort();
    }
    return ["todas", ...countryCities[selectedCountry]].sort();
  };

  const cities = getCitiesForCountry();
  
  // Obtener tipos únicos
  const types = ["todos", ...new Set(store.restaurantes.map(r => r.tipo_local))].sort();

  // Filtrar restaurantes
  const filteredRestaurants = store.restaurantes.filter((item) => {
    const matchCountry = selectedCountry === "todos" || 
      (selectedCountry === "España" && countryCities["España"].includes(item.ciudad)) ||
      (selectedCountry === "Portugal" && countryCities["Portugal"].includes(item.ciudad)) ||
      (selectedCountry === "Francia" && countryCities["Francia"].includes(item.ciudad));
    const matchCity = selectedCity === "todas" || item.ciudad === selectedCity;
    const matchType = selectedType === "todos" || item.tipo_local === selectedType;
    const matchPrice = selectedPrice === "todos" || item.precio === parseInt(selectedPrice);
    const matchSearch = searchTerm === "" || 
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchCountry && matchCity && matchType && matchPrice && matchSearch;
  });

  // Reset ciudad cuando cambia el país
  useEffect(() => {
    setSelectedCity("todas");
  }, [selectedCountry]);

  // Reset página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCountry, selectedCity, selectedType, selectedPrice, searchTerm]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  // Funciones de paginación
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  useEffect(() => {
    actions.getRestaurantes();
  }, []);

  // Intersection Observer para animaciones al hacer scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observar todas las cards
    const cards = document.querySelectorAll('.card-minimal');
    cards.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      cards.forEach((card) => {
        observer.unobserve(card);
      });
    };
  }, [filteredRestaurants]);

  return (
    <>
      <div className="filters-container">
        <h2 className="filters-title">Descubre Restaurantes</h2>
        
        <div className="filters-grid">
          {/* Búsqueda */}
          <div className="filter-item filter-search">
            <label className="filter-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              Buscar
            </label>
            <input
              type="text"
              className="filter-input"
              placeholder="Nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* País */}
          <div className="filter-item">
            <label className="filter-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              País
            </label>
            <select
              className="filter-select"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {countries.map((country, i) => (
                <option key={i} value={country}>
                  {country === "todos" ? "Todos los países" : country}
                </option>
              ))}
            </select>
          </div>

          {/* Ciudad */}
          <div className="filter-item">
            <label className="filter-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Ciudad
            </label>
            <select
              className="filter-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cities.map((city, i) => (
                <option key={i} value={city}>
                  {city === "todas" ? "Todas las ciudades" : city}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div className="filter-item">
            <label className="filter-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Tipo
            </label>
            <select
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {types.map((type, i) => (
                <option key={i} value={type}>
                  {type === "todos" ? "Todos los tipos" : type}
                </option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div className="filter-item">
            <label className="filter-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              Precio
            </label>
            <select
              className="filter-select"
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
            >
              <option value="todos">Todos los precios</option>
              <option value="1">€ - Económico</option>
              <option value="2">€€ - Moderado</option>
              <option value="3">€€€ - Premium</option>
            </select>
          </div>
        </div>

        <div className="filters-results">
          <span className="results-count">
            {filteredRestaurants.length} restaurante{filteredRestaurants.length !== 1 ? 's' : ''} encontrado{filteredRestaurants.length !== 1 ? 's' : ''}
            {filteredRestaurants.length > itemsPerPage && (
              <span className="results-page-info"> • Página {currentPage} de {totalPages}</span>
            )}
          </span>
          {(selectedCountry !== "todos" || selectedCity !== "todas" || selectedType !== "todos" || selectedPrice !== "todos" || searchTerm !== "") && (
            <button 
              className="btn-clear-filters"
              onClick={() => {
                setSelectedCountry("todos");
                setSelectedCity("todas");
                setSelectedType("todos");
                setSelectedPrice("todos");
                setSearchTerm("");
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="restaurants-list">
        {filteredRestaurants.length > 0 ? (
          <>
            {currentRestaurants.map((item, index) => {
              const CardComponent = index % 2 === 0 ? CardHome : CardHome2;
              return (
                <CardComponent
                  key={item.id}
                  id={item.id}
                  tipo_local={item.tipo_local}
                  descripcion={item.descripcion}
                  nombre={item.nombre}
                  foto={item.foto}
                />
              );
            })}
            
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  className="pagination-btn pagination-prev"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  Anterior
                </button>
                
                <div className="pagination-numbers">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                    ) : (
                      <button
                        key={page}
                        className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>
                
                <button 
                  className="pagination-btn pagination-next"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-results">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h3>No se encontraron restaurantes</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </>
  );
};
