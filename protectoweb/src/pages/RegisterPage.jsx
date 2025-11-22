// src/pages/RegisterPage.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useContext(UserContext);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await register(form.username, form.email, form.password);

    if (result.ok) {
      alert("Cuenta creada exitosamente 🎉");
      navigate("/");
    } else {
      alert(result.message || "Error en el registro");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Nombre de usuario"
            required
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo"
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
            required
          />

          <button type="submit">Registrarme</button>
        </form>
      </div>
    </div>
  );
}

