// src/pages/ViewerPage.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import CanalesRecomendados from "../components/CanalesRecomendados";
import Regalos from "../components/Regalos";
import Notificacion from "../components/Notificacion";

import mensajesData from "../data/mensajes.json";

import { UserContext } from "../context/UserContext";

import "./ViewerPage.css";

export default function ViewerPage() {

  const { canal } = useParams();
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const [canalSeleccionado, setCanalSeleccionado] = useState(null);

  const [mensajes, setMensajes] = useState(mensajesData);
  const [mensaje, setMensaje] = useState("");

  const [mostrarRegalos, setMostrarRegalos] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [mensajeNotif, setMensajeNotif] = useState("");

  const mensajesRef = useRef(null);

  // ================================
  //  1️⃣ REDIRECCIÓN SI NO ESTÁ LOGEADO
  // ================================
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // ================================
  //  2️⃣ CARGAR CANAL REAL DESDE BACKEND
  // ================================
  useEffect(() => {
    const fetchCanales = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/canales");

        const canales = res.data;
        const encontrado = canales.find(
          (c) => c.nombre.toLowerCase() === canal.toLowerCase()
        );

        setCanalSeleccionado(encontrado || canales[0]);
      } catch (err) {
        console.error("Error cargando los canales:", err);
      }
    };

    fetchCanales();
  }, [canal]);

  // ================================
  //  3️⃣ SCROLL AUTOMÁTICO DEL CHAT
  // ================================
  useEffect(() => {
    if (mensajesRef.current)
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
  }, [mensajes]);

  // ================================
  //  4️⃣ ENVÍO DE MENSAJES (FAKE)
  // ================================
  const handleEnviarMensaje = (e) => {
    e.preventDefault();

    if (mensaje.trim() === "") return;

    const nuevo = {
      id: mensajes.length + 1,
      usuario: user.username,
      nivel: user.nivel,
      texto: mensaje,
    };

    setMensajes([...mensajes, nuevo]);
    setMensaje("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensaje(e);
    }
  };

  // ================================
  //  5️⃣ ENVÍO REAL DE REGALOS
  // ================================
  const handleEnviarRegalo = async (regalo) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:3001/api/regalos/enviar",
        {
          viewerId: user.id,
          giftId: regalo.id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = res.data;

      // Actualizar monedas, puntos, nivel globalmente
      setUser((prev) => ({
        ...prev,
        monedas: data.monedas,
        puntos: data.puntos,
        nivel: data.nivel
      }));

      setMensajeNotif(`🎁 Enviaste ${regalo.nombre}`);
      setShowNotif(true);

    } catch (err) {
      console.error(err);
      alert("Error al enviar el regalo");
    }
  };

  // Ocultar notificación después de 5s
  useEffect(() => {
    if (showNotif) {
      const timer = setTimeout(() => setShowNotif(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotif]);

  if (!user || !canalSeleccionado) return <p>Cargando...</p>;

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

          <p className="nivel-actual">⭐ Nivel actual: {user.nivel}</p>
        </div>
      </main>

      {/* CHAT */}
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
          <div className="puntos">🪙 {user.monedas} monedas</div>

          <button
            className="btn-tienda"
            onClick={() => setMostrarRegalos(!mostrarRegalos)}
          >
            🏪
          </button>
        </div>

        {mostrarRegalos && (
          <Regalos
            monedas={user.monedas}
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

