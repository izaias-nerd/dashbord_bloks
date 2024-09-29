const express = require('express');
const path = require('path');
const axios = require('axios'); // Para fazer requisições HTTP
const bodyParser = require('body-parser'); // Para lidar com o JSON no body

const app = express();
const port = 3001;

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para analisar o JSON
app.use(bodyParser.json());

// Endpoint para processar e executar o workflow
app.post('/execute', async (req, res) => {
  const workflow = req.body.workflow; // Recebe o array de blocos conectados

  try {
    for (let block of workflow) {
      if (block.type === 'api') {
        // Bloco tipo API: faz requisição para uma API
        const response = await axios.get(block.apiUrl);
        console.log(`API Response: ${response.data}`);
      } else if (block.type === 'transform') {
        // Bloco tipo Transformação: executa transformação simples (ex: uppercase)
        console.log(`Transformando dados: ${block.transformationType}`);
      } else if (block.type === 'webhook') {
        // Bloco tipo Webhook: chama um webhook
        const webhookResponse = await axios.post(block.webhookUrl, { data: 'dados de exemplo' });
        console.log(`Webhook Response: ${webhookResponse.status}`);
      }
      // Adicione mais tipos de blocos conforme necessário
    }
    res.status(200).send('Workflow executado com sucesso');
  } catch (error) {
    console.error('Erro na execução do workflow', error);
    res.status(500).send('Erro na execução do workflow');
  }
});

// Serve arquivos estáticos e redireciona qualquer outra rota para index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
