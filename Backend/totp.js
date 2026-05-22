// src/utils/totp.js
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

authenticator.options = {
  window: 1, // Tolérance d'un pas (30s avant / après)
};

const ISSUER = process.env.TOTP_ISSUER || 'E-DEFENCE';

// Génère un secret TOTP aléatoire
export function generateTotpSecret() {
  return authenticator.generateSecret(32);
}

// Génère l'URL otpauth:// pour le QR code
export function generateOtpAuthUrl(userEmail, secret) {
  return authenticator.keyuri(userEmail, ISSUER, secret);
}

// Génère l'image QR code en base64 (data URI)
export async function generateQRCode(otpauthUrl) {
  return QRCode.toDataURL(otpauthUrl, {
    errorCorrectionLevel: 'M',
    width: 256,
    color: {
      dark: '#00f0ff',
      light: '#07080e',
    },
  });
}

// Vérifie un token TOTP
export function verifyTotpToken(token, secret) {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}
