import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/perfilRestaurante.css";
import { CargaDeFoto } from "../component/cargaDeFoto";
import RestaurantMap from "../component/restaurantMap";

export const Restaurante = () => {
  const { store, actions } = useContext(Context);

  const [precio, setPrecio] = useState("");
  const [foto, setFoto] = useState("");
  const [priceUpdated, setPriceUpdated] = useState(false);

  const handleSubmitPrice = async (e) => {
    e.preventDefault();
    const id = store.profileRestaurante?.id;
    await actions.añadirPrecio(id, precio);
    setPriceUpdated(true);
    // Refresh profile data
    actions.getInformationCurrentRestaurant();
  };

  useEffect(() => {
    actions.getInformationCurrentRestaurant();
  }, []);

  useEffect(() => {
    if (priceUpdated) {
      setPriceUpdated(false);
      setPrecio("");
    }
  }, [store.profileRestaurante]);

  return (
    <>
      {store.auth &&
      store.auth !== "" &&
      store.auth !== undefined &&
      localStorage.getItem("esLocal") === "true" ? (
        <div className="m-4 p-2">
          <div
            className="m-auto mb-4 container"
            style={{
              marginRight: "100px",
              marginLeft: "50px",
              backgroundColor: "rgb(255, 200, 67)",
              padding: "2cm",
            }}
          >
            <p>
              Enhorabuena <strong>{store.profileRestaurante?.nombre} </strong>!{" "}
              <br></br>A partir de ahora, eres miembro de la gran comunidad que
              conforma la RUTA 3B, donde podrás exponer de forma simple y rapida
              tus servicios y promociones basadosa en nuestra politica 3B
              "Bueno, Bonito y Barato". No tengas miedo.! por muy pequeño que
              seas y aunque no te encuentres en el centro de la ciudad, nosotros
              te ayudamos a ofrecer tus servicios, porque a todos nos gusta ir
              de copas junto a un buen tapeo, comer bien a un precio justo y por
              supuesto, conocer locales nuevos que se esconden en los barrios y
              sus infinitas calles que conforman esta hermosa ciudad. No olvides
              subir fotos de tu local, mostrar la carta, promociones que tengas
              y decirnos que te distingue del resto en una breve descripción.
            </p>

            <a
              className="link"
              aria-current="page"
              href="/sobre-nosotros"
              style={{ marginTop: "4cm" }}
            >
              {" "}
              Nuestra politica{" "}
            </a>
          </div>
          <div className="w-75 m-auto card mb-3">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={store.profileRestaurante?.foto}
                  className="img-fluid rounded-start"
                  alt="..."
                />
                <div style={{ maxHeight: "200px" }} className="d-flex">
                  <CargaDeFoto />
                </div>
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h2 className="mt-3 text-center card-title">
                    {store.profileRestaurante?.nombre}
                  </h2>
                  <hr />
                  <p className="card-text">
                    {store.profileRestaurante?.descripcion}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-50 m-auto text-center">
              <Link
                type="button"
                style={{
                  backgroundColor: "rgb(255, 200, 67)",
                  color: "black",
                }}
                className="btn  btn-sm m-3 "
                to="/editInfo"
              >
                Editar Info
              </Link>
            </div>
          </div>
          <div className="m-auto w-50">
            <div className="text-center  m-auto w-50">
              <form action="" onSubmit={handleSubmitPrice}>
                {store.profileRestaurante?.precio > 1 ? (
                  <div>
                    <strong>
                      Ya has introducido el precio del ticket medio:{" "}
                      {store.profileRestaurante?.precio} €
                    </strong>
                    <p>Quieres establecer otro valor?</p>
                    <input
                      className=""
                      type="number"
                      id="precio"
                      name="precio"
                      onChange={(e) => setPrecio(e.target.value)}
                    />
                    <br />
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "rgb(255, 200, 67)",
                        color: "black",
                      }}
                      className=" mt-1 btn"
                    >
                      Añadir Precio
                    </button>
                  </div>
                ) : (
                  <div>
                    <h5>
                      Deberías introducir el precio medio del ticket para que
                      los usuarios lo vean!
                    </h5>

                    <label className="" htmlFor="Name">
                      Introduce el precio medio del ticket:
                    </label>
                    <div className="m-auto ">
                      <div className=" ">
                        <input
                          onChange={(e) => setPrecio(e.target.value)}
                          className=""
                          type="number"
                          id="precio"
                          name="precio"
                        />
                        <span className="border border-dark p-1 m-1">€</span>
                      </div>
                      <button
                        type="submit"
                        style={{
                          backgroundColor: "rgb(255, 200, 67)",
                          color: "black",
                        }}
                        className=" mt-1 btn"
                      >
                        Añadir Precio
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Mapa de ubicación */}
          <div className="container my-4">
            <div
              className="p-4"
              style={{
                backgroundColor: "rgb(247, 230, 173)",
                borderRadius: "15px",
              }}
            >
              <RestaurantMap
                latitud={store.profileRestaurante?.latitud}
                longitud={store.profileRestaurante?.longitud}
                nombre={store.profileRestaurante?.nombre}
                direccion={store.profileRestaurante?.direccion}
                ciudad={store.profileRestaurante?.ciudad}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center p-5">
            <div
              id="carouselExampleIndicators"
              className="carousel slide w-50"
              data-bs-ride="true"
            >
              <div className="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src="https://media-cdn.tripadvisor.com/media/photo-s/1c/1b/7b/13/area-interna.jpg"
                    className="d-block w-100"
                    alt="..."
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://www.laguiago.com/wp-content/uploads/2020/12/RESTAURANTE-ALMA-MATER-7-scaled-1.jpg"
                    className="d-block w-100"
                    alt="..."
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://www.hoteles-silken.com/content/imgsxml/galerias/panel_sliderheaderhotel/1/t-restaurante-etxaniz-015971.jpg"
                    className="d-block w-100"
                    alt="..."
                  />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>

          {/* <div className="card-group">
            <div className="card">
              <img
                src="https://media-cdn.tripadvisor.com/media/photo-s/1c/1b/7b/13/area-interna.jpg"
                className="card-img-top"
                alt="..."
              />
            </div>
            <div className="card">
              <img
                src="https://www.laguiago.com/wp-content/uploads/2020/12/RESTAURANTE-ALMA-MATER-7-scaled-1.jpg"
                className="card-img-top"
                alt="..."
              />
            </div>
            <div className="card">
              <img
                src="https://www.hoteles-silken.com/content/imgsxml/galerias/panel_sliderheaderhotel/1/t-restaurante-etxaniz-015971.jpg"
                className="card-img-top"
                alt="..."
              />
            </div>
          </div> */}
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
            <Link className=" button-err" to="/">
              Volver al Inicio
            </Link>
          </button>
        </div>
      )}
    </>
  );
};
