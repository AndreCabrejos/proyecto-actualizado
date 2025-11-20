import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

// Definición de niveles
const niveles = [
  { nivel: 1, xp_min: 0 },
  { nivel: 2, xp_min: 100 },
  { nivel: 3, xp_min: 300 },
  { nivel: 4, xp_min: 600 },
  { nivel: 5, xp_min: 1000 },
  { nivel: 6, xp_min: 1500 },
  { nivel: 7, xp_min: 2100 },
];

export default function Header({
  isLoggedIn,
  userRole,
  onLoginClick,
  onLogoutClick,
  onRecargarClick,
  monedas,
  puntos = 1200,
}) {
  const [perfilVisible, setPerfilVisible] = useState(false);
  const navigate = useNavigate();

  // Calcular nivel actual
  let nivelActual = niveles[0];
  let siguienteNivel = null;

  for (let i = 0; i < niveles.length; i++) {
    if (puntos >= niveles[i].xp_min) {
      nivelActual = niveles[i];
      siguienteNivel = niveles[i + 1] || null;
    } else {
      break;
    }
  }

  const xpDesdeNivelActual = puntos - nivelActual.xp_min;
  const tramoNivel = siguienteNivel
    ? siguienteNivel.xp_min - nivelActual.xp_min
    : 1;
  const porcentaje = siguienteNivel
    ? Math.min((xpDesdeNivelActual / tramoNivel) * 100, 100)
    : 100;

  const puntosFaltantes = siguienteNivel ? siguienteNivel.xp_min - puntos : 0;

  return (
    <header className="main-header">
      <h1 className="logo">🎥 Streamoria</h1>

      <nav className="nav-links-right">
        <Link to="/">Inicio</Link>
        <Link to="/nosotros">Nosotros</Link>
        <Link to="/tyc">TyC</Link>

        {isLoggedIn ? (
          <>
            {/* Botón monedas */}
            <button
              className="btn-monedas"
              onClick={() => navigate("/comprar")}
            >
              🪙 {monedas}
            </button>

            {/* Botón perfil */}
            <button
              className="btn-perfil"
              onClick={() => setPerfilVisible(true)}
            >
              👤
            </button>
          </>
        ) : (
          <button onClick={onLoginClick} className="btn-login">
            Iniciar sesión
          </button>
        )}

        {/* Si el usuario es viewer → botón recargar */}
        {isLoggedIn && userRole === "viewer" && (
          <button className="btn-recargar" onClick={onRecargarClick}>
            Recargar
          </button>
        )}
      </nav>

      {/* MODAL DE PERFIL */}
      {perfilVisible && (
        <div className="perfil-modal">
          <div className="perfil-contenido">
            <h3>Mi Perfil</h3>
            <p>
              <strong>Nivel:</strong> {nivelActual.nivel}
            </p>
            <p>
              <strong>Puntos:</strong> {puntos}
            </p>

            {siguienteNivel ? (
              <p className="texto-avance">
                Te faltan <strong>{puntosFaltantes}</strong> puntos para el
                nivel <strong>{siguienteNivel.nivel}</strong>.
              </p>
            ) : (
              <p className="texto-avance">¡Has alcanzado el nivel máximo!</p>
            )}

            <div className="barra-progreso">
              <div
                className="progreso"
                style={{ width: `${porcentaje}%` }}
              ></div>
            </div>

            <p className="texto-progreso">
              Progreso hacia el siguiente nivel: {porcentaje.toFixed(1)}%
            </p>

            {/* Botón cerrar sesión dentro del modal */}
            <button
              className="cerrar-perfil"
              onClick={() => {
                setPerfilVisible(false);
                onLogoutClick();
              }}
            >
              Cerrar sesión
            </button>

            {/* Botón para cerrar solo el modal */}
            <button
              className="cerrar-modal"
              onClick={() => setPerfilVisible(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
