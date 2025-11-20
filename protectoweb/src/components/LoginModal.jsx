import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token); // Guardar JWT
        localStorage.setItem('rol', data.user.rol); // Guardar rol
        alert('Login correcto 🎉');
        onClose();
        
        // Redirige según rol
        if (data.user.rol === 'streamer') navigate('/streamer');
        else navigate('/');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error en el login');
    }
  };

  const handleRegisterRedirect = () => {
    onClose();
    navigate('/register');
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
        <div style={{ marginTop: '1rem' }}>
          <p>¿No tienes una cuenta?</p>
          <button onClick={handleRegisterRedirect}>Crear cuenta</button>
        </div>
      </div>
    </div>
  );
}
