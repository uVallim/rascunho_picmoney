// Em src/pages/PaginaCEO.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import CategoryChart from '../components/CategoryChart';
import StoreTypeChart from '../components/StoreTypeChart';
import NeighborhoodChart from '../components/NeighborhoodChart'; // 1. IMPORTE O NOVO GRÁFICO
import styles from './Dashboard.module.css'; 

function PaginaCEO() {
  // --- Estados e Lógica de Fetch ---
  // (Note que esta página NÃO precisa mais buscar os dados de 'cupons' e 'players'
  // se os componentes filhos (DataTable, CategoryChart) também se tornarem "inteligentes".
  // Mas, por enquanto, vamos manter como está para os primeiros componentes.)
  const [playersData, setPlayersData] = useState([]);
  const [cuponsData, setCuponsData] = useState([]);
  const [lojasData, setLojasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    ])
      .then(([players, cupons, lojas]) => {
        setPlayersData(players);
        setCuponsData(cupons);
        setLojasData(lojas);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar dados do CEO:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // --- Lógica de Renderização ---

  if (loading) {
    return (
      <div className={styles.dashboardContent}>
        <h1>Visão do CEO</h1>
        <p>Carregando dados financeiros e de clientes...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.dashboardContent}>
        <h1>Visão do CEO</h1>
        <p style={{ color: 'red' }}>Erro: {error}</p>
      </div>
    );
  }

  // --- Renderização de Sucesso ---
  return (
    <div className={styles.dashboardContent}>
      <h1>Visão do CEO</h1>
      <p>Foco em aquisição de clientes, performance de cupons e receita regional.</p>

      {/* Grid com os gráficos de Categoria e Tipo de Loja */}
      <div className={styles.chartGrid}>
        <CategoryChart
          title="Top 10 Categorias de Cupons"
          data={cuponsData}
        />
        <StoreTypeChart
          title="Distribuição por Tipo de Loja"
          data={lojasData}
        />
      </div>

      {/* 2. ADICIONE O NOVO GRÁFICO DE BAIRROS AQUI */}
      {/* (Ele ficará em uma nova linha, em largura total) */}
      <NeighborhoodChart />

      {/* Tabela de Players (agora por último) */}
      <DataTable
        title="Novos Players Cadastrados (Amostra)"
        data={playersData.slice(0, 10)}
      />
    </div>
  );
}

export default PaginaCEO;