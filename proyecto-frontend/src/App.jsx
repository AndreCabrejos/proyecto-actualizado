// src/App.jsx
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import Home from "./pages/Home";
import Nosotros from "./pages/Nosotros";
import TyC from "./pages/TyC";
import StreamerPage from "./pages/StreamerPage";
import ViewerPage from "./pages/ViewerPage";
import RegisterPage from "./pages/RegisterPage";
import ComprarMonedas from "./pages/ComprarMonedas";
import PerfilPage from "./pages/PerfilPage";

export default function App() {
  const navigate = useNavigate();

  // Usuario actual desde localStorage (una sola vez)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    !!localStorage.getItem("currentUser")
  );

  const [userRole, setUserRole] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved).role : null;
  });

  const [currentUserEmail, setCurrentUserEmail] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved).email : null;
  });

  // Monedas
  const [monedas, setMonedas] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    if (!saved) return 0;
    const parsed = JSON.parse(saved);
    return parsed.monedas ?? 0;
  });

  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (email, password) => {
    // DEMO streamer
    if (email === "streamer@streamoria.com" && password === "1234") {
      const demoStreamer = {
        email,
        username: "StreamerDemo",
        role: "streamer",
        monedas: 0,
      };

      setIsLoggedIn(true);
      setUserRole("streamer");
      setShowLogin(false);
      setMonedas(0);
      setCurrentUserEmail(email);
      setCurrentUser(demoStreamer);
      localStorage.setItem("currentUser", JSON.stringify(demoStreamer));

      navigate("/streamer");
      return;
    }

    // DEMO viewer
    if (email === "viewer@streamoria.com" && password === "1234") {
      const demoViewer = {
        email,
        username: "ViewerDemo",
        role: "viewer",
        monedas: 0,
      };

      setIsLoggedIn(true);
      setUserRole("viewer");
      setShowLogin(false);
      setMonedas(0);
      setCurrentUserEmail(email);
      setCurrentUser(demoViewer);
      localStorage.setItem("currentUser", JSON.stringify(demoViewer));

      navigate("/viewer/ryuplayer");
      return;
    }

    // Usuarios registrados
    const registrados = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const emailNormalizado = email.trim().toLowerCase();

    const encontrado = registrados.find(
      (u) => u.email === emailNormalizado && u.password === password
    );

    if (encontrado) {
      setIsLoggedIn(true);
      setUserRole(encontrado.role);
      setShowLogin(false);
      setMonedas(encontrado.monedas ?? 0);
      setCurrentUserEmail(encontrado.email);
      setCurrentUser(encontrado);
      localStorage.setItem("currentUser", JSON.stringify(encontrado));

      if (encontrado.role === "streamer") {
        navigate("/streamer");
      } else {
        navigate("/viewer/ryuplayer");
      }
    } else {
      alert("Correo o contraseña incorrectos");
    }
  };

  // ✅ Sincronizar monedas con localStorage SIN bucle infinito
  useEffect(() => {
    if (!currentUserEmail) return;

    // actualizar lista de usuarios
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const actualizados = usuarios.map((u) =>
      u.email === currentUserEmail ? { ...u, monedas } : u
    );
    localStorage.setItem("usuarios", JSON.stringify(actualizados));

    // actualizar currentUser y localStorage/currentUser
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const actualizado = { ...prev, monedas };
      localStorage.setItem("currentUser", JSON.stringify(actualizado));
      return actualizado;
    });
  }, [monedas, currentUserEmail]); // 👈 ya NO depende de currentUser

  // Evento global para abrir login después del registro
  useEffect(() => {
    const handler = () => setShowLogin(true);
    window.addEventListener("openLoginModal", handler);
    return () => window.removeEventListener("openLoginModal", handler);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUserEmail(null);
    setMonedas(0);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
        monedas={monedas}
        currentUserEmail={currentUserEmail}
        currentUserName={currentUser?.username || null}
      />

      <main>
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={<Home isLoggedIn={isLoggedIn} userRole={userRole} />}
          />

          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/tyc" element={<TyC />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/comprar"
            element={
              isLoggedIn ? (
                <ComprarMonedas monedas={monedas} setMonedas={setMonedas} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* STREAMER */}
          <Route
            path="/streamer/*"
            element={
              isLoggedIn && userRole === "streamer" ? (
                <StreamerPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* VIEWER */}
          <Route
            path="/viewer/:canal"
            element={
              isLoggedIn && userRole === "viewer" ? (
                <ViewerPage
                  monedas={monedas}
                  setMonedas={setMonedas}
                  currentUserEmail={currentUser?.email || null}
                  currentUserName={currentUser?.username || null}
                  isLoggedIn={isLoggedIn}
                  userRole={userRole}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* PERFIL */}
          <Route
            path="/perfil"
            element={
              isLoggedIn ? (
                <PerfilPage
                  currentUserEmail={currentUser?.email || null}
                  currentUserName={currentUser?.username || null}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </main>

      <Footer />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}
    </>
  );
}
