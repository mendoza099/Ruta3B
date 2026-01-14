import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/recomendaciones.css";

export const Recomendaciones = () => {
  const { store, actions } = useContext(Context);
  const especificaciones = {
    id: 1,
    nombre: "Nombre :",
    ubicacion: "Ubicaion :",
    estado: "Estado :  ",
    valoracion: "Valoracion :",
   
  };
  return (
    <>
      
        
        <h2 style={{ marginLeft: "470px",marginTop:"1cm" }}>Copas y Tapeo con las 3B : </h2>
       <div id="container">
        <div className="grupos-card d-flex" style={{marginTop:"34px"}}>
        <div className="card" style={{width: "4.5cm",marginLeft:"6cm",fontSize:"14px"}}>
          <img src="https://d500.epimg.net/cincodias/imagenes/2021/01/07/lifestyle/1610013278_270303_1610013536_noticia_normal.jpg" className="card-img-top" alt="..." />
          <div className="card-body">
            <p className="card-text">
             {especificaciones.nombre}<br></br>{especificaciones.ubicacion}<br></br>{especificaciones.estado}<br></br>{especificaciones.valoracion}
            </p>
          </div>
        </div>
        <div className="card" style={{width: "4.5cm",marginLeft:"1cm",fontSize:"14px"}}>
          <img src="https://d500.epimg.net/cincodias/imagenes/2021/01/07/lifestyle/1610013278_270303_1610013536_noticia_normal.jpg" className="card-img-top" alt="..." />
          <div className="card-body">
            <p className="card-text">
             {especificaciones.nombre}<br></br>{especificaciones.ubicacion}<br></br>{especificaciones.estado}<br></br>{especificaciones.valoracion}
            </p>
          </div>
        </div>
        <div className="card" style={{width: "4.5cm",marginLeft:"1cm",fontSize:"14px"}}>
          <img src="https://d500.epimg.net/cincodias/imagenes/2021/01/07/lifestyle/1610013278_270303_1610013536_noticia_normal.jpg" className="card-img-top" alt="..." />
          <div className="card-body">
            <p className="card-text">
             {especificaciones.nombre}<br></br>{especificaciones.ubicacion}<br></br>{especificaciones.estado}<br></br>{especificaciones.valoracion}
            </p>
          </div>
        </div>
        <div className="card" style={{width: "4.5cm",marginLeft:"1cm",fontSize:"14px"}}>
          <img src="https://d500.epimg.net/cincodias/imagenes/2021/01/07/lifestyle/1610013278_270303_1610013536_noticia_normal.jpg" className="card-img-top" alt="..." />
          <div className="card-body">
            <p className="card-text">
             {especificaciones.nombre}<br></br>{especificaciones.ubicacion}<br></br>{especificaciones.estado}<br></br>{especificaciones.valoracion}
            </p>
          </div>
        </div>   
      </div>
      </div>



      
      <h2 style={{ marginLeft: "470px",marginTop:"80px" }}>Vamos a comer con las 3B : </h2>
        <div className="grupo-card d-flex" style={{marginTop:"34px",marginBottom:"2cm"}}>
        <div className="card" style={{width: "4.5cm",marginLeft:"6cm",fontSize:"14px"}}>
          <img src="https://d500.epimg.net/cincodias/imagenes/2021/01/07/lifestyle/1610013278_270303_1610013536_noticia_normal.jpg" className="card-img-top" alt="..." />
          <div className="card-body">
            <p className="card-text">
             {especificaciones.nombre}<br></br>{especificaciones.ubicacion}<br></br>{especificaciones.estado}<br></br>{especificaciones.valoracion}
            </p>
          </div>
        </div>
        <div className="card" style={{width: "4.5cm",marginLeft:"1cm",fontSize:"14px"}}>
          <img src="https://d500.epimg.net/cincodias/imagenes/2021/01/07/lifestyle/1610013278_270303_1610013536_noticia_normal.jpg" className="card-img-top" alt="..." />
          <div className="card-body">
            <p className="card-text">
             {especificaciones.nombre}<br></br>{especificaciones.ubicacion}<br></br>{especificaciones.estado}<br></br>{especificaciones.valoracion}
            </p>
          </div>
        </div>
        <div className="card" style={{width: "4.5cm",marginLeft:"1cm",fontSize:"14px"}}>
          <img src="https://d500.epimg.net/cincodias/imagenes/2021/01/07/lifestyle/1610013278_270303_1610013536_noticia_normal.jpg" className="card-img-top" alt="..." />
          <div className="card-body">
            <p className="card-text">
             {especificaciones.nombre}<br></br>{especificaciones.ubicacion}<br></br>{especificaciones.estado}<br></br>{especificaciones.valoracion}
            </p>
          </div>
        </div>
        <div className="card" style={{width: "4.5cm",marginLeft:"1cm",fontSize:"14px"}}>
          <img src="https://d500.epimg.net/cincodias/imagenes/2021/01/07/lifestyle/1610013278_270303_1610013536_noticia_normal.jpg" className="card-img-top" alt="..." />
          <div className="card-body">
            <p className="card-text">
             {especificaciones.nombre}<br></br>{especificaciones.ubicacion}<br></br>{especificaciones.estado}<br></br>{especificaciones.valoracion}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
