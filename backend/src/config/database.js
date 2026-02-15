const { Pool } = require('pg');
require('dotenv').config();

// Soporta DATABASE_URL (Supabase/Railway) o variables individuales (local)
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      host:     process.env.DB_SERVER   || 'localhost',
      port:     parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME     || 'fleetmonitor',
      user:     process.env.DB_USER     || 'postgres',
      password: process.env.DB_PASSWORD || ''
    });

pool.on('error', (err) => {
  console.error('❌ Error en la conexión PostgreSQL:', err.message);
});

async function query(consulta, params = []) {
  const client = await pool.connect();
  try {
    const resultado = await client.query(consulta, params);
    return resultado;
  } finally {
    client.release();
  }
}

async function conectar() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conectado a PostgreSQL correctamente');
    return pool;
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
    throw err;
  }
}

module.exports = { pool, query, conectar };
