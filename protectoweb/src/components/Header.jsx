// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

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
  puntos = 0,
}) {
  const [perfilVisible, setPerfilVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const cargarPerfil = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:3001/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
      } else {
        console.error("Error cargando perfil:", data.error);
      }
    } catch (err) {
      console.error("Error cargando perfil:", err);
    }
  };

  const abrirPerfil = () => {
    setPerfilVisible(true);
    cargarPerfil();
  };

  const xp = userData?.puntos || puntos;
  const coins = userData?.monedas || monedas;

  let nivelActual = niveles[0];
  let siguienteNivel = null;

  for (let i = 0; i < niveles.length; i++) {
    if (xp >= niveles[i].xp_min) {
      nivelActual = niveles[i];
      siguienteNivel = niveles[i + 1] || null;
    } else break;
  }

  const xpDesdeNivelActual = xp - nivelActual.xp_min;
  const tramoNivel = siguienteNivel ? siguienteNivel.xp_min - nivelActual.xp_min : 1;
  const porcentaje = siguienteNivel
    ? Math.min((xpDesdeNivelActual / tramoNivel) * 100, 100)
    : 100;

  const puntosFaltantes = siguienteNivel ? siguienteNivel.xp_min - xp : 0;

  return (
    <header className="main-header">
      <h1 className="logo">🎥 Streamoria</h1>

      <nav className="nav-links-right">
        <Link to="/">Inicio</Link>
        <Link to="/nosotros">Nosotros</Link>
        <Link to="/tyc">TyC</Link>

        {isLoggedIn ? (
          <>
            <button className="btn-monedas" onClick={() => navigate("/comprar")}>
              🪙 {coins}
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

        {isLoggedIn && userRole === "viewer" && (
          <button className="btn-recargar" onClick={onRecargarClick}>
            Recargar
          </button>
        )}
      </nav>

      {perfilVisible && (
        <div className="perfil-modal">
          <div className="perfil-contenido">
            <h3>Mi Perfil</h3>

            <p><strong>Email:</strong> {userData?.email}</p>

            <p><strong>Nivel:</strong> {nivelActual.nivel}</p>
            <p><strong>Puntos:</strong> {xp}</p>

            {siguienteNivel ? (
              <p className="texto-avance">
                Te faltan <strong>{puntosFaltantes}</strong> puntos para nivel{" "}
                <strong>{siguienteNivel.nivel}</strong>.
              </p>
            ) : (
              <p className="texto-avance">¡Has alcanzado el nivel máximo!</p>
            )}

            <div className="barra-progreso">
              <div className="progreso" style={{ width: `${porcentaje}%` }}></div>
            </div>

            <p className="texto-progreso">
              Progreso: {porcentaje.toFixed(1)}%
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

            <button className="cerrar-modal" onClick={() => setPerfilVisible(false)}>
              ✖
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
