// Em backend/index.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const iconv = require('iconv-lite'); // *** NOSSO NOVO "TRADUTOR" ***

// --- Função Auxiliar para Ler CSV ---
const readCsvFile = (filename) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, 'data', filename);

    // *** A CORREÇÃO DE ENCODING FINAL ***
    fs.createReadStream(filePath) // 1. Lê os bytes brutos (sem encoding)
      // 2. "Traduz" o stream do formato Windows para UTF-8
      .pipe(iconv.decodeStream('latin1'))
      // 3. Envia o stream limpo para o parser
      .pipe(csv({
        separator: ';',
        mapHeaders: ({ header }) => header.replace(/\ufeff/g, '').trim()
      }))
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        // O filtro continua o mesmo
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

// --- Rotas ---
// (As 4 rotas de API continuam exatamente iguais)

app.get('/api/mensagem', (req, res) => {
  res.json({ message: 'Olá do Backend Express!' });
});

app.post('/api/enviar', (req, res) => {
  const { dadosDoFrontend } = req.body;
  console.log('Recebido do frontend:', dadosDoFrontend);
  res.status(200).json({ status: 'Sucesso!', recebido: dadosDoFrontend });
});

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

// --- Iniciar o Servidor ---
app.listen(port, () => {
  console.log(`Servidor backend rodando na porta ${port}`);
});