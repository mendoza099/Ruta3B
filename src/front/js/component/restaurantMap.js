import React from "react";

const RestaurantMap = ({ latitud, longitud, nombre, direccion, ciudad }) => {
  // Si no hay coordenadas, no mostrar el mapa
  if (!latitud || !longitud) {
    return (
      <div
        className="alert alert-info"
        style={{ backgroundColor: "rgb(247, 230, 173)" }}
      >
        <i className="bi bi-info-circle me-2"></i>
        No hay ubicación disponible para este restaurante
      </div>
    );
  }

  const lat = parseFloat(latitud);
  const lng = parseFloat(longitud);

  // URL para Google Maps (abre en nueva pestaña)
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  
  // URL para el iframe de OpenStreetMap
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="my-4">
      <h5 className="mb-3">
        <i className="bi bi-geo-alt-fill me-2"></i>
        Ubicación
      </h5>
      {direccion && (
        <div className="mb-3">
          <p className="mb-1">
            <strong>Dirección:</strong> {direccion}
          </p>
          {ciudad && (
            <p className="mb-0">
              <strong>Ciudad:</strong> {ciudad}
            </p>
          )}
        </div>
      )}
      
      {/* Mapa embebido de OpenStreetMap */}
      <div style={{ position: "relative", paddingBottom: "400px", height: 0, overflow: "hidden", borderRadius: "10px" }}>
        <iframe
          width="100%"
          height="400"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={osmUrl}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "2px solid #ffc843",
            borderRadius: "10px"
          }}
        ></iframe>
      </div>

      {/* Botones de acción */}
      <div className="mt-3 d-flex gap-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm"
          style={{ backgroundColor: "#ffc843", color: "#000" }}
        >
          <i className="bi bi-map me-2"></i>
          Ver en Google Maps
        </a>
        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm"
          style={{ backgroundColor: "white", color: "#000" }}
        >
          <i className="bi bi-globe me-2"></i>
          Ver en OpenStreetMap
        </a>
      </div>
    </div>
  );
};

export default RestaurantMap;
