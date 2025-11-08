// Em src/components/PeriodOfDayChart.jsx
import React from 'react';
import styles from './PeriodOfDayChart.module.css';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// --- Função para classificar os períodos (do seu notebook) ---
const getPeriodo = (hora) => {
  if (hora >= 6 && hora < 12) return 'Manhã';
  if (hora >= 12 && hora < 18) return 'Tarde';
  if (hora >= 18 && hora < 24) return 'Noite';
  return 'Madrugada';
};

// --- Função para processar os dados ---
const processDataForChart = (data) => {
  // 1. Inicializa os contadores
  const periodoCounts = {
    'Manhã': 0,
    'Tarde': 0,
    'Noite': 0,
    'Madrugada': 0,
  };

  // 2. Itera sobre os dados
  data.forEach(row => {
    // 3. Pega a hora (ex: "14:30:00")
    const horaString = row.hora;
    if (!horaString) return;
    
    // Pega apenas a hora (ex: "14")
    const hora = parseInt(horaString.split(':')[0], 10);
    if (isNaN(hora)) return;

    // 4. Classifica o período
    const periodo = getPeriodo(hora);
    
    // 5. Converte o valor (ex: "15,50") para número
    const valor = parseFloat(row.valor_cupom.replace(',', '.'));
    
    if (periodo && !isNaN(valor)) {
      periodoCounts[periodo] += valor;
    }
  });

  // 6. Formata para o gráfico
  const chartData = Object.keys(periodoCounts).map(periodoName => ({
    name: periodoName,
    value: parseFloat(periodoCounts[periodoName].toFixed(2)),
  })).sort((a, b) => b.value - a.value); // Ordena

  return chartData;
};

// Cores para o gráfico
const COLORS = ['#FFBB28', '#00C49F', '#0088FE', '#FF8042'];

function PeriodOfDayChart({ title, data }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <h2>{title}</h2>
        <p>Sem dados para exibir.</p>
      </div>
    );
  }

  const chartData = processDataForChart(data);
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  if (totalValue === 0) { /* ... (código de 'total 0') ... */ }

  return (
    <div className={styles.chartContainer}>
      <h2>{title}</h2>
      {/* Alinhamos a altura com os outros gráficos do grid */}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={130}
            fill="#8884d8"
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, null]}
             wrapperStyle={{ 
              backgroundColor: 'var(--color-background-card)', 
              color: 'var(--color-text-primary)' 
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PeriodOfDayChart;