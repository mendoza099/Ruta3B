import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/perfilRestaurante.css";
import { Reviews } from "../component/reviews";
import RestaurantMap from "../component/restaurantMap";

export const RutaComida = ({ nombre, descripcion, id, tipo_local }) => {
  const { store, actions } = useContext(Context);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(2);

  const { theid } = useParams();

  // Buscar restaurante por ID, no por índice
  const restaurant = store.restaurantes.find(r => r.id === parseInt(theid));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!restaurant) {
      alert("Restaurante no encontrado");
      return;
    }

    if (!date) {
      alert("Por favor selecciona una fecha");
      return;
    }

    const success = await actions.createReservation(
      restaurant.id,
      date,
      time || null,
      people
    );
    
    if (success) {
      setDate("");
      setTime("");
      setPeople(2);
    }
  };

  useEffect(() => {
    actions.getInformationCurrentMember();
    actions.getRestaurantes();
  }, []);
  return (
    <>
      <div className="mt-2 m-auto central d-flex">
        <div
          className="d-flex m-auto"
          style={{
            height: "300px",

            width: "550px",
          }}
        >
          {" "}
          <img
            className="w-100"
            src={restaurant?.foto}
            alt=""
          />
        </div>
        <div></div>
        <div
          className="content m-auto"
          style={{
            borderStyle: " solid ",
            borderWidth: "3px",
            height: "300px",
            width: "550px",
            marginLeft: "1cm",
            borderColor: "rgb(255, 200, 67)",
            borderRadius: "20px",
          }}
        >
          <div className="offer">
            <h5>Precio medio del ticket: </h5>
            <strong className="">
              {restaurant?.precio} €
            </strong>
          </div>

          <div
            className="text-center informacion"
            style={{ marginLeft: "40px", marginTop: "40px" }}
          >
            <h4>
              <em>{restaurant?.nombre}</em>
            </h4>
            <hr className="w-50 m-auto" />
            <p className="mt-5 fs-4 text">
              {restaurant?.descripcion}
            </p>
          </div>
        </div>
      </div>
      {store.auth &&
      store.auth !== "" &&
      store.auth !== undefined &&
      localStorage.getItem("esUsuario") === "true" ? (
        <div className="mt-5 text-center m-auto w-75">
          <form onSubmit={handleSubmit}>
            <div className="row justify-content-center">
              <div className="col-md-3">
                <label className="form-label">Fecha</label>
                <input
                  className="form-control"
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
                  type="date"
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Hora (opcional)</label>
                <input
                  className="form-control"
                  onChange={(e) => setTime(e.target.value)}
                  value={time}
                  type="time"
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Personas</label>
                <input
                  className="form-control"
                  onChange={(e) => setPeople(e.target.value)}
                  value={people}
                  type="number"
                  min="1"
                  max="20"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-lg mt-3"
              style={{ backgroundColor: "rgb(255, 200, 67)", color: "black" }}
            >
              Hacer una reserva
            </button>
          </form>
        </div>
      ) : (
        ""
      )}

      {/* Mapa de ubicación */}
      <div className="container my-5">
        <div
          className="p-4"
          style={{
            backgroundColor: "rgb(247, 230, 173)",
            borderRadius: "15px",
          }}
        >
          <RestaurantMap
            latitud={restaurant?.latitud}
            longitud={restaurant?.longitud}
            nombre={restaurant?.nombre}
            direccion={restaurant?.direccion}
            ciudad={restaurant?.ciudad}
          />
        </div>
      </div>

      <div className="mt-5">
        <Reviews localId={parseInt(theid)} />
      </div>
      <div className="w-25 m-auto text-center">
        <Link className="" to="/restaurantes">
          <span
            className="mt-3 text-center btn "
            href="#"
            role="button"
            style={{ backgroundColor: "rgb(255, 200, 67)", color: "black" }}
          >
            Volver atrás
          </span>
        </Link>
      </div>
    </>
  );
};
