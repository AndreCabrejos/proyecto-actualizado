// src/pages/PerfilPage.jsx
import React, { useState, useEffect } from "react";
import "./PerfilPage.css";

export default function PerfilPage({ currentUserEmail, currentUserName }) {
  const statsKey = currentUserEmail
    ? `viewerStats_${currentUserEmail}`
    : "viewerStats";

  const [viewerStats] = useState(() => {
    try {
      const saved = localStorage.getItem(statsKey);
      return saved ? JSON.parse(saved) : { nivel: 1, puntos: 0 };
    } catch {
      return { nivel: 1, puntos: 0 };
    }
  });

  const [viewerLevels, setViewerLevels] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/viewer-levels")
      .then((res) => res.json())
      .then((data) => setViewerLevels(data))
      .catch((err) => console.error("Error cargando viewerLevels:", err));
  }, []);


  const nivelActual =
    viewerStats.nivel && viewerStats.nivel > 0 ? viewerStats.nivel : 1;
  const puntosActuales = viewerStats.puntos || 0;

  const registroActual =
    viewerLevels.find((l) => l.nivel === nivelActual) || viewerLevels[0];

  const registroSiguiente = viewerLevels.find(
    (l) => l.nivel === nivelActual + 1
  );

  let porcentaje = 0;
  let puntosFaltantes = 0;
  let siguienteNivelNumero = null;

  if (registroActual && registroSiguiente) {
    const base = registroActual.puntos_requeridos;
    const objetivo = registroSiguiente.puntos_requeridos;
    const rango = Math.max(objetivo - base, 1);
    const progresoNivel = Math.max(puntosActuales - base, 0);

    porcentaje = Math.min((progresoNivel / rango) * 100, 100);
    puntosFaltantes = Math.max(objetivo - puntosActuales, 0);
    siguienteNivelNumero = registroSiguiente.nivel;
  } else if (registroActual && !registroSiguiente) {
    porcentaje = 100;
    puntosFaltantes = 0;
  }

  const nombreMostrar = currentUserName || currentUserEmail || "Viewer";

  return (
    <div className="perfil-container">
      <h2>Perfil de {nombreMostrar}</h2>

      <p>
        <strong>Nivel actual:</strong> {nivelActual}
      </p>
      <p>
        <strong>Puntos totales:</strong>{" "}
        {puntosActuales.toLocaleString("es-PE")}
      </p>

      {siguienteNivelNumero ? (
        <p className="texto-avance">
          Te faltan <strong>{puntosFaltantes}</strong> puntos para el nivel{" "}
          <strong>{siguienteNivelNumero}</strong>.
        </p>
      ) : (
        <p className="texto-avance">
          ¡Has alcanzado el nivel máximo configurado!
        </p>
      )}

      <div className="barra-progreso">
        <div className="relleno" style={{ width: `${porcentaje}%` }}></div>
      </div>

      <p className="texto-progreso">
        Progreso hacia el siguiente nivel: {porcentaje.toFixed(1)}%
      </p>
    </div>
  );
}
