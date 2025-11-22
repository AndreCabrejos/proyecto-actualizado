// src/pages/StreamerPage.jsx
import React, { useState, useEffect } from 'react';
import './StreamerPage.css';

import StreamerSidebar from '../components/StreamerSidebar';
import StreamerRightSidebar from '../components/StreamerRightSidebar';
import GiftManager from '../components/StreamerGifts';
import GiftOverlay from '../components/GiftOverlay';
import { FaInfoCircle, FaPlayCircle, FaCogs, FaGift } from 'react-icons/fa';

export default function StreamerPage() {
  const token = localStorage.getItem("token");

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStartTime, setStreamStartTime] = useState(null);
  const [streamerInfo, setStreamerInfo] = useState(null);
  const [levelUpNotice, setLevelUpNotice] = useState(false);

  const [viewerLevels, setViewerLevels] = useState([]);
  const [showGiftOverlay, setShowGiftOverlay] = useState(false);
  const [giftData, setGiftData] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3001/api/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) setStreamerInfo(data.user);
      })
      .catch(console.error);

    fetch("http://localhost:3001/api/viewer-levels")
      .then(res => res.json())
      .then(data => setViewerLevels(data))
      .catch(() => setViewerLevels([]));
  }, [token]);

  useEffect(() => {
    if (!isStreaming || !streamStartTime || !streamerInfo) return;

    const interval = setInterval(async () => {
      const now = new Date();
      const elapsedSeconds = (now - streamStartTime) / 1000;
      const newTotalHours = streamerInfo.horas_totales + elapsedSeconds / 3600;

      const subirNivel = newTotalHours >= streamerInfo.horas_para_subir;

      if (subirNivel) {
        setLevelUpNotice(true);
        setTimeout(() => setLevelUpNotice(false), 5000);
      }

      try {
        const res = await fetch("http://localhost:3001/api/streamer/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            horas_totales: newTotalHours,
            nivel: subirNivel ? streamerInfo.nivel + 1 : streamerInfo.nivel,
            horas_para_subir: subirNivel
              ? streamerInfo.horas_para_subir * 2
              : streamerInfo.horas_para_subir
          })
        });

        const updated = await res.json();
        if (res.ok) setStreamerInfo(updated);
      } catch (err) {
        console.error(err);
      }

      setStreamStartTime(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming, streamStartTime, streamerInfo, token]);

  const startStream = async () => {
    try {
      await fetch("http://localhost:3001/api/stream/start", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsStreaming(true);
      setStreamStartTime(new Date());
    } catch (err) {
      console.error(err);
    }
  };

  const stopStream = async () => {
    try {
      await fetch("http://localhost:3001/api/stream/stop", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsStreaming(false);
      setStreamStartTime(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLevelChange = async (index, value) => {
    const newLevels = [...viewerLevels];
    newLevels[index].puntos_requeridos = parseInt(value);

    setViewerLevels(newLevels);

    try {
      await fetch("http://localhost:3001/api/viewer-levels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newLevels)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getStreamDuration = () => {
    if (!isStreaming || !streamStartTime) return "00:00:00";
    const elapsed = Math.floor((new Date() - streamStartTime) / 1000);

    const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
    const s = String(elapsed % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  if (!streamerInfo) return <p>Cargando...</p>;

  return (
    <div className="streamer-dashboard-layout">
      <StreamerSidebar />

      <div className="dashboard-main-content">
        <div className="dashboard-section-card">
          <h3 className="section-header-title"><FaInfoCircle /> Información de la sesión</h3>
          <div className="session-info-grid">
            <div className="session-info-item"><h5>Sesión</h5><p>{isStreaming ? "EN VIVO" : "SIN CONEXIÓN"}</p></div>
            <div className="session-info-item"><h5>Espectadores</h5><p>0</p></div>
            <div className="session-info-item"><h5>Seguidores</h5><p>{streamerInfo.seguidores}</p></div>
            <div className="session-info-item"><h5>Suscripciones</h5><p>{streamerInfo.suscriptores}</p></div>
            <div className="session-info-item"><h5>Tiempo en vivo</h5><p>{getStreamDuration()}</p></div>
          </div>
        </div>

        <div className="dashboard-section-card level-progress-section">
          <h3 className="section-header-title"><FaPlayCircle /> Progreso hacia el siguiente nivel</h3>

          <div className="level-progress-container">
            <div
              className="level-progress-bar"
              style={{ width: `${Math.min((streamerInfo.horas_totales / streamerInfo.horas_para_subir) * 100, 100)}%` }}
            />
          </div>

          <p className="level-progress-text">
            Faltan {(streamerInfo.horas_para_subir - streamerInfo.horas_totales).toFixed(2)} horas para tu siguiente nivel
          </p>
        </div>

        <div className="dashboard-section-card">
          <h3 className="section-header-title"><FaPlayCircle /> Vista previa del stream</h3>

          <div className="stream-preview-container">
            {!isStreaming ? (
              <div className="stream-offline-overlay">
                <img
                  src="https://wallpapers.com/images/high/dark-tech-patterns-4k-gaming-background-628p019s8k6908v9.webp"
                  alt="Offline"
                  className="stream-offline-image"
                />
                <div className="offline-text">OFFLINE</div>
              </div>
            ) : (
              <p>🎬 ¡Tu stream está en vivo!</p>
            )}

            <div className="stream-controls-overlay">
              {!isStreaming ? (
                <button className="stream-button start-stream-btn" onClick={startStream}>
                  Iniciar Transmisión
                </button>
              ) : (
                <>
                  <button className="stream-button stop-stream-btn" onClick={stopStream}>
                    Detener Transmisión
                  </button>

                  <button
                    className="stream-button simulate-gift-btn"
                    onClick={() => {
                      setGiftData({ nombre: "Super Corazón 💖", costo: 100, puntos: 50 });
                      setShowGiftOverlay(true);
                    }}
                  >
                    🎁 Simular Regalo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="stream-actions-and-levels">
          <div className="dashboard-section-card stream-actions-card">
            <h3><FaCogs /> Controles del Stream</h3>
            <p>Horas totales: {streamerInfo.horas_totales.toFixed(2)}</p>
            <p>Horas para subir: {streamerInfo.horas_para_subir}</p>
          </div>

          <div className="dashboard-section-card viewer-level-config-card">
            <h3><FaCogs /> Niveles de Espectadores</h3>

            {viewerLevels.map((lvl, idx) => (
              <div key={lvl.nivel} className="level-config-item">
                <label>Nivel {lvl.nivel}</label>
                <input
                  type="number"
                  value={lvl.puntos_requeridos}
                  onChange={(e) => handleLevelChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section-card">
          <h3><FaGift /> Gestión de Regalos</h3>
          <GiftManager />
        </div>

        {levelUpNotice && (
          <div className="level-up-notice">
            ¡Subiste al nivel {streamerInfo.nivel}! 🎉
          </div>
        )}
      </div>

      <StreamerRightSidebar streamerInfo={streamerInfo} isStreaming={isStreaming} />

      <GiftOverlay
        show={showGiftOverlay}
        regalo={giftData}
        espectador="André"
        onClose={() => setShowGiftOverlay(false)}
      />
    </div>
  );
}
