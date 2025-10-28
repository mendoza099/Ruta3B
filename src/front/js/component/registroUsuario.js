import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegistroUsuario = () => {
  const [newName, setNewName] = useState("");
  const [newApellido, setNewApellido] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // if (email)
  //   actions.RegistroLocales(newNameLocal,newEmail,newPassword,typeLocal,newDescripcion);
  //   navigate("/login");
  //   {
  //     Swal.fire("Buen trabajo!", "Te has registrado correctamente!", "success");
  //   }
  // };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    actions.registroUsuario(newName, newApellido, newEmail, newPassword);
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
    <>
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
          <Navigate to="/login" />
        ) : (
          <form onSubmit={handleSubmit2}>
            <div className="mb-3">
              <label className="p-1 " htmlFor="">
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                aria-describedby="emailHelp"
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="p-1 " htmlFor="">
                Apellido
              </label>
              <input
                type="text"
                className="form-control"
                aria-describedby="emailHelp"
                onChange={(e) => setNewApellido(e.target.value)}
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
                onChange={(e) => setNewPassword(e.target.value)}
                required
                value={newPassword}
              />
            </div>
            <div className="mb-3">
              <label className=" form-label" htmlFor="">
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
              <div className="p-3"> Las contraseñas no coinciden </div>
            ) : (
              ""
            )}

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
    </>
  );
};

export default RegistroUsuario;
