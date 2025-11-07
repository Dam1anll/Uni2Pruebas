
// src/server.js
const dotenv = require('dotenv');
dotenv.config();
const { createPool } = require('./db');
const createApp = require('./app');

const pool = createPool(process.env.DATABASE_URL);
const app = createApp({ pool });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Uni-2 backend listening on port ${PORT}`);
});
