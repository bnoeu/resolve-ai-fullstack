const app = require('./app');
const env = require('./config/env');

app.listen(env.port, () => {
  console.log(`API Resolve Aí rodando na porta ${env.port}`);
});
