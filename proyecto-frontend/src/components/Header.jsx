import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import viewerLevelsData from "../data/viewerLevels.json";

export default function Header({
  isLoggedIn,
  userRole,
  onLoginClick,
  onLogoutClick,
  monedas,
  currentUserEmail,
  currentUserName,
}) {
  const [perfilVisible, setPerfilVisible] = useState(false);
  const [viewerStats, setViewerStats] = useState({
    nivel: 1,
    puntos: 0,
  });

  const navigate = useNavigate();

  const statsKey = currentUserEmail
    ? `viewerStats_${currentUserEmail}`
    : "viewerStats";

  // Nombre que se mostrará en el modal de perfil
  const nombreMostrar = currentUserName || currentUserEmail || "Viewer";

  // Cuando se abre el modal, leemos los stats actuales del viewer
  const abrirPerfil = () => {
    if (userRole === "viewer") {
      try {
        const saved = localStorage.getItem(statsKey);
        const stats = saved ? JSON.parse(saved) : { nivel: 1, puntos: 0 };
        setViewerStats(stats);
      } catch {
        setViewerStats({ nivel: 1, puntos: 0 });
      }
    }
    setPerfilVisible(true);
  };

  // ----- Cálculo de nivel y barra SOLO para viewer -----
  let nivelMostrar = 1;
  let puntosMostrar = 0;
  let porcentaje = 0;
  let puntosFaltantes = 0;
  let siguienteNivelNumero = null;

  if (userRole === "viewer") {
    const nivelActual =
      viewerStats.nivel && viewerStats.nivel > 0 ? viewerStats.nivel : 1;
    const puntosActuales = viewerStats.puntos || 0;

    const registroActual =
      viewerLevelsData.find((l) => l.nivel === nivelActual) ||
      viewerLevelsData[0];

    const registroSiguiente = viewerLevelsData.find(
      (l) => l.nivel === nivelActual + 1
    );

    nivelMostrar = registroActual.nivel;
    puntosMostrar = puntosActuales;

    if (registroSiguiente) {
      const base = registroActual.puntos_requeridos; // puntos al inicio de este nivel
      const objetivo = registroSiguiente.puntos_requeridos; // puntos para el sig. nivel
      const rango = Math.max(objetivo - base, 1);
      const progresoNivel = Math.max(puntosActuales - base, 0);

      porcentaje = Math.min((progresoNivel / rango) * 100, 100);
      puntosFaltantes = Math.max(objetivo - puntosActuales, 0);
      siguienteNivelNumero = registroSiguiente.nivel;
    } else {
      // No hay siguiente nivel: estás al máximo
      porcentaje = 100;
      puntosFaltantes = 0;
      siguienteNivelNumero = null;
    }
  }

  return (
    <header className="main-header">
      {/* Logo que lleva al home */}
      <h1
        className="logo"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        🎥 Streamoria
      </h1>

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
            <button className="btn-perfil" onClick={abrirPerfil}>
              👤
            </button>
          </>
        ) : (
          <button onClick={onLoginClick} className="btn-login">
            Iniciar sesión
          </button>
        )}
      </nav>

      {/* MODAL DE PERFIL */}
      {perfilVisible && (
        <div className="perfil-modal">
          <div className="perfil-contenido">
            {/* X arriba a la derecha */}
            <button
              className="cerrar-modal"
              onClick={() => setPerfilVisible(false)}
            >
              ✖
            </button>

            <h3>Perfil de {nombreMostrar}</h3>

            {userRole === "viewer" ? (
              <>
                <p>
                  <strong>Nivel:</strong> {nivelMostrar}
                </p>
                <p>
                  <strong>Puntos:</strong> {puntosMostrar}
                </p>

                {siguienteNivelNumero ? (
                  <p className="texto-avance">
                    Te faltan <strong>{puntosFaltantes}</strong> puntos para el
                    nivel <strong>{siguienteNivelNumero}</strong>.
                  </p>
                ) : (
                  <p className="texto-avance">
                    ¡Has alcanzado el nivel máximo configurado!
                  </p>
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

                {/* Cerrar sesión (viewer) */}
                <button
                  className="cerrar-perfil"
                  onClick={() => {
                    setPerfilVisible(false);
                    onLogoutClick();
                  }}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <p>Estás logueado como streamer.</p>

                <div className="perfil-botones-streamer">
                  <button
                    className="btn-ir-panel"
                    onClick={() => {
                      setPerfilVisible(false);
                      navigate("/streamer");
                    }}
                  >
                    Ir al panel de streamer
                  </button>

                  <button
                    className="cerrar-perfil"
                    onClick={() => {
                      setPerfilVisible(false);
                      onLogoutClick();
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
