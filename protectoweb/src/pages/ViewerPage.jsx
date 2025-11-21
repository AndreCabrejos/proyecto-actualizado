// src/pages/ViewerPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import CanalesRecomendados from "../components/CanalesRecomendados";
import Regalos from "../components/Regalos";
import Notificacion from "../components/Notificacion";

import mensajesData from "../data/mensajes.json";
import canalesData from "../data/canales.json";

import "./ViewerPage.css";

export default function ViewerPage() {
  const { canal } = useParams();
  const navigate = useNavigate();

  const [viewer, setViewer] = useState(null);
  const [monedas, setMonedas] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [nivel, setNivel] = useState(1);

  const [canalSeleccionado, setCanalSeleccionado] = useState(null);

  const [mensajes, setMensajes] = useState(mensajesData);
  const [mensaje, setMensaje] = useState("");

  const [mostrarRegalos, setMostrarRegalos] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [mensajeNotif, setMensajeNotif] = useState("");

  const mensajesRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return navigate("/login");

    axios
      .get("http://localhost:3001/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const u = res.data.user;
        if (!u) return navigate("/login");
        if (u.role !== "viewer") return navigate("/streamer");
        setViewer(u);
        setMonedas(u.monedas || 0);
        setPuntos(u.puntos || 0);
        setNivel(u.nivel || 1);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    const encontrado = canalesData.find(
      (c) => c.nombre.toLowerCase() === (canal || "").toLowerCase()
    );
    setCanalSeleccionado(encontrado || canalesData[0]);
  }, [canal]);

  useEffect(() => {
    if (mensajesRef.current)
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
  }, [mensajes]);

  useEffect(() => {
    const puntosNecesarios = nivel * 1000;
    if (puntos >= puntosNecesarios) {
      const nuevoNivel = nivel + 1;
      setNivel(nuevoNivel);
      setMensajeNotif(`🎉 Subiste al nivel ${nuevoNivel}!`);
      setShowNotif(true);
      setPuntos((prev) => prev - puntosNecesarios);
    }
  }, [puntos, nivel]);

  useEffect(() => {
    if (showNotif) {
      const timer = setTimeout(() => setShowNotif(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotif]);

  const handleEnviarMensaje = (e) => {
    e.preventDefault();

    if (mensaje.trim() === "") return;

    const nuevo = {
      id: mensajes.length + 1,
      usuario: viewer.username || viewer.nombre,
      nivel,
      texto: mensaje,
    };

    setMensajes([...mensajes, nuevo]);
    setMensaje("");
    setPuntos((p) => p + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensaje(e);
    }
  };

  const handleEnviarRegalo = (regalo) => {
    if (monedas < regalo.costo) return;
    setMonedas((m) => m - regalo.costo);
    setPuntos((p) => p + regalo.puntos);
    setMensajeNotif(`🎁 Enviaste ${regalo.nombre}`);
    setShowNotif(true);
  };

  if (!viewer || !canalSeleccionado) return <p>Cargando...</p>;

  return (
    <div className="viewer-layout">
      <aside className="viewer-canales">
        <CanalesRecomendados />
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
              <h2>
                {canalSeleccionado.nombre} <span>✅</span>
              </h2>
              <p>{canalSeleccionado.categoria}</p>
            </div>
          </div>

          <div className="stream-right">
            <button className="btn-follow">🤍 Seguir</button>

            <div className="stream-viewers">
              👤 {canalSeleccionado.viewers.toLocaleString()}
            </div>
          </div>

          <p className="nivel-actual">⭐ Nivel actual: {nivel}</p>
        </div>
      </main>

      <aside className="viewer-chat">
        <div className="chat-box">
          <div className="chat-mensajes" ref={mensajesRef}>
            {mensajes.map((m) => (
              <p key={m.id}>
                <strong>{m.usuario} - ⭐ {m.nivel}:</strong> {m.texto}
              </p>
            ))}
          </div>
        </div>

        <form className="chat-input" onSubmit={handleEnviarMensaje}>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enviar mensaje..."
          />
          <button type="submit">➤</button>
        </form>

        <div className="chat-footer">
          <div className="puntos">🪙 {monedas} monedas</div>

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
