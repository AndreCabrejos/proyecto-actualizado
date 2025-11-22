import React from 'react';
import './StreamerRightSidebar.css';
import { FaEllipsisV, FaAngleRight, FaToggleOn, FaToggleOff } from 'react-icons/fa';

export default function StreamerRightSidebar({ streamerInfo, isStreaming }) {
  // Simulación de chat y opciones
  const chatMessages = [
    { user: 'Viewer1', message: '¡Hola! ¿Cómo están todos?' },
    { user: 'Streamer', message: '¡Bienvenidos! Qué alegría tenerlos aquí.' },
    { user: 'Fanatico', message: 'Gran stream, como siempre!' },
  ];

  const streamInfo = {
    title: "Mi primer stream.",
    category: "Conversando",
    language: "Español"
  };

  const [chatEnabled, setChatEnabled] = React.useState(true); // Estado para el chat

  return (
    <aside className="streamer-right-sidebar">
      <div className="right-sidebar-section stream-info-card">
        <div className="section-header">
          <h4>Información del stream</h4>
          <FaEllipsisV className="icon" />
        </div>
        <div className="stream-details">
          <p className="stream-title">{streamInfo.title}</p>
          <div className="stream-category">
            <span className="category-tag">{streamInfo.category}</span>
            <span className="language-tag">{streamInfo.language}</span>
          </div>
          <button className="edit-button">Editar</button>
        </div>
      </div>

      <div className="right-sidebar-section channel-actions-card">
        <div className="section-header">
          <h4>Acciones de canal</h4>
          <FaEllipsisV className="icon" />
        </div>
        <ul className="channel-actions-list">
          <li>
            <span>Modo lento</span>
            <FaAngleRight className="icon" />
          </li>
          <li>
            <span>Chat de solo-suscriptores</span>
            <FaAngleRight className="icon" />
          </li>
          <li>
            <span>Chat de solo-emotes</span>
            {chatEnabled ? (
              <FaToggleOn className="toggle-icon active" onClick={() => setChatEnabled(false)} />
            ) : (
              <FaToggleOff className="toggle-icon" onClick={() => setChatEnabled(true)} />
            )}
          </li>
          <li>
            <span>Moderación del chat con IA</span>
            <FaAngleRight className="icon" />
          </li>
          <li>
            <span>Restricción de edad</span>
            <FaAngleRight className="icon" />
          </li>
          <li>
            <span>Palabras baneadas</span>
            <FaAngleRight className="icon" />
          </li>
          <li>
            <span>Hostear canal</span>
            <FaAngleRight className="icon" />
          </li>
          <li>
            <span>Configurar objetivos</span>
            <FaAngleRight className="icon" />
          </li>
        </ul>
      </div>

      <div className="right-sidebar-section chat-section">
        <div className="section-header">
          <h4>Chat</h4>
          <FaEllipsisV className="icon" />
        </div>
        <div className="chat-messages">
          {chatMessages.map((msg, index) => (
            <p key={index}>
              <span className="chat-user">{msg.user}:</span> {msg.message}
            </p>
          ))}
        </div>
        <div className="chat-input-area">
          <div className="chat-emotes">
            {/* Íconos de emotes */}
            <span>🐸</span><span>🎉</span><span>🔥</span><span>❤️</span><span>😂</span>
          </div>
          <input type="text" placeholder="Enviar un mensaje" />
          <button className="chat-send-button">Chat</button>
        </div>
      </div>
    </aside>
  );
}