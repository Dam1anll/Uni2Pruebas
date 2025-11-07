// tests/integration/colecta.integration.test.js
const request = require("supertest");
const { createPool } = require("../../src/db");
const createApp = require("../../src/app");
require("dotenv").config();

const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgresql://postgres:admin123@localhost:5432/Uni2PruebasTest";

let pool;
let app;

beforeAll(async () => {
  pool = createPool(TEST_DATABASE_URsL);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS colectas (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      objetivo NUMERIC NOT NULL CHECK (objetivo > 0),
      monto_recaudado NUMERIC DEFAULT 0,
      fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `);
  app = createApp({ pool });
});

afterAll(async () => {
  await pool.query("TRUNCATE TABLE colectas RESTART IDENTITY CASCADE;");
  await pool.end();
});

describe("POST /api/colectas - integración", () => {
  test("Crea una colecta y se persiste en la BD", async () => {
    const payload = {
      titulo: "Test Colecta",
      descripcion: "Descripción de prueba",
      objetivo: 1000,
    };

    const res = await request(app)
      .post("/api/colectas")
      .send(payload)
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.titulo).toBe(payload.titulo);
    expect(Number(res.body.objetivo)).toBe(payload.objetivo);

    // verificación directa en BD
    const dbRes = await pool.query("SELECT * FROM colectas WHERE id = $1", [
      res.body.id,
    ]);
    expect(dbRes.rowCount).toBe(1);
    expect(dbRes.rows[0].titulo).toBe(payload.titulo);
  });
});
