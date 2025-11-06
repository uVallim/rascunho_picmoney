// Em src/components/NeighborhoodChart.jsx
import React, { useState, useEffect } from 'react';
import styles from './NeighborhoodChart.module.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Função para formatar o valor como Moeda (BRL)
const formatAsCurrency = (value) => {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

function NeighborhoodChart() {
  // (A lógica de fetch continua a mesma)
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/valor-por-bairro')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          // Pegamos o Top 15 (incluindo o #1)
          setChartData(data.slice(0, 15));
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) { /* ... (código de 'loading' continua o mesmo) ... */ }
  if (error) { /* ... (código de 'error' continua o mesmo) ... */ }

  // Encontra o valor mínimo (exceto 0) para o eixo
  const minDomain = Math.min(...chartData.map(d => d.total).filter(t => t > 0));
  // Encontra o valor máximo
  const maxDomain = Math.max(...chartData.map(d => d.total));

  return (
    <div className={styles.chartContainer}>
      <h2>Receita por Bairro (Top 15) - Escala Logarítmica</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={chartData} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          
          {/* *** A MÁGICA ESTÁ AQUI ***
              1. scale="log": Muda a escala do eixo
              2. domain: Define o início e o fim (do menor valor ao maior)
              3. ticks: Força o Recharts a mostrar rótulos legíveis
          */}
          <XAxis 
            type="number" 
            scale="log"
            domain={[minDomain > 1000 ? minDomain * 0.9 : 1000, maxDomain]}
            tickFormatter={formatAsCurrency}
            ticks={[1000000, 1500000, 2000000, 2500000, 3000000]}
          />
          
          <YAxis dataKey="name" type="category" />
          <Tooltip 
            formatter={(value) => [formatAsCurrency(value), "Total em Cupons"]}
            wrapperStyle={{ 
              backgroundColor: 'var(--color-background-card)', 
              color: 'var(--color-text-primary)' 
            }}
          />
          <Legend />
          <Bar dataKey="total" fill="#FF8042" name="Valor Total (R$)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default NeighborhoodChart;