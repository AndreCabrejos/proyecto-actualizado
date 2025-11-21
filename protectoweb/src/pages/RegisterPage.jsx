// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', role: 'viewer' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        // Si el backend devuelve token (opcional), guardarlo
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role);
        }
        alert('Cuenta creada');
        navigate('/');
      } else {
        alert(data.error || 'Error al registrar');
      }
    } catch (err) {
      console.error(err);
      alert('Error al registrar');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleSubmit}>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Correo" required />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Contraseña" required />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="viewer">Viewer</option>
            <option value="streamer">Streamer</option>
          </select>
          <button type="submit">Registrarme</button>
        </form>
      </div>
    </div>
  );
}
