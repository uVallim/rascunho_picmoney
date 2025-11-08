// Em src/pages/PaginaCTO.jsx
import React, { useState, useEffect } from 'react';
import FlowChart from '../components/FlowChart';
import AdoptionChart from '../components/AdoptionChart';
import AgeAdoptionChart from '../components/AgeAdoptionChart';
import GenderAdoptionChart from '../components/GenderAdoptionChart';
import DeviceTypeChart from '../components/DeviceTypeChart'; // 1. IMPORTE O NOVO GRÁFICO
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
  if (loading) { /* ... */ }
  if (error) { /* ... */ }

  // --- Renderização de Sucesso ---
  return (
    <div className={styles.dashboardContent}>
      <h1>Visão do CTO</h1>
      <p>Foco no fluxo de usuários, adoção do app e perfil técnico-demográfico.</p>
      
      {/* Grid 1: Fluxo e Adoção Geral */}
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

      {/* Grid 2: Perfil Demográfico dos Usuários do App */}
      <div className={styles.chartGrid}>
        <AgeAdoptionChart
          title="Adoção do App por Faixa Etária"
          data={pedestresData}
        />
        <GenderAdoptionChart
          title="Adoção do App por Gênero"
          data={pedestresData}
        />
      </div>
      
      {/* 2. ADICIONE O NOVO GRÁFICO DE DISPOSITIVOS AQUI */}
      <DeviceTypeChart
        title="Market Share de Dispositivos (Pedestres)"
        data={pedestresData}
      />
      
    </div>
  );
}

export default DeviceTypeChart; 