// src/pages/PerfilPage.jsx
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import "./PerfilPage.css";

export default function PerfilPage() {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>No has iniciado sesión</p>;

  const puntos = user.puntos ?? 0;
  const nivel = user.nivel ?? 1;

  // Niveles reales (desde tu backend)
  const niveles = [
    { nivel: 1, xp_min: 0 },
    { nivel: 2, xp_min: 100 },
    { nivel: 3, xp_min: 300 },
    { nivel: 4, xp_min: 700 },
  ];

  let nivelActual = niveles[0];
  let siguienteNivel = null;

  for (let i = 0; i < niveles.length; i++) {
    if (puntos >= niveles[i].xp_min) {
      nivelActual = niveles[i];
      siguienteNivel = niveles[i + 1] || null;
    } else break;
  }

  const xpDesdeNivel = puntos - nivelActual.xp_min;
  const tramo = siguienteNivel ? siguienteNivel.xp_min - nivelActual.xp_min : 1;

  const porcentaje = siguienteNivel
    ? Math.min((xpDesdeNivel / tramo) * 100, 100)
    : 100;

  const faltante = siguienteNivel ? siguienteNivel.xp_min - puntos : 0;

  return (
    <div className="perfil-container">
      <h2>Perfil de {user.username}</h2>

      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>

      <p><strong>Nivel:</strong> {nivelActual.nivel}</p>
      <p><strong>Puntos:</strong> {puntos}</p>

      {siguienteNivel ? (
        <p className="texto-avance">
          Te faltan <strong>{faltante}</strong> puntos para nivel{" "}
          <strong>{siguienteNivel.nivel}</strong>.
        </p>
      ) : (
        <p className="texto-avance">¡Has alcanzado el nivel máximo!</p>
      )}

      <div className="barra-progreso">
        <div className="relleno" style={{ width: `${porcentaje}%` }}></div>
      </div>

      <p className="texto-progreso">
        Progreso hacia el siguiente nivel: {porcentaje.toFixed(1)}%
      </p>

      <p className="saldo">
        💰 Monedas disponibles: <strong>{user.monedas}</strong>
      </p>
    </div>
  );
}


