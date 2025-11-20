
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import CanalesRecomendados from "../components/CanalesRecomendados";
import Regalos from "../components/Regalos";
import Notificacion from "../components/Notificacion";
import mensajesData from "../data/mensajes.json";
import canalesData from "../data/canales.json";
import "./ViewerPage.css";


const ViewerProfileCard = ({ coins }) => {
  const [viewerData, setViewerData] = useState({
    nombre: "André",
    nivel: 5,
    puntos: 1240,
  });

  // Simulación de ganancia de puntos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerData((prev) => ({
        ...prev,
        puntos: prev.puntos + Math.floor(Math.random() * 10),
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Cálculo del progreso al siguiente nivel (cada 1000 puntos)
  const progreso = (viewerData.puntos % 1000) / 10;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-icon" style={{ fontSize: "60px" }}>👤</div>
        <h2 className="profile-title">Perfil de {viewerData.nombre}</h2>
      </div>

      {/* Sección de Progreso y Datos del Perfil (Tu Avance) */}
      <div className="progress-section mb-1">
        <div className="info-row">
          <span className="icon">⭐</span>
          <span className="label">Nivel:</span>
          <strong className="value">{viewerData.nivel}</strong>
        </div>

        <div className="info-row">
          <span className="icon">🏆</span>
          <span className="label">Puntos:</span>
          <strong className="value">{viewerData.puntos}</strong>
        </div>

        {/* Saldo de Monedas (Usamos el prop 'coins' de App.jsx) */}
        <div className="info-row coin-row">
          <span className="icon">🪙</span>
          <span className="label">Saldo Actual:</span>
          <strong className="value coin-value">{coins}</strong>
        </div>


        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progreso}%` }}></div>
        </div>
        <p className="progress-text">
          Progreso al siguiente nivel: {progreso.toFixed(1)}%
        </p>
      </div>
    </div>
  );
};


// Componente principal que fusiona el Stream con el Chat/Sidebar
export default function ViewerPage({ monedas, setMonedas }) {
    const [nivel, setNivel] = useState(1); // Nivel del usuario
  const [showNotif, setShowNotif] = useState(false); // Mostrar o no la notificación
  const { canal } = useParams();
  const [canalSeleccionado, setCanalSeleccionado] = useState(() => {
    return (
      canalesData.find(
        (c) => c.nombre.toLowerCase() === canal.toLowerCase()
      ) || canalesData[0] // fallback si no encuentra
    );
  });
  const [mostrarRegalos, setMostrarRegalos] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [puntos, setPuntos] = useState(0);
  const [mensajes, setMensajes] = useState(mensajesData);
  const [mensajeNotif, setMensajeNotif] = useState("");
  const mensajesRef = useRef(null);

  useEffect(() => {
    const encontrado = canalesData.find(
      (c) => c.nombre.toLowerCase() === canal.toLowerCase()
    );
    if (encontrado) setCanalSeleccionado(encontrado);
  }, [canal]);

  // 🔹 Desplazar automáticamente hacia el final
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  useEffect(() => {
  const puntosNecesarios = nivel * 30;
  if (puntos >= puntosNecesarios) {
    const nuevoNivel = nivel + 1;
    setNivel(nuevoNivel);
    setMensajeNotif(`🎉 ¡Has subido al nivel ${nuevoNivel}!`);
    setShowNotif(true);

    // 🔹 Reinicia los puntos sobrantes en el nuevo nivel
    setPuntos((prev) => prev - puntosNecesarios);
  }
}, [puntos, nivel]);


  useEffect(() => {
  if (showNotif) {
    const timer = setTimeout(() => setShowNotif(false), 8000);
    return () => clearTimeout(timer);
  }
}, [showNotif]);


  const handleEnviarRegalo = (regalo) => {
    setMonedas((prev) => prev - regalo.costo);
    setPuntos((prev) => prev + (regalo.puntos || 0));
  };

  const handleEnviarMensaje = (e) => {
    e.preventDefault();
    if (mensaje.trim() !== "") {
      const nuevoMensaje = {
        id: mensajes.length + 1,
        usuario: "Tú",
        texto: mensaje,
      };
      setMensajes([...mensajes, nuevoMensaje]);
      setMensaje("");
      setPuntos((prev) => prev + 1); // +1 punto por mensaje
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensaje(e);

    }
  };

  useEffect(() => {
    if (showNotif) {
      const timer = setTimeout(() => setShowNotif(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotif]);
  
    

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
              src={canalSeleccionado.imagen}            // <-- usa la propiedad imagen del JSON
              alt={canalSeleccionado.nombre}
              className="stream-logo"
            />
            <div className="stream-detalle">
              <h2 className="stream-name">
                {canalSeleccionado.nombre} <span className="verified">✅</span>
              </h2>
              <p className="stream-category">{canalSeleccionado.categoria}</p>
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
          <p className="nivel-actual">⭐ Nivel actual: {nivel}</p>
        </div>
      </main >

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
            <img src="/images/puntos.png" alt="puntos" className="icono-puntos" />
            <span>{puntos}</span>
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
      {/* Notificación solo aparece cuando showNotif es true */}
      <Notificacion
        message={mensajeNotif}
        show={showNotif}
        onClose={() => setShowNotif(false)}
      />

      
    </div >
    
    
    


    

    
  );
}