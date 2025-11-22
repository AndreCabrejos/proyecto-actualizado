// src/context/UserContext.jsx
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);   // datos reales del backend
  const [loading, setLoading] = useState(true);

  // ================================
  //  🔥 CARGAR PERFIL (GET /auth/me)
  // ================================
  const cargarPerfil = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user); // <-- AQUÍ viene: id, username, email, monedas, nivel, puntos, role
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error cargando perfil:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  //  🔐 LOGIN (POST /auth/login)
  // ================================
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error };
      }

      // Guardar token
      setToken(data.token);
      localStorage.setItem("token", data.token);

      // Cargar perfil REAL
      await cargarPerfil();

      return { success: true, role: data.user.role };

    } catch (error) {
      console.error(error);
      return { success: false, error: "Error de conexión" };
    }
  };

  // ================================
  //  🚪 LOGOUT
  // ================================
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // ================================
  //  🔄 Auto-cargar el perfil si hay token
  // ================================
  useEffect(() => {
    cargarPerfil();
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user,        // datos reales del usuario
        token,       // token JWT
        login,       // función de login
        logout,      // función de logout
        loading,     // estado de carga del usuario
        setUser      // útil para actualizar monedas/puntos sin recargar
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


