// src/App.jsx
import { useContext, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { UserContext } from "./context/UserContext";

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
import RecargarMonedas from "./components/RecargarMonedasModal";

export default function App() {
  const navigate = useNavigate();
  const { user, login, logout } = useContext(UserContext);

  const [showLogin, setShowLogin] = useState(false);
  const [showRecargarModal, setShowRecargarModal] = useState(false);

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      alert("Login correcto 🎉");

      if (result.role === "streamer") navigate("/streamer");
      else navigate("/");
      setShowLogin(false);
    } else {
      alert(result.error);
    }
  };

  return (
    <>
      <Header
        onLoginClick={() => setShowLogin(true)}
        onRecargarClick={() => setShowRecargarModal(true)}
      />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/tyc" element={<TyC />} />
          <Route path="/register" element={<RegisterPage />} />

          {user?.role === "streamer" && (
            <Route path="/streamer/*" element={<StreamerPage />} />
          )}

          {user?.role === "viewer" && (
            <>
              <Route path="/viewer/:canal" element={<ViewerPage />} />
              <Route path="/comprar" element={<ComprarMonedas />} />
            </>
          )}
        </Routes>
      </main>

      <Footer />

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}

      {showRecargarModal && (
        <RecargarMonedas onClose={() => setShowRecargarModal(false)} />
      )}
    </>
  );
}
