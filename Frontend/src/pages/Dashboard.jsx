// Em src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import FlowChart from '../components/FlowChart';
import CategoryChart from '../components/CategoryChart'; // 1. IMPORTE O NOVO GRÁFICO
import styles from './Dashboard.module.css';

function Dashboard() {
  // Estados para os dados
  const [playersData, setPlayersData] = useState([]);
  const [cuponsData, setCuponsData] = useState([]);
  const [lojasData, setLojasData] = useState([]);
  const [pedestresData, setPedestresData] = useState([]);

  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para buscar os dados
  useEffect(() => {
    const fetchData = (url) => 
      fetch(url).then((res) => {
        if (!res.ok) {
          throw new Error(`Falha ao carregar dados de: ${url}`);
        }
        return res.json();
      });

    Promise.all([
      fetchData('http://localhost:3000/api/players'),
      fetchData('http://localhost:3000/api/cupons'),
      fetchData('http://localhost:3000/api/lojas'),
      fetchData('http://localhost:3000/api/pedestres'),
    ])
      .then(([players, cupons, lojas, pedestres]) => {
        
        // 2. LIMPAMOS o 'console.log("RAIO-X")' daqui
        
        setPlayersData(players);
        setCuponsData(cupons);
        setLojasData(lojas);
        setPedestresData(pedestres);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar dados:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []); // Array vazio, roda só uma vez

  // --- Lógica de Renderização ---

  if (loading) {
    return (
      <div className={styles.dashboardContent}>
        <h1>Dashboard Principal</h1>
        <p>Carregando dados de todas as planilhas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardContent}>
        <h1>Dashboard Principal</h1>
        <p style={{ color: 'red' }}>Erro: {error}</p>
      </div>
    );
  }

  // --- Renderização de Sucesso ---
  return (
    <div className={styles.dashboardContent}>
      <h1>Visão Geral</h1>
      
      {/* 3. ATUALIZE A CLASSE: Cards de Resumo (KPIs) */}
      <div className={styles.kpiGrid}>
        <Card title="Total de Players Cadastrados" content={`${playersData.length} players`} />
        <Card title="Total de Cupons Capturados" content={`${cuponsData.length} cupons`} />
        <Card title="Total de Lojas Registradas" content={`${lojasData.length} lojas`} />
        <Card title="Total de Pedestres (Av. Paulista)" content={`${pedestresData.length} registros`} />
      </div>

      {/* 4. ADICIONE A NOVA SEÇÃO: Gráficos */}
      <div className={styles.chartGrid}>
        <FlowChart 
          title="Fluxo de Pedestres por Hora"
          data={pedestresData}
        />
        <CategoryChart 
          title="Top 10 Categorias de Cupons"
          data={cuponsData}
        />
      </div>

      {/* Tabela de Dados (agora por último) */}
      <DataTable
        title="Últimos Players Cadastrados (Amostra)"
        data={playersData.slice(0, 10)} 
      />
    </div>
  );
}

export default Dashboard;