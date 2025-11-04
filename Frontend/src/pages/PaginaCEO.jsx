// Em src/pages/PaginaCEO.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import CategoryChart from '../components/CategoryChart';
import StoreTypeChart from '../components/StoreTypeChart'; // 1. IMPORTE O NOVO GRÁFICO
import styles from './Dashboard.module.css'; 

function PaginaCEO() {
  // --- Estados e Lógica de Fetch ---
  const [playersData, setPlayersData] = useState([]);
  const [cuponsData, setCuponsData] = useState([]);
  const [lojasData, setLojasData] = useState([]); // 2. ADICIONE O ESTADO DE LOJAS
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

    // 3. ATUALIZE O PROMISE.ALL (agora busca 3 APIs)
    Promise.all([
      fetchData('http://localhost:3000/api/players'),
      fetchData('http://localhost:3000/api/cupons'),
      fetchData('http://localhost:3000/api/lojas'), // Adicionado
    ])
      .then(([players, cupons, lojas]) => {
        setPlayersData(players);
        setCuponsData(cupons);
        setLojasData(lojas); // Adicionado
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
      <p>Foco em aquisição de clientes, performance de cupons e tipos de loja.</p>

      {/* 4. Criamos um grid para os gráficos do CEO */}
      <div className={styles.chartGrid}>
        <CategoryChart
          title="Top 10 Categorias de Cupons"
          data={cuponsData}
        />
        {/* 5. ADICIONE O NOVO GRÁFICO AQUI */}
        <StoreTypeChart
          title="Distribuição por Tipo de Loja"
          data={lojasData}
        />
      </div>

      <DataTable
        title="Novos Players Cadastrados (Amostra)"
        data={playersData.slice(0, 10)}
      />
    </div>
  );
}

export default PaginaCEO;