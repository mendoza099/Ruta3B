import React, { StrictMode, useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { CardHome } from "./cardHome.jsx";
import { CardHome2 } from "./cardHome2.jsx";

export const Home = () => {
  const { store, actions } = useContext(Context);
  const [randomRestaurants, setRandomRestaurants] = useState([]);

  // Cargar restaurantes si no están cargados
  useEffect(() => {
    if (!store.restaurantes || store.restaurantes.length === 0) {
      actions.getRestaurantes();
    }
  }, []);

  // Seleccionar 4 restaurantes aleatorios cuando se carguen
  useEffect(() => {
    if (store.restaurantes && store.restaurantes.length > 0) {
      const shuffled = [...store.restaurantes].sort(() => 0.5 - Math.random());
      setRandomRestaurants(shuffled.slice(0, 4));
    }
  }, [store.restaurantes]);

  // Renderizar 4 restaurantes en grid 2x2
  const restaurantCards = randomRestaurants.map((item, index) => {
    // Alternar entre CardHome y CardHome2 según el índice
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
  });

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

    // Observar todas las cards del home
    const cards = document.querySelectorAll('.home-restaurants-grid .card-minimal');
    cards.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      cards.forEach((card) => {
        observer.unobserve(card);
      });
    };
  }, [randomRestaurants]);

  return (
    <>
      <div className="text-center mt-0">
        <p>
          <img
            className="img-center auto img-fluid w-100"
            src="https://images5.alphacoders.com/815/815875.jpg"
          />
        </p>
        <div className="container">
          <h1>
            <strong>BIENVENIDO A RUTA-3B'S</strong>
          </h1>
          <p className="text-justify">
            Si estás aquí es porque quieres descubrir los lugares mas
            sorprendentes de tu ciudad y que mejor forma que de la mano de{" "}
            <strong>RUTA-3B's</strong>. A todos nos gusta ir de copas junto a un
            buen tapeo, comer bien a un precio justo y por supuesto, conocer
            locales nuevos que se esconden en los barrios y sus infinitas calles
            que conforman esta hermosa ciudad. <br />
            Regístrate y descubre los lugares más fabulosos de la ciudad!
          </p>
        </div>
      </div>
      <hr />
      <div className="home-restaurants-grid">
        {randomRestaurants.length > 0 ? (
          restaurantCards
        ) : (
          <div className="text-center w-100 py-5">
            <div className="spinner-border text-warning mb-3" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando restaurantes destacados...</p>
          </div>
        )}
      </div>
    </>
  );
};
