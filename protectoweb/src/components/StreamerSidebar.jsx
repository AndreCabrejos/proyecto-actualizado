import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaTrophy, FaCog, FaStore, FaVideo, FaBars } from 'react-icons/fa';
import './StreamerSidebar.css';

export default function StreamerSidebar() {
  return (
    <aside className="streamer-sidebar">
      <div className="sidebar-header">
        <FaBars className="menu-icon" />
        <span className="sidebar-title">Stream</span>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/streamer" end className={({ isActive }) => isActive ? 'active' : ''}>
              <FaVideo />
              <span>Stream</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/streamer/ingresos" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaChartLine />
              <span>Ingresos</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/streamer/logros" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaTrophy />
              <span>Logros</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/streamer/estudio" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaStore />
              <span>Estudio</span>
            </NavLink>
          </li>
          <li className="nav-dropdown">
            <a href="#canal">
              <FaVideo />
              <span>Canal</span>
              <span className="dropdown-arrow"></span>
            </a>
            <ul className="dropdown-menu">
              <li><NavLink to="/streamer/canal/gestion">Gestión</NavLink></li>
              <li><NavLink to="/streamer/canal/comunidad">Comunidad</NavLink></li>
            </ul>
          </li>
          <li className="nav-dropdown">
            <a href="#ajustes">
              <FaCog />
              <span>Ajustes</span>
              <span className="dropdown-arrow"></span>
            </a>
            <ul className="dropdown-menu">
              <li><NavLink to="/streamer/ajustes/general">General</NavLink></li>
              <li><NavLink to="/streamer/ajustes/privacidad">Privacidad</NavLink></li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
}