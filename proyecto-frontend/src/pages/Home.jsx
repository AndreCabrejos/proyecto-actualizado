// src/pages/Home.jsx
import CanalesRecomendados from "../components/CanalesRecomendados";
import "./Home.css";

export default function Home({ isLoggedIn, userRole }) {
  return (
    <div className="home-layout">
      <aside className="canales-sidebar">
        <CanalesRecomendados
          isLoggedIn={isLoggedIn}
          userRole={userRole}
        />
      </aside>

      <section className="home-content">
        <h2>Bienvenido a Streamoria</h2>
        <p>Explora canales en vivo y descubre nuevos creadores.</p>
      </section>
    </div>
  );
}
