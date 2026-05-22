// src/config/db.js
import pg from 'pg';
import { logger } from './logger.js';

const { Pool } = pg;

const pool = new Pool({
  host:     process.env.POSTGRES_HOST     || 'localhost',
  port:     parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB       || 'edefense',
  user:     process.env.POSTGRES_USER     || 'edefense_user',
  password: process.env.POSTGRES_PASSWORD || 'changeme_in_production',
  max:      20,           // connexions max dans le pool
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  logger.error('Erreur pool PostgreSQL inattendue', { error: err.message });
});

// Vérification de connexion au démarrage
export async function connectDB() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    logger.info('✅ PostgreSQL connecté avec succès');
  } finally {
    client.release();
  }
}

// Helper : query simple
export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (duration > 1000) {
    logger.warn('Requête lente détectée', { text: text.slice(0, 80), duration });
  }
  return res;
}

// Helper : transaction
export async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export default pool;
