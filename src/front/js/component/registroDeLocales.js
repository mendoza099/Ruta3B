import React, { useState, useContext, useEffect, useRef } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegistroDeLocales = () => {
  const [newNameLocal, setNewNameLocal] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDescripcion, setNewDescripcion] = useState("");
  const [newPago, setNewPago] = useState("");
  const [typeLocal, setTypeLocal] = useState("");
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  /***********************Verificación de contraseña************************ */
  const [cPassword, setCPassword] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [cPasswordClass, setCPasswordClass] = useState("form-control");
  const [isCPasswordDirty, setIsCPasswordDirty] = useState(false);

  useEffect(() => {
    if (isCPasswordDirty) {
      if (newPassword === cPassword) {
        setShowErrorMessage(false);
        setCPasswordClass("form-control is-valid");
      } else {
        setShowErrorMessage(true);
        setCPasswordClass("form-control is-invalid");
      }
    }
  }, [cPassword]);

  const handleCPassword = (e) => {
    setCPassword(e.target.value);
    setIsCPasswordDirty(true);
  };
  /************************************************ */

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (email)
    actions.RegistroLocales(
      newNameLocal,
      newEmail,
      newPassword,
      typeLocal,
      newDescripcion
    );
    navigate("/login");
    {
      Swal.fire({
        title: "¡ENHORABUENA!",
        html: "Ahora formas parte de la RUTA-3B'S",
        width: 600,
        padding: "3em",
        color: "#000000",
        confirmButtonColor: "#ffc843",
        icon: "success",
        backdrop: `
          rgba(255, 200, 67,0.3)
          
        `,
      });
    }
  };

  return (
    <div
      className="container"
      style={{
        width: "700px",
        marginTop: "2cm",
        backgroundColor: "rgb(247, 230, 173)",
        padding: "1cm",
        marginBottom: "150px",
        borderRadius: "15px",
      }}
    >
      {store.auth ? (
        <Navigate to="/restaurante" />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="p-1 " htmlFor="">
              Nombre
            </label>
            <input
              type="text"
              className="form-control"
              id="example1"
              aria-describedby="emailHelp"
              onChange={(e) => setNewNameLocal(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="p-1 " htmlFor="">
              Correo Electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="example3"
              aria-describedby="emailHelp"
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="p-1 " htmlFor="">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="example4"
              onChange={(e) => setNewPassword(e.target.value)}
              required
              value={newPassword}
            />
          </div>
          <div className="mb-3">
            <label className="p-1 form-label" htmlFor="">
              Repita su contraseña
            </label>
            <input
              type="password"
              className={cPasswordClass}
              id="example4"
              onChange={handleCPassword}
              required
            />
          </div>
          {showErrorMessage && isCPasswordDirty ? (
            <div> Las contraseñas no coinciden </div>
          ) : (
            ""
          )}
          <div className="mb-3 content-center">
            <h2>Que tipo de local deseas registrar?</h2>
            <div className="m-auto w-50 p-1 text-center d-flex row input-group mb-3">
              {/* <label className="p-1" htmlFor="">descripcion local</label>
          <input
            type="text"
            className="form-control"
            id="example4"
              onChange={(e) => setNewTipoDeLocal(e.target.value)}
          /> */}
              <div className="p-1 form-check">
                <input
                  className="p-0  w-0 form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="local-de-comida"
                  onChange={() => {
                    setTypeLocal("comida");
                  }}
                />
                <label className="form-check-label" htmlFor="local-de-comida">
                  Local de Comida
                </label>
              </div>
              <div className="p-1 form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="local-de-bebida"
                  onChange={() => {
                    setTypeLocal("bebida");
                  }}
                />
                <label className="form-check-label" htmlFor="local-de-bebida">
                  Local de Bebida
                </label>
              </div>
            </div>
          </div>
          <div className="mb-3 content-center">
            <label className="p-1" htmlFor="">
              Describeme un poco tu local
            </label>
            <input
              type="text"
              className="form-control"
              id="example6"
              aria-describedby="emailHelp"
              onChange={(e) => setNewDescripcion(e.target.value)}
              required
            />
          </div>
          <div className="text-center">
            {showErrorMessage && isCPasswordDirty == true ? (
              <button
                type="submit"
                className="disabled w-50 text-center btn"
                style={{ color: "black", backgroundColor: "white" }}
              >
                Registrar
              </button>
            ) : (
              <button
                type="submit"
                className="w-50 text-center btn"
                style={{ color: "black", backgroundColor: "white" }}
              >
                Registrar
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default RegistroDeLocales;
