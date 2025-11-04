// Em src/components/Navbar.jsx
import React from 'react';
import styles from './Navbar.module.css'; // O CSS Module continua valendo

function Navbar() {
  return (
    // ATUALIZADO: Agora é só uma barra no topo
    <nav className={styles.navbar}>
      <h1>Visão Geral do Dashboard</h1>
      {/* Poderíamos ter infos do usuário, ícone de sino, etc. aqui */}
    </nav>
  );
}

export default Navbar;