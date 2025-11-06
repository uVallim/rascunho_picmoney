// Em src/pages/PaginaCTO.jsx
import React, { useState, useEffect } from 'react';
import FlowChart from '../components/FlowChart';
import AdoptionChart from '../components/AdoptionChart';
import AgeAdoptionChart from '../components/AgeAdoptionChart'; // 1. IMPORTE O NOVO GRÁFICO
import styles from './Dashboard.module.css'; 

function PaginaCTO() {
  // --- A lógica de Fetch (buscando 'pedestres.csv') continua a mesma ---
  const [pedestresData, setPedestresData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/pedestres')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Falha ao carregar dados de pedestres');
        }
        return res.json();
      })
      .then((data) => {
        setPedestresData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar dados do CTO:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // --- A lógica de Renderização (Loading, Error) continua a mesma ---
  if (loading) {
    return (
      <div className={styles.dashboardContent}>
        <h1>Visão do CTO</h1>
        <p>Carregando dados de tráfego e engajamento...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.dashboardContent}>
        <h1>Visão do CTO</h1>
        <p style={{ color: 'red' }}>Erro: {error}</p>
      </div>
    );
  }

  // --- Renderização de Sucesso ---
  return (
    <div className={styles.dashboardContent}>
      <h1>Visão do CTO</h1>
      <p>Foco no fluxo de usuários, adoção do app e perfil técnico.</p>
      
      {/* Grid com os dois primeiros gráficos */}
      <div className={styles.chartGrid}>
        <FlowChart
          title="Fluxo de Pedestres por Hora"
          data={pedestresData}
        />
        <AdoptionChart
          title="Taxa de Adoção do App (Pedestres)"
          data={pedestresData}
        />
      </div>

      {/* 2. ADICIONE O NOVO GRÁFICO AQUI */}
      {/* (Ele ficará em uma nova linha, em largura total) */}
      <AgeAdoptionChart
        title="Adoção do App por Faixa Etária"
        data={pedestresData}
      />
      
    </div>
  );
}

export default PaginaCTO;