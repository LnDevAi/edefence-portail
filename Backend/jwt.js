// src/utils/jwt.js
import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'crypto';
import { query } from '../config/db.js';

const ACCESS_SECRET  = process.env.JWT_SECRET          || 'CHANGE_ME';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET  || 'CHANGE_ME_REFRESH';
const ACCESS_TTL     = process.env.JWT_EXPIRES_IN      || '15m';
const REFRESH_TTL    = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

// Génère un refresh token opaque et le stocke haché en BDD
export async function createRefreshToken(userId) {
  const raw = randomBytes(64).toString('hex');
  const hash = createHash('sha256').update(raw).digest('hex');

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

  await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, hash, expiresAt]
  );

  return raw; // Retourner le token brut (envoyé au client via cookie httpOnly)
}

// Valide le refresh token en base et retourne le user_id
export async function validateRefreshToken(rawToken) {
  const hash = createHash('sha256').update(rawToken).digest('hex');

  const { rows } = await query(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = $1
       AND revoked = false
       AND expires_at > NOW()`,
    [hash]
  );

  if (!rows.length) return null;
  return rows[0];
}

// Révoque un refresh token
export async function revokeRefreshToken(rawToken) {
  const hash = createHash('sha256').update(rawToken).digest('hex');
  await query(
    `UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1`,
    [hash]
  );
}

// Révoque tous les tokens d'un utilisateur (déconnexion forcée)
export async function revokeAllUserTokens(userId) {
  await query(
    `UPDATE refresh_tokens SET revoked = true WHERE user_id = $1`,
    [userId]
  );
}
