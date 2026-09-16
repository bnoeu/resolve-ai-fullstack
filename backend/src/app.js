const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Rota não encontrada
app.use((req, res, next) => next(new AppError('Rota não encontrada', 404)));

// Tratamento central de erros
app.use(errorHandler);

module.exports = app;
