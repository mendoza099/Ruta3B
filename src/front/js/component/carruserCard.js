import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useParams } from "react-router-dom";
import "../../styles/home.css";
import { CardHome } from "../pages/cardHome.jsx";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";

export const CarruselCard = (args) => {
  const { store, actions } = useContext(Context);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  
  const next = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === store.likes.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const nada = [
    {
      src: "http://websinergia.com.mx/blog/wp-content/uploads/2017/05/1472573705.jpg",
      id: 1,
    },
    {
      src: "http://websinergia.com.mx/blog/wp-content/uploads/2017/05/1472573705.jpg",
      id: 2,
    },
  ];

  const previous = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === 0 ? store.likes.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = store.likes.map((item, index) => (
    <CarouselItem
      onExiting={() => setAnimating(true)}
      onExited={() => setAnimating(false)}
      key={item.id}
    >
      <CardHome key={item.id} nombre={item.nombre} id={item.id} tipo_local={item.tipo_local}
      descripcion={item.descripcion}
      foto={item.foto}/>
    </CarouselItem>
  ));

  // const nuevoNada = nada.map((item, index) => (
  //   <CarouselItem
  //     onExiting={() => setAnimating(true)}
  //     onExited={() => setAnimating(false)}
  //     key={item.id}
  //   >
  //     <img src={item.src} alt={item.altText} />
  //   </CarouselItem>
  // ));

  return (
    <>
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
        {...args}
      >
        <CarouselIndicators
          items={store.likes.length > 0 ? store.likes : []}
          activeIndex={activeIndex}
          onClickHandler={goToIndex}
        />
        {slides}
        <CarouselControl
          direction="prev"
          directionText="Previous"
          onClickHandler={previous}
        />
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={next}
        />
      </Carousel>
      {/* <div className="d-flex justify-content-center p-5">
        <div
          id="carouselExampleIndicators"
          className="carousel slide w-75"
          data-bs-ride="true"
        >
          <div className="carousel-indicators">
            {store.likes.length > 0
              ? store.likes.map((item, index) => {
                  return index === 0 ? (
                    <button
                      key={item.id}
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to={index}
                      className="active"
                      aria-current="true"
                      aria-label={"Slide " + index + 1}
                    ></button>
                  ) : (
                    <button
                      key={item.id}
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to={index}
                      aria-label={"Slide " + index + 1}
                    ></button>
                  );
                })
              : null}
          </div>
          <div className="carousel-inner">
            {store.likes.length > 0
              ? store.likes.map((item, index) => {
                  return index === 0 ? (
                    <div key={item.id} className="carousel-item active">
                      <CardHome
                        key={item.id}
                        nombre={item.nombre}
                        id={item.id}
                      />
                    </div>
                  ) : (
                    <div key={item.id} className="carousel-item">
                      <CardHome
                        key={item.id}
                        nombre={item.nombre}
                        id={item.id}
                      />
                    </div>
                  );
                })
              : null}
            
            <div className="carousel-item">
              
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
      </div> */}
    </>
  );
};
