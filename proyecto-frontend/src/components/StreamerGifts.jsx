import React, { useState, useEffect } from 'react';
import './StreamerGifts.css';
import regalosData from '../data/regalos.json';

export default function GiftManager() {
  const [regalos, setRegalos] = useState([]);
  const [nuevoRegalo, setNuevoRegalo] = useState({ nombre: '', costo: '', puntos: '', icono: '' });
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    setCargando(true);
    try {
      const guardados = localStorage.getItem('regalos');
      if (guardados) {
        setRegalos(JSON.parse(guardados));
      } else {
        setRegalos(regalosData);
        localStorage.setItem('regalos', JSON.stringify(regalosData));
      }
    } catch (err) {
      console.error('Error cargando regalos desde localStorage:', err);
      setError('No se pudieron cargar los regalos');
    } finally {
      setCargando(false);
    }
  }, []);


  const guardarEnJSON = (nuevoArray) => {
    localStorage.setItem('regalos', JSON.stringify(nuevoArray));
  };


  const agregarRegalo = () => {
    if (!nuevoRegalo.nombre || !nuevoRegalo.costo || !nuevoRegalo.puntos) return;

    const actualizado = [
      ...regalos,
      {
        id: Date.now(),
        ...nuevoRegalo,
        costo: parseInt(nuevoRegalo.costo),
        puntos: parseInt(nuevoRegalo.puntos)
      }
    ];

    setRegalos(actualizado);
    guardarEnJSON(actualizado);
    setNuevoRegalo({ nombre: '', costo: '', puntos: '', icono: '' });
  };


  const eliminarRegalo = (id) => {
    const actualizado = regalos.filter(r => r.id !== id);
    setRegalos(actualizado);
    guardarEnJSON(actualizado);
  };

  const editarRegalo = (r) => {
    setEditando(r);
    setNuevoRegalo(r);
  };

  const guardarEdicion = () => {
    const actualizado = regalos.map(r => (r.id === editando.id ? { ...nuevoRegalo, id: editando.id } : r));
    setRegalos(actualizado);
    guardarEnJSON(actualizado);
    setEditando(null);
    setNuevoRegalo({ nombre: '', costo: '', puntos: '', icono: '' });
  };

  return (
    <div className="gift-manager">
      <h2 className="gift-title">🎁 Administrador de Regalos</h2>

      {error && (
        <div className="gift-error">
          ⚠️ {error}
        </div>
      )}

      {cargando ? (
        <div className="gift-loading">Cargando regalos...</div>
      ) : (
        <>
          <div className="gift-form">
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoRegalo.nombre}
              onChange={e => setNuevoRegalo({ ...nuevoRegalo, nombre: e.target.value })}
            />
            <input
              type="number"
              placeholder="Costo"
              value={nuevoRegalo.costo}
              onChange={e => setNuevoRegalo({ ...nuevoRegalo, costo: e.target.value })}
            />
            <input
              type="number"
              placeholder="Puntos"
              value={nuevoRegalo.puntos}
              onChange={e => setNuevoRegalo({ ...nuevoRegalo, puntos: e.target.value })}
            />
            <input
              type="text"
              placeholder="Icono (ej: ⭐)"
              value={nuevoRegalo.icono}
              onChange={e => setNuevoRegalo({ ...nuevoRegalo, icono: e.target.value })}
            />

            {editando ? (
              <button onClick={guardarEdicion} className="btn-guardar">💾 Guardar</button>
            ) : (
              <button onClick={agregarRegalo} className="btn-agregar">➕ Agregar</button>
            )}
          </div>

          <div className="gift-list">
            {regalos.map(r => (
              <div key={r.id} className="gift-item">
                <span className="gift-icon">{r.icono}</span>
                <span className="gift-name">{r.nombre}</span>
                <span className="gift-cost">{r.costo} monedas</span>
                <span className="gift-points">{r.puntos} pts</span>
                <div className="gift-actions">
                  <button onClick={() => editarRegalo(r)}>✏️</button>
                  <button onClick={() => eliminarRegalo(r.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
