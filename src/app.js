
// src/app.js
const express = require('express');
const bodyParser = require('express').json;
const colectasRouter = require('./routes/colectas');

function createApp({ pool } = {}) {
  const app = express();
  app.use(bodyParser());

  // inyectar pool en req para handlers (alternativa: inyectar en controlador)
  app.use((req, res, next) => {
    if (pool) req.db = pool;
    next();
  });

  app.use('/api/colectas', colectasRouter);

  // manejador de errores simple
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = createApp;
