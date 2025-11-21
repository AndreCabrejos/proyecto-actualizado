// src/pages/ViewerPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import CanalesRecomendados from "../components/CanalesRecomendados";
import Regalos from "../components/Regalos";
import Notificacion from "../components/Notificacion";
import mensajesData from "../data/mensajes.json";
import { emitGiftEvent } from "../services/streamEvents";
import "./ViewerPage.css";

export default function ViewerPage({
  monedas,
  setMonedas,
  currentUserEmail,
  currentUserName,
  currentUserId,
}) {
  const statsKey = currentUserEmail
    ? `viewerStats_${currentUserEmail}`
    : "viewerStats";

  const { canal } = useParams();

  const displayName = currentUserName || "Tú";

  const [nivel, setNivel] = useState(() => {
    try {
      const saved = localStorage.getItem(statsKey);
      if (!saved) return 1;
      const parsed = JSON.parse(saved);
      return parsed.nivel || 1;
    } catch {
      return 1;
    }
  });

  const [puntos, setPuntos] = useState(() => {
    try {
      const saved = localStorage.getItem(statsKey);
      if (!saved) return 0;
      const parsed = JSON.parse(saved);
      return parsed.puntos || 0;
    } catch {
      return 0;
    }
  });

  const [showNotif, setShowNotif] = useState(false);
  const [mensajeNotif, setMensajeNotif] = useState("");

  const [canales, setCanales] = useState([]);
  const [canalSeleccionado, setCanalSeleccionado] = useState(null);

  const [mostrarRegalos, setMostrarRegalos] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState(mensajesData);
  const mensajesRef = useRef(null);

  const [viewerLevels, setViewerLevels] = useState([]);

  // cargar canales desde backend
  useEffect(() => {
    fetch("http://localhost:3001/api/canales")
      .then((res) => res.json())
      .then((data) => {
        setCanales(data);
        const encontrado =
          data.find(
            (c) => c.nombre.toLowerCase() === canal.toLowerCase()
          ) || data[0] || null;
        setCanalSeleccionado(encontrado);
      })
      .catch((err) => console.error("Error cargando canales:", err));
  }, [canal]);


  // cargar niveles desde backend
  useEffect(() => {
    fetch("http://localhost:3001/api/viewer-levels")
      .then((res) => res.json())
      .then((data) => setViewerLevels(data))
      .catch((err) => console.error("Error cargando viewerLevels:", err));
  }, []);


  // recargar stats cuando cambia de usuario
  useEffect(() => {
    try {
      const saved = localStorage.getItem(statsKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setNivel(parsed.nivel || 1);
        setPuntos(parsed.puntos || 0);
      } else {
        setNivel(1);
        setPuntos(0);
      }
    } catch {
      setNivel(1);
      setPuntos(0);
    }
  }, [statsKey]);

  // scroll automático del chat
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  // lógica de subida de nivel
  useEffect(() => {
    const nextConfig = viewerLevels.find((l) => l.nivel === nivel + 1);
    if (!nextConfig) return;
    const puntosNecesarios = nextConfig.puntos_requeridos;

    if (puntos >= puntosNecesarios) {
      const nuevoNivel = nivel + 1;
      setNivel(nuevoNivel);
      setMensajeNotif(`🎉 ¡Has subido al nivel ${nuevoNivel}!`);
      setShowNotif(true);
    }
  }, [puntos, nivel, viewerLevels]);

  // auto-ocultar notificación
  useEffect(() => {
    if (!showNotif) return;
    const timer = setTimeout(() => setShowNotif(false), 3000);
    return () => clearTimeout(timer);
  }, [showNotif]);

  // guardar stats
  useEffect(() => {
    const payload = { nivel, puntos, email: currentUserEmail || null };
    localStorage.setItem(statsKey, JSON.stringify(payload));

    window.dispatchEvent(
      new CustomEvent("viewerStatsUpdated", { detail: payload })
    );
  }, [nivel, puntos, statsKey, currentUserEmail]);

  // enviar regalo: resta monedas (frontend + backend) y suma puntos
  const handleEnviarRegalo = (regalo) => {
    setMonedas((prev) => prev - regalo.costo);
    setPuntos((prev) => prev + (regalo.puntos || 0));

    // actualizar backend (monedas)
    if (currentUserId) {
      fetch(`http://localhost:3001/api/users/${currentUserId}/monedas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta: -regalo.costo }),
      }).catch((err) => console.error("Error actualizando monedas:", err));
    }


    emitGiftEvent({
      canal: canalSeleccionado?.nombre || "",
      user: displayName,
      regalo,
    });
  };

  // enviar mensaje: +1 punto
  const handleEnviarMensaje = (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    const nuevoMensaje = {
      id: mensajes.length + 1,
      usuario: displayName,
      texto: mensaje,
      nivel,
    };

    setMensajes((prev) => [...prev, nuevoMensaje]);
    setMensaje("");
    setPuntos((prev) => prev + 1);

    if (canalSeleccionado) {
      window.dispatchEvent(
        new CustomEvent("streamChatMessage", {
          detail: {
            canal: canalSeleccionado.nombre,
            user: displayName,
            nivel,
            texto: mensaje,
          },
        })
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensaje(e);
    }
  };

  const formatNumber = (n) => n.toLocaleString("es-ES");

  const nextConfig = viewerLevels.find((l) => l.nivel === nivel + 1);
  const puntosFaltantes = nextConfig
    ? Math.max(nextConfig.puntos_requeridos - puntos, 0)
    : null;

  const progresoMiniBarra = nextConfig
    ? Math.min((puntos / nextConfig.puntos_requeridos) * 100, 100)
    : 100;

  if (!canalSeleccionado) {
    return <div className="viewer-layout">Cargando canal...</div>;
  }

  return (
    <div className="viewer-layout">
      <aside className="viewer-canales">
        <CanalesRecomendados isLoggedIn={true} userRole="viewer" />
      </aside>

      <main className="viewer-stream">
        <div className="stream-video">
          🎥 Transmisión en vivo de <strong>{canalSeleccionado.nombre}</strong>
        </div>

        <div className="stream-info">
          <div className="stream-left">
            <img
              src={canalSeleccionado.imagen}
              alt={canalSeleccionado.nombre}
              className="stream-logo"
            />
            <div className="stream-detalle">
              <h2 className="stream-name">
                {canalSeleccionado.nombre} <span className="verified">✅</span>
              </h2>
              <p className="stream-category">
                {canalSeleccionado.categoria}
              </p>
            </div>
          </div>

          <div className="stream-right">
            <button className="btn-follow">🤍 Seguir</button>
            <div className="stream-viewers">
              <span className="person-icon">👤</span>
              <span className="num-viewers">
                {canalSeleccionado.viewers.toLocaleString()}
              </span>
              <span className="label-espectadores">Espectadores</span>
            </div>
          </div>
        </div>
      </main>

      {/* CHAT */}
      <aside className="viewer-chat">
        <div className="chat-box">
          <div className="chat-mensajes" ref={mensajesRef}>
            {mensajes.map((m) => (
              <p key={m.id}>
                <strong>
                  {m.usuario} - ⭐ Nivel {m.nivel ?? 1}:
                </strong>{" "}
                {m.texto}
              </p>
            ))}
          </div>
        </div>

        <form className="chat-input" onSubmit={handleEnviarMensaje}>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enviar un mensaje..."
          />
          <button type="submit">➤</button>
        </form>

        <div className="chat-footer">
          <div className="puntos">
            <div className="puntos-row">
              <img
                src="/images/puntos.png"
                alt="puntos"
                className="icono-puntos"
              />
              <span className="puntos-valor">{formatNumber(puntos)}</span>
            </div>

            {nextConfig && (
              <>
                <div className="mini-barra-progreso">
                  <div
                    className="mini-barra-fill"
                    style={{ width: `${progresoMiniBarra}%` }}
                  ></div>
                </div>
                <span className="mini-texto-nivel">
                  Te faltan {formatNumber(puntosFaltantes)} pts para el nivel{" "}
                  {nextConfig.nivel}
                </span>
              </>
            )}
          </div>

          <button
            className="btn-tienda"
            onClick={() => setMostrarRegalos(!mostrarRegalos)}
          >
            🏪
          </button>
        </div>

        {mostrarRegalos && (
          <Regalos
            monedas={monedas}
            onEnviarRegalo={handleEnviarRegalo}
            onClose={() => setMostrarRegalos(false)}
          />
        )}
      </aside>

      <Notificacion
        message={mensajeNotif}
        show={showNotif}
        onClose={() => setShowNotif(false)}
      />
    </div>
  );
}
