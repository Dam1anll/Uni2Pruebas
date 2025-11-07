
// scripts/run-migrations.js
const fs = require('fs');
const path = require('path');
const { createPool } = require('../src/db');
require('dotenv').config();

async function run() {
  const connectionString =
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL || process.env.TEST_DATABASE_URL;

  if (!connectionString) {
    console.error('No DATABASE_URL / TEST_DATABASE_URL defined');
    process.exit(1);
  }

  const pool = createPool(connectionString);

  try {
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log(`Running migration ${file}...`);
      await pool.query(sql);
    }
    console.log('Migrations executed');
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
