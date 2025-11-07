
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

function createPool(connectionString) {
  return new Pool({ connectionString });
}

module.exports = {
  createPool
};