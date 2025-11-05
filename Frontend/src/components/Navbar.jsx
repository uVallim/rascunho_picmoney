// Em src/components/Navbar.jsx
import React from 'react';
import styles from './Navbar.module.css';
import ThemeToggle from './ThemeToggle'; // 1. IMPORTE O BOTÃO

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <h1>Visão Geral do Dashboard</h1>
      
      {/* 2. ADICIONE O BOTÃO AQUI */}
      <div className={styles.navControls}>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar;