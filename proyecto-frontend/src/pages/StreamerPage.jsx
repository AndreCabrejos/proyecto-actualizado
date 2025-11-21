import React, { useState, useEffect } from 'react';
import './StreamerPage.css';
import streamerData from '../data/streamerData.json';
import initialViewerLevels from '../data/viewerLevels.json';
import StreamerSidebar from '../components/StreamerSidebar';
import StreamerRightSidebar from '../components/StreamerRightSidebar';
import GiftManager from '../components/StreamerGifts';
import GiftOverlay from '../components/GiftOverlay';
import { emitGiftEvent, subscribeToGiftEvents } from "../services/streamEvents";
import { FaInfoCircle, FaPlayCircle, FaCogs, FaGift } from 'react-icons/fa';

export default function StreamerPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStartTime, setStreamStartTime] = useState(null);
  const [streamerInfo, setStreamerInfo] = useState(() => {
    const saved = localStorage.getItem("streamerInfo");
    return saved ? JSON.parse(saved) : streamerData;
  });

  const [levelUpNotice, setLevelUpNotice] = useState(false);
  const [viewerLevels, setViewerLevels] = useState(() => {
    const saved = localStorage.getItem("viewerLevels");
    return saved ? JSON.parse(saved) : initialViewerLevels;
  });

  const [showGiftOverlay, setShowGiftOverlay] = useState(false);
  const [giftData, setGiftData] = useState(null);
  const [viewerName, setViewerName] = useState("Espectador");


  useEffect(() => {
    let interval;
    if (isStreaming && streamStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsedSeconds = (now - streamStartTime) / 1000;
        const newTotalHours = streamerInfo.horas_totales + elapsedSeconds / 3600;

        if (newTotalHours >= streamerInfo.horas_para_subir) {
          setStreamerInfo(prev => ({
            ...prev,
            nivel: prev.nivel + 1,
            horas_para_subir: prev.horas_para_subir * 2
          }));
          setLevelUpNotice(true);
          setTimeout(() => setLevelUpNotice(false), 5000);
        }

        setStreamerInfo(prev => ({
          ...prev,
          horas_totales: newTotalHours
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming, streamStartTime, streamerInfo.horas_totales, streamerInfo.horas_para_subir]);

  // Persistir info del streamer
  useEffect(() => {
    localStorage.setItem("streamerInfo", JSON.stringify(streamerInfo));
  }, [streamerInfo]);

  // Escuchar regalos enviados desde la vista de viewer (modo demo frontend)
  useEffect(() => {
    const unsubscribe = subscribeToGiftEvents((payload) => {
      // payload: { canal, user, regalo }

      // podrías filtrar por canal si luego tienes múltiples canales
      setShowGiftOverlay(false);
      setGiftData(null);

      setTimeout(() => {
        setViewerName(payload.user || "Espectador");
        setGiftData(payload.regalo || null);
        setShowGiftOverlay(true);
      }, 50);
    });

    return () => {
      // limpiar listener al desmontar
      unsubscribe && unsubscribe();
    };
  }, []);

  const startStream = () => {
    setIsStreaming(true);
    setStreamStartTime(new Date());
  };

  const stopStream = () => {
    setIsStreaming(false);
    setStreamStartTime(null);
  };

  const handleLevelChange = (index, value) => {
    const newLevels = [...viewerLevels];
    newLevels[index].puntos_requeridos = parseInt(value, 10);
    setViewerLevels(newLevels);
    localStorage.setItem("viewerLevels", JSON.stringify(newLevels));
  };

  const getStreamDuration = () => {
    if (!isStreaming || !streamStartTime) return "00:00:00";
    const elapsedSeconds = Math.floor((new Date() - streamStartTime) / 1000);
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="streamer-dashboard-layout">
      <StreamerSidebar />

      <div className="dashboard-main-content">

        <div className="dashboard-section-card">
          <h3 className="section-header-title"><FaInfoCircle /> Información de la sesión</h3>
          <div className="session-info-grid">
            <div className="session-info-item"><h5>Sesión</h5><p>{isStreaming ? "EN VIVO" : "SIN CONEXIÓN"}</p></div>
            <div className="session-info-item"><h5>Espectadores</h5><p>0</p></div>
            <div className="session-info-item"><h5>Seguidores</h5><p>1</p></div>
            <div className="session-info-item"><h5>Suscripciones</h5><p>0</p></div>
            <div className="session-info-item"><h5>Tiempo en vivo</h5><p>{getStreamDuration()}</p></div>
          </div>
        </div>

        <div className="dashboard-section-card level-progress-section">
          <h3 className="section-header-title"><FaPlayCircle /> Progreso hacia el siguiente nivel</h3>
          <div className="level-progress-container">
            <div
              className="level-progress-bar"
              style={{
                width: `${Math.min((streamerInfo.horas_totales / streamerInfo.horas_para_subir) * 100, 100)}%`
              }}
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
                  alt="Offline background"
                  className="stream-offline-image"
                />
                <div className="offline-text">OFFLINE</div>
                <div className="offline-subtext">Tu stream está fuera de línea</div>
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
                      emitGiftEvent({
                        canal: "CanalDemo",
                        user: "DemoViewer",
                        regalo: { nombre: "Super Corazón 💖", costo: 100, puntos: 50 },
                      });
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
            <h3 className="section-header-title"><FaCogs /> Controles del Stream</h3>
            <p>Horas totales: {streamerInfo.horas_totales.toFixed(2)}</p>
            <p>Horas para subir: {streamerInfo.horas_para_subir}</p>
          </div>

          <div className="dashboard-section-card viewer-level-config-card">
            <h3 className="section-header-title"><FaCogs /> Niveles de Espectadores</h3>
            {viewerLevels.map((level, index) => (
              <div key={level.nivel} className="level-config-item">
                <label>Nivel {level.nivel}:</label>
                <input
                  type="number"
                  value={level.puntos_requeridos}
                  onChange={(e) => handleLevelChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section-card">
          <h3 className="section-header-title"><FaGift /> Gestión de Regalos</h3>
          <GiftManager />
        </div>

        {levelUpNotice && (
          <div className="level-up-notice">
            ¡Felicidades! Has subido al nivel {streamerInfo.nivel}.
          </div>
        )}
      </div>

      <StreamerRightSidebar streamerInfo={streamerInfo} isStreaming={isStreaming} />

      <GiftOverlay
        show={showGiftOverlay}
        regalo={giftData}
        espectador={viewerName}
        onClose={() => setShowGiftOverlay(false)}
      />
    </div>
  );
}
