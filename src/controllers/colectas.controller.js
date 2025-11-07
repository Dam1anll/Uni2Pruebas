
// src/controllers/colectas.controller.js
async function createColecta(pool, datos) {
  // pool: instancia de pg.Pool
  const { titulo, descripcion = null, objetivo } = datos;

  // usar transacción por buenas prácticas
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const insertQuery = `
      INSERT INTO colectas (titulo, descripcion, objetivo)
      VALUES ($1, $2, $3)
      RETURNING id, titulo, descripcion, objetivo, monto_recaudado, fecha_creacion;
    `;
    const { rows } = await client.query(insertQuery, [titulo, descripcion, objetivo]);
    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  createColecta
};
