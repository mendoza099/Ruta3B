import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useFormspark } from "@formspark/use-formspark";
import Swal from "sweetalert2";

export const Contacto = () => {
  const { store, actions } = useContext(Context);

  const [submit, submitting] = useFormspark({
    formId: "vXF5Fe9t",
  });

  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    await submit({ name, email, message });
    Swal.fire({
      title: "¡RECIBIDO!",
      html: "Nos pondremos en contacto contigo lo antes posible",
      width: 600,
      padding: "3em",
      color: "#000000",
      confirmButtonColor: "#ffc843",
      icon: "success",
      backdrop: `
        rgba(255, 200, 67,0.3)
        
      `,
    });
  };

  return (
    <div className="container-fluid">
      {/* <!-- Wrapper container --> */}
      <div
        style={{
          backgroundColor: "rgb(255, 200, 67)",
          padding: "6rem",
        }}
        className="w-50 container py-4"
      >
        <h1 className="text-center mb-5">¿En qué podemos ayudarte?</h1>

        {/* <!-- Bootstrap 5 starter form --> */}
        <form onSubmit={onSubmit} className="" id="contactForm">
          {/* <!-- Name input --> */}
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              Nombre
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="name"
              type="text"
              required
            />
          </div>

          {/* <!-- Email address input --> */}
          <div className="mb-3">
            <label className="form-label" htmlFor="emailAddress">
              Correo Electrónico
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="emailAddress"
              type="email"
              required
            />
          </div>

          {/* <!-- Message input --> */}
          <div className="mb-3">
            <label className="form-label" htmlFor="message">
              En que podemos ayudarte?
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-control"
              id="message"
              type="text"
              required
            ></textarea>
          </div>

          {/* <!-- Form submit button --> */}
          <div className="d-grid">
            <button
              className="btn btn-outline-dark btn-lg"
              disabled={submitting}
              type="submit"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
      <br />
      {/* <Link to="/">
				<button className="btn btn-primary">Back home</button>
			</Link> */}
    </div>
  );
};
