// Em src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar() {
  const getNavLinkClass = ({ isActive }) => {
    return isActive ? `${styles.link} ${styles.linkActive}` : styles.link;
  };

  return (
    <aside className={styles.sidebar}>
      {/* --- 1. MUDANÇA DE NOME --- */}
      <h2>EasyView</h2>
      <p className={styles.clientName}>Análise para PicMoney</p>
      
      <ul className={styles.sidebarList}>
        <li>
          <NavLink to="/" className={getNavLinkClass} end>
            Visão Geral
          </NavLink>
        </li>
        <li>
          <NavLink to="/ceo" className={getNavLinkClass}>
            Visão CEO
          </NavLink>
        </li>
        <li>
          <NavLink to="/cto" className={getNavLinkClass}>
            Visão CTO
          </NavLink>
        </li>
        
        {/* --- 2. ADICIONAMOS UM SEPARADOR E O NOVO LINK --- */}
        <li className={styles.navSeparator}></li>
        <li>
          <NavLink to="/sobre" className={getNavLinkClass}>
            Sobre Nós
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;