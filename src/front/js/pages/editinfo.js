import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const EditInfo = () => {
  const { store, actions } = useContext(Context);

  const [nombre, setNombre] = useState("");
  const [tipo_local, setTipo_local] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const editInfo = (e) => {
    e.preventDefault();
    const id = store.profileRestaurante?.id;
    console.log(id);
    actions.modificarDatos(id, nombre, tipo_local, descripcion);
  };
  useEffect(() => {
    // actions.getFavorit();
    actions.getInformationCurrentRestaurant();
  }, []);

  console.log(store.profileRestaurante?.id);
  return (
    <>
      {store.auth &&
      store.auth != "" &&
      store.auth != undefined &&
      localStorage.getItem("esLocal") ? (
        <div className="text-center">
          <form action="" onSubmit={editInfo}>
            <div
              style={{
                backgroundColor: "#667eea",
                padding: "6rem",
              }}
              className="w-50 container py-4 pt-2 row w-25 m-auto text-center"
            >
              <label htmlFor="">Nombre</label>
              <input
                className="mt-2"
                type="text"
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <label htmlFor=" ">Tipo de local</label>
              <input
                onChange={(e) => setTipo_local(e.target.value)}
                className="mt-2"
                type="text"
                required
              />
              <label htmlFor="">Nueva descripción</label>
              <input
                onChange={(e) => setDescripcion(e.target.value)}
                className="mt-2"
                type="text"
                required
              />
            </div>
            <div className="mt-2 text-center ">
              <button
                onClick={() => window.location.reload()}
                type="submit"
                style={{
                  backgroundColor: "#667eea",
                  color: "white",
                }}
                className="mt-1 btn"
              >
                Modificar Datos
              </button>
            </div>
          </form>
          <div className=" mt-5">
            <Link
              type="button"
              className="btn  btn-sm h-50 m-3"
              style={{
                backgroundColor: "#667eea",
                color: "white",
              }}
              to="/restaurante"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      ) : (
        <div className="div-err-login text-center">
          <h2>Primero debería registrarse!</h2>
          <button
            type="button"
            className="btn  btn-sm h-50 m-3"
            style={{
              backgroundColor: "#667eea",
              color: "white",
            }}
          >
            <Link className=" button-err" to="/">
              Volver al Inicio
            </Link>
          </button>
        </div>
      )}
    </>
  );
};
