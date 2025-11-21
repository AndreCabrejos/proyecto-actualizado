// src/components/LoginModal.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Llamamos al handler del padre que hace la petición al backend
    await onLogin(email, password);

    // Cerrar modal (el padre ya maneja redirección)
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo" required />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" required />
          <button type="submit">Entrar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}
