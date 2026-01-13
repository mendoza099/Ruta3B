import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const CargaDeFoto = () => {
  const [uploadImages, setUploadImages] = useState("");
  const { store, actions } = useContext(Context);
  const actualizaFoto = (e) => {
    const id = store.profileRestaurante?.id;
    actions.añadirFoto(id);
    window.location.reload();
  };
  return (
    <div className="w-50 container text-center ">
      <div className="btn-foto mb-3">
        <h5>1r Paso:</h5>
        <input
          className="form-control input-foto bg-dark text-white"
          type="file"
          id="formFile"
          onChange={(e) => setUploadImages(e.target.files[0])}
        ></input>
      </div>
      <div className="m-auto d-flex">
        <div className="m-auto">
          <h5>2do Paso:</h5>
          <button
            style={{
              backgroundColor: "#667eea",
              color: "white",
            }}
            className=" btn"
            variant="contained"
            onClick={(e) => actions.uploadFile(uploadImages)}
          >
            Subir Foto
          </button>
          <h5>3r Paso:</h5>
          <button
            style={{
              backgroundColor: "#667eea",
              color: "white",
            }}
            className=" btn"
            onClick={(e) => {
              actualizaFoto();
            }}
          >
            Actualizar foto
          </button>
        </div>
      </div>
    </div>
  );
};
