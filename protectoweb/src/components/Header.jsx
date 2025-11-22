// src/components/Header.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../App.css";

export default function Header() {

  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [perfilVisible, setPerfilVisible] = useState(false);

  const abrirPerfil = () => {
    if (!user) return;
    setPerfilVisible(true);
  };

  const cerrarPerfil = () => {
    setPerfilVisible(false);
  };

  const handleLogout = () => {
    logout();
    setPerfilVisible(false);
    navigate("/");
  };

  // Si no hay usuario → header básico
  const isLoggedIn = !!user;

  const coins = user?.monedas || 0;
  const nivel = user?.nivel || 1;
  const puntos = user?.puntos || 0;

  // PROGRESO DEL NIVEL
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

  const faltante = siguienteNivel
    ? siguienteNivel.xp_min - puntos
    : 0;

  return (
    <header className="main-header">
      <h1 className="logo">🎥 Streamoria</h1>

      <nav className="nav-links-right">
        <Link to="/">Inicio</Link>
        <Link to="/nosotros">Nosotros</Link>
        <Link to="/tyc">TyC</Link>

        {/* ------------------- LOGGED OUT ------------------- */}
        {!isLoggedIn && (
          <button onClick={() => navigate("/login")} className="btn-login">
            Iniciar sesión
          </button>
        )}

        {/* ------------------- LOGGED IN ------------------- */}
        {isLoggedIn && (
          <>
            <button className="btn-monedas" onClick={() => navigate("/comprar")}>
              🪙 {coins}
            </button>

            <button className="btn-perfil" onClick={abrirPerfil}>
              👤
            </button>
          </>
        )}

        {isLoggedIn && user?.role === "viewer" && (
          <button
            className="btn-recargar"
            onClick={() => navigate("/comprar")}
          >
            Recargar
          </button>
        )}
      </nav>

      {/* ------------------- MODAL PERFIL ------------------- */}
      {perfilVisible && user && (
        <div className="perfil-modal">
          <div className="perfil-contenido">
            <h3>Mi Perfil</h3>

            <p><strong>Email:</strong> {user.email}</p>

            <p><strong>Nivel:</strong> {nivelActual.nivel}</p>
            <p><strong>Puntos:</strong> {puntos}</p>

            {siguienteNivel ? (
              <p className="texto-avance">
                Te faltan <strong>{faltante}</strong> puntos para nivel{" "}
                <strong>{siguienteNivel.nivel}</strong>.
              </p>
            ) : (
              <p className="texto-avance">¡Nivel máximo alcanzado!</p>
            )}

            <div className="barra-progreso">
              <div className="progreso" style={{ width: `${porcentaje}%` }}></div>
            </div>

            <p className="texto-progreso">
              Progreso: {porcentaje.toFixed(1)}%
            </p>

            <button className="cerrar-perfil" onClick={handleLogout}>
              Cerrar sesión
            </button>

            <button className="cerrar-modal" onClick={cerrarPerfil}>
              ✖
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

