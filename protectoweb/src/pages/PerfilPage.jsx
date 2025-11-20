// src/pages/PerfilPage.jsx
import React, { useState } from "react";
import "./PerfilPage.css";

export default function PerfilPage() {
  // Simulamos datos del usuario
  const [usuario] = useState({
    nombre: "André",
    nivel: 5,
    puntos: 1240,
  });

  const progreso = (usuario.puntos % 1000) / 10;

  return (
    <div className="perfil-container">
      <h2>Perfil de {usuario.nombre}</h2>
      <p><strong>Nivel:</strong> {usuario.nivel}</p>
      <p><strong>Puntos:</strong> {usuario.puntos}</p>

      <div className="barra-progreso">
        <div className="relleno" style={{ width: `${progreso}%` }}></div>
      </div>
      <p className="texto-progreso">
        Progreso hacia el siguiente nivel: {progreso.toFixed(1)}%
      </p>
    </div>
  );
}
