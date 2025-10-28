import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import CardHome from "./../pages/cardHome.jsx";
import { CarruselCard } from "../component/carruserCard";
import Swal from "sweetalert2";
import "../../styles/user.css";
import "../../styles/loginError.css";

export const Usuario = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getFavorit();
    actions.getInformationCurrentMember();
    actions.getReservations();
  }, []);

  const verReservas = () => {
    // Filtrar solo reservas confirmadas
    const confirmedReservations = store.reservations.filter(r => r.status === 'confirmed');
    
    if (!confirmedReservations || confirmedReservations.length === 0) {
      Swal.fire({
        title: "Sin reservas",
        text: "No tienes reservas activas en este momento",
        icon: "info",
        confirmButtonColor: "#ffc843",
      });
      return;
    }
    
    // Crear HTML con todas las reservas
    const reservasHTML = confirmedReservations.map((reserva, index) => {
      const fecha = new Date(reserva.date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return `
        <div style="border: 2px solid #ffc843; padding: 15px; margin: 15px 0; border-radius: 10px; background-color: #fff;">
          <h4 style="color: #000; margin-bottom: 10px;">${reserva.local_name}</h4>
          <img src="${reserva.local_foto}" style="width: 100%; max-width: 300px; border-radius: 8px; margin: 10px 0;" />
          <p style="margin: 5px 0;"><strong>📅 Fecha:</strong> ${fecha}</p>
          ${reserva.time ? `<p style="margin: 5px 0;"><strong>🕐 Hora:</strong> ${reserva.time}</p>` : ''}
          <p style="margin: 5px 0;"><strong>👥 Personas:</strong> ${reserva.people}</p>
          ${reserva.notes ? `<p style="margin: 5px 0;"><strong>📝 Notas:</strong> ${reserva.notes}</p>` : ''}
          <button 
            onclick="window.cancelReservation(${reserva.id})" 
            class="btn btn-danger btn-sm mt-2"
            style="background-color: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;"
          >
            Cancelar Reserva
          </button>
        </div>
      `;
    }).join('');
    
    Swal.fire({
      title: `Mis Reservas (${confirmedReservations.length})`,
      html: reservasHTML,
      width: 800,
      confirmButtonColor: "#ffc843",
      confirmButtonText: "Cerrar"
    });
  };

  // Función global para cancelar reservas desde el modal
  window.cancelReservation = async (reservationId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres cancelar esta reserva?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffc843',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    });
    
    if (result.isConfirmed) {
      const success = await actions.cancelReservation(reservationId);
      if (success) {
        Swal.close();
        verReservas();
      }
    }
  };

  return (
    <>
      {store.auth &&
      store.auth !== "" &&
      store.auth !== undefined &&
      localStorage.getItem("esUsuario") === "true" ? (
        <div className="container-fluid">
          <div className="user">
            <div className="row mx-4">
              <div className="d-flex">
                <h1>
                  Ey, {store.profiles?.nombre} {store.profiles?.apellido}
                </h1>
              </div>

              <div className="col-10 congrats">
                <p>
                  Enhorabuena, {store.profiles?.nombre}! <br></br>
                  <br></br>A partir de ahora, eres miembro de la gran comunidad
                  RUTA 3B, donde podrás encontrar esos sitios que cumplen con
                  nuestra condición 3B, que sean buenos, bonitos y baratos en
                  esta gran ciudad. <br></br>
                  <br></br> No olvides dejar un comentario con tu experiencia y
                  una valoración, tu opinión es importante para nosotros y el
                  resto de la comunidad, además de participar en nuestro sorteo
                  sorpresa mensual.
                </p>
              </div>

              <div className="lineSeparating"></div>

              <div className="text-center">
                <button
                  onClick={verReservas}
                  type="button"
                  className=" btn  btn-sm h-50 m-3"
                  style={{
                    backgroundColor: "rgb(255, 200, 67)",
                    color: "black",
                  }}
                >
                  Ver mis reservas ({store.reservations.filter(r => r.status === 'confirmed').length})
                </button>
              </div>
              <div className="d-flex mx-auto">
                <div className="col-12">
                  <h2 className="text-center mx-auto">Mis sitios favoritos</h2>
                </div>
              </div>
              <CarruselCard />
            </div>
          </div>
        </div>
      ) : (
        <div className="div-err-login text-center">
          <h2>Primero debería registrarse!</h2>
          <button
            type="button"
            className="btn  btn-sm h-50 m-3"
            style={{
              backgroundColor: "rgb(255, 200, 67)",
              color: "black",
            }}
          >
            <Link
              className=" button-err"
              to="/"
              style={{
                backgroundColor: "rgb(255, 200, 67)",
                color: "black",
              }}
            >
              Volver al Inicio
            </Link>
          </button>
        </div>
      )}
    </>
  );
};
