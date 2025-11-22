import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

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

  const [viewerLevels, setViewerLevels] = useState([]);

  const navigate = useNavigate();

  const statsKey = currentUserEmail
    ? `viewerStats_${currentUserEmail}`
    : "viewerStats";

  const nombreMostrar = currentUserName || currentUserEmail || "Viewer";

  // Cargar niveles desde backend
  useEffect(() => {
    fetch("http://localhost:3001/api/viewer-levels")
      .then((res) => res.json())
      .then((data) => setViewerLevels(data))
      .catch((err) => console.error("Error cargando viewerLevels:", err));
  }, []);


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

  // Cálculo de nivel y barra SOLO para viewer
  let nivelMostrar = 1;
  let puntosMostrar = 0;
  let porcentaje = 0;
  let puntosFaltantes = 0;
  let siguienteNivelNumero = null;

  if (userRole === "viewer" && viewerLevels.length > 0) {
    const nivelActual =
      viewerStats.nivel && viewerStats.nivel > 0 ? viewerStats.nivel : 1;
    const puntosActuales = viewerStats.puntos || 0;

    const registroActual =
      viewerLevels.find((l) => l.nivel === nivelActual) || viewerLevels[0];

    const registroSiguiente = viewerLevels.find(
      (l) => l.nivel === nivelActual + 1
    );

    nivelMostrar = registroActual.nivel;
    puntosMostrar = puntosActuales;

    if (registroSiguiente) {
      const base = registroActual.puntos_requeridos;
      const objetivo = registroSiguiente.puntos_requeridos;
      const rango = Math.max(objetivo - base, 1);
      const progresoNivel = Math.max(puntosActuales - base, 0);

      porcentaje = Math.min((progresoNivel / rango) * 100, 100);
      puntosFaltantes = Math.max(objetivo - puntosActuales, 0);
      siguienteNivelNumero = registroSiguiente.nivel;
    } else {
      porcentaje = 100;
      puntosFaltantes = 0;
      siguienteNivelNumero = null;
    }
  }

  return (
    <header className="main-header">
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
            <button
              className="btn-monedas"
              onClick={() => navigate("/comprar")}
            >
              🪙 {monedas}
            </button>

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

      {perfilVisible && (
        <div className="perfil-modal">
          <div className="perfil-contenido">
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
