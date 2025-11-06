// Em backend/index.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
// Importamos o 'tradutor' de encoding
const iconv = require('iconv-lite'); 

// --- Função Auxiliar (A mesma que já temos) ---
const readCsvFile = (filename) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, 'data', filename);

    fs.createReadStream(filePath)
      .pipe(iconv.decodeStream('latin1')) // Decodifica de latin1 (Windows)
      .pipe(csv({
        separator: ';',
        mapHeaders: ({ header }) => header.replace(/\ufeff/g, '').trim()
      }))
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        const cleanResults = results.filter(row => {
          const firstValue = Object.values(row)[0];
          return firstValue && !String(firstValue).startsWith('Pgina');
        });
        console.log(`[CSV Reader] ${filename}: ${cleanResults.length} linhas lidas.`);
        resolve(cleanResults);
      })
      .on('error', (error) => {
        console.error(`Erro ao ler o arquivo CSV ${filename}:`, error);
        reject(error);
      });
  });
};

// --- Configuração de Middlewares ---
app.use(cors());
app.use(express.json());

// --- ROTAS DE DADOS BÁSICAS (As 4 que já tínhamos) ---

app.get('/api/players', async (req, res) => {
  try {
    const players = await readCsvFile('players.csv');
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao ler dados de players.' });
  }
});
app.get('/api/cupons', async (req, res) => {
  try {
    const cupons = await readCsvFile('cupons.csv');
    res.json(cupons);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao ler dados de cupons.' });
  }
});
app.get('/api/lojas', async (req, res) => {
  try {
    const lojas = await readCsvFile('lojas.csv');
    res.json(lojas);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao ler dados de lojas.' });
  }
});
app.get('/api/pedestres', async (req, res) => {
  try {
    const pedestres = await readCsvFile('pedestres.csv');
    res.json(pedestres);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao ler dados de pedestres.' });
  }
});

// --- *** NOSSA NOVA ROTA DE "RELACIONAMENTO" *** ---
app.get('/api/valor-por-bairro', async (req, res) => {
  try {
    console.log('[API /valor-por-bairro] Iniciando cruzamento de dados...');

    // 1. Carrega os dois arquivos em paralelo
    const [players, cupons] = await Promise.all([
      readCsvFile('players.csv'),
      readCsvFile('cupons.csv')
    ]);

    // 2. Cria um "mapa" (dicionário) para consulta rápida
    //    mapaPlayers = { 'celular_123': 'Bairro A', 'celular_456': 'Bairro B' }
    const playerMap = new Map();
    for (const player of players) {
      if (player.celular && player.bairro_residencial) {
        playerMap.set(player.celular, player.bairro_residencial);
      }
    }
    console.log(`[API /valor-por-bairro] Mapa de ${playerMap.size} players criado.`);

    // 3. Processa os cupons e soma os valores por bairro
    const bairroCounts = {}; // { 'Bairro A': 150.50, 'Bairro B': 200.00 }

    for (const cupom of cupons) {
      // Encontra o bairro do player usando o 'celular' do cupom
      const bairro = playerMap.get(cupom.celular);
      
      // Converte o 'valor_cupom' (ex: "15,50") para um número (ex: 15.50)
      const valor = parseFloat(cupom.valor_cupom.replace(',', '.'));

      // Se achamos o bairro E o valor é um número válido...
      if (bairro && !isNaN(valor)) {
        if (!bairroCounts[bairro]) {
          bairroCounts[bairro] = 0;
        }
        bairroCounts[bairro] += valor;
      }
    }

    // 4. Formata os dados para o gráfico
    //    [ { name: 'Bairro A', total: 150.50 }, ... ]
    const chartData = Object.keys(bairroCounts).map(bairroName => ({
      name: bairroName,
      total: parseFloat(bairroCounts[bairroName].toFixed(2)) // Arredonda
    }))
    .sort((a, b) => b.total - a.total); // Ordena do maior para o menor

    console.log(`[API /valor-por-bairro] Dados cruzados. Enviando ${chartData.length} bairros.`);
    res.json(chartData);

  } catch (error) {
    console.error('[API /valor-por-bairro] Erro:', error);
    res.status(500).json({ error: 'Falha ao cruzar dados.' });
  }
});


// --- Iniciar o Servidor ---
app.listen(port, () => {
  console.log(`Servidor backend rodando na porta ${port}`);
});