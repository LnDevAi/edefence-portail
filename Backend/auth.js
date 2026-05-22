// src/middleware/auth.js
import { verifyAccessToken } from '../utils/jwt.js';
import { query } from '../config/db.js';

// Vérifie le JWT et attache l'utilisateur à req
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    // Vérifier que l'utilisateur existe toujours et est actif
    const { rows } = await query(
      `SELECT id, email, full_name, role, is_active, totp_enabled
       FROM users WHERE id = $1`,
      [payload.sub]
    );

    if (!rows.length || !rows[0].is_active) {
      return res.status(401).json({ error: 'Utilisateur invalide ou désactivé' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Token invalide' });
  }
}

// Vérifie qu'un rôle spécifique est requis
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Accès refusé',
        required: roles,
        current: req.user.role,
      });
    }
    next();
  };
}

// Vérifie qu'un utilisateur accède uniquement à ses propres ressources
// (ou qu'il est admin)
export function assertClientOwnership(resourceClientId) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    if (req.user.role === 'admin') return next(); // Admin accède à tout

    const clientId = req.params[resourceClientId] || req.body[resourceClientId];
    if (clientId && clientId !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé à cette ressource' });
    }
    next();
  };
}

// Vérifie un abonnement actif
export async function requireSubscription(...types) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
    if (req.user.role === 'admin') return next();

    const { rows } = await query(
      `SELECT id FROM subscriptions
       WHERE user_id = $1
         AND type = ANY($2)
         AND status = 'active'
         AND (expires_at IS NULL OR expires_at > NOW())
       LIMIT 1`,
      [req.user.id, types]
    );

    if (!rows.length) {
      return res.status(403).json({
        error: 'Abonnement requis',
        required: types,
        code: 'SUBSCRIPTION_REQUIRED',
      });
    }
    next();
  };
}
