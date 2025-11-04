// Em src/pages/Sobre.jsx
import React from 'react';
// Vamos reutilizar o CSS do Dashboard para ter o mesmo fundo branco e padding
import styles from './Dashboard.module.css';

function Sobre() {
  return (
    // Usamos 'dashboardContent' para manter o estilo
    <div className={styles.dashboardContent}>
      <h1>Sobre a EasyView</h1>
      
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
        A **EasyView** é uma empresa fictícia especializada em Business Intelligence e Análise de Dados,
        focada em transformar dados brutos em insights acionáveis.
      </p>
      <p>
        Este dashboard é um projeto de demonstração desenvolvido para a **PicMoney**, 
        com o objetivo de analisar e visualizar dados de múltiplas fontes (Players, Cupons, Lojas e Tráfego de Pedestres)
        para impulsionar a tomada de decisão estratégica.
      </p>
      
      <h3>Tecnologias Utilizadas:</h3>
      <ul>
        <li>**Backend:** Node.js, Express, CSV-Parser, Iconv-Lite</li>
        <li>**Frontend:** React, Vite, React Router, Recharts</li>
      </ul>
    </div>
  );
}

export default Sobre;