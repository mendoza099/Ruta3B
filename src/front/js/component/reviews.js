import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";

export const Reviews = ({ localId }) => {
  const { store, actions } = useContext(Context);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 0, ratings: {} });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [localId]);

  const loadReviews = async () => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/reviews/${localId}`
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/reviews/stats/${localId}`
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!localStorage.getItem("token")) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para dejar una reseña",
        icon: "warning",
        confirmButtonColor: "#ffc843",
        backdrop: `rgba(255, 200, 67, 0.3)`,
      });
      return;
    }

    if (comment.trim().length < 10) {
      Swal.fire({
        title: "Comentario muy corto",
        text: "El comentario debe tener al menos 10 caracteres",
        icon: "warning",
        confirmButtonColor: "#ffc843",
        backdrop: `rgba(255, 200, 67, 0.3)`,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          local_id: localId,
          rating: rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "¡Gracias!",
          text: "Tu reseña ha sido publicada",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: "#ffc843",
          backdrop: `rgba(255, 200, 67, 0.3)`,
        });
        setComment("");
        setRating(5);
        loadReviews();
        loadStats();
      } else {
        Swal.fire({
          title: "Error",
          text: data.message || "No se pudo publicar la reseña",
          icon: "error",
          confirmButtonColor: "#ffc843",
          backdrop: `rgba(255, 200, 67, 0.3)`,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Error de conexión. Intenta de nuevo.",
        icon: "error",
        confirmButtonColor: "#ffc843",
        backdrop: `rgba(255, 200, 67, 0.3)`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    const result = await Swal.fire({
      title: "¿Eliminar reseña?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#ffc843",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      backdrop: `rgba(255, 200, 67, 0.3)`,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/reviews/${reviewId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          Swal.fire({
            title: "Eliminada",
            text: "Tu reseña ha sido eliminada",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            confirmButtonColor: "#ffc843",
            backdrop: `rgba(255, 200, 67, 0.3)`,
          });
          loadReviews();
          loadStats();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const renderStars = (count, interactive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const isFilled = interactive
        ? starValue <= (hoveredStar || rating)
        : starValue <= count;

      return (
        <span
          key={index}
          style={{
            cursor: interactive ? "pointer" : "default",
            fontSize: interactive ? "2rem" : "1.2rem",
            color: isFilled ? "#ffc843" : "#ddd",
            transition: "color 0.2s",
          }}
          onClick={() => interactive && setRating(starValue)}
          onMouseEnter={() => interactive && setHoveredStar(starValue)}
          onMouseLeave={() => interactive && setHoveredStar(0)}
        >
          ★
        </span>
      );
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const currentUserEmail = localStorage.getItem("token")
    ? JSON.parse(atob(localStorage.getItem("token").split(".")[1])).sub
    : null;

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <h3 className="mb-4">Reseñas y Opiniones</h3>

          {/* Estadísticas */}
          {stats.total > 0 && (
            <div
              className="card mb-4"
              style={{ backgroundColor: "rgb(247, 230, 173)" }}
            >
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-4 text-center">
                    <h1 className="display-3 mb-0">{stats.average}</h1>
                    <div>{renderStars(Math.round(stats.average))}</div>
                    <p className="text-muted mb-0">
                      {stats.total} {stats.total === 1 ? "reseña" : "reseñas"}
                    </p>
                  </div>
                  <div className="col-md-8">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="d-flex align-items-center mb-2">
                        <span style={{ width: "30px" }}>{star} ★</span>
                        <div
                          className="progress flex-grow-1 mx-2"
                          style={{ height: "10px" }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: `${
                                stats.total > 0
                                  ? (stats.ratings[star] / stats.total) * 100
                                  : 0
                              }%`,
                              backgroundColor: "#ffc843",
                            }}
                          ></div>
                        </div>
                        <span style={{ width: "40px", textAlign: "right" }}>
                          {stats.ratings[star] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulario para nueva reseña */}
          <div
            className="card mb-4"
            style={{ backgroundColor: "rgb(255, 200, 67)" }}
          >
            <div className="card-body">
              <h5 className="card-title">Deja tu reseña</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Calificación</label>
                  <div>{renderStars(rating, true)}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Comentario</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Cuéntanos sobre tu experiencia..."
                    disabled={isLoading}
                    required
                  ></textarea>
                  <small className="text-muted">
                    Mínimo 10 caracteres ({comment.length}/10)
                  </small>
                </div>
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "white" }}
                  disabled={isLoading || comment.length < 10}
                >
                  {isLoading ? "Publicando..." : "Publicar Reseña"}
                </button>
              </form>
            </div>
          </div>

          {/* Lista de reseñas */}
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <div className="text-center text-muted py-5">
                <p>Aún no hay reseñas. ¡Sé el primero en dejar una!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="card mb-3"
                  style={{ backgroundColor: "rgb(247, 230, 173)" }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{review.user_name}</h6>
                        <div className="mb-2">{renderStars(review.rating)}</div>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">
                          {formatDate(review.created_at)}
                        </small>
                        {currentUserEmail &&
                          review.user_id ===
                            store.profiles?.id && (
                            <button
                              className="btn btn-sm btn-link text-danger p-0 ms-2"
                              onClick={() => handleDelete(review.id)}
                            >
                              Eliminar
                            </button>
                          )}
                      </div>
                    </div>
                    <p className="mb-0 mt-2">{review.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
