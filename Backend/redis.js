// src/config/redis.js
import { createClient } from 'redis';
import { logger } from './logger.js';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => {
  logger.error('Erreur Redis', { error: err.message });
});

redisClient.on('connect', () => {
  logger.info('✅ Redis connecté avec succès');
});

export async function connectRedis() {
  await redisClient.connect();
}

// Helper : stocker avec expiration
export async function setEx(key, value, ttlSeconds) {
  await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
}

// Helper : récupérer
export async function getKey(key) {
  const val = await redisClient.get(key);
  return val ? JSON.parse(val) : null;
}

// Helper : supprimer
export async function delKey(key) {
  await redisClient.del(key);
}

export default redisClient;
