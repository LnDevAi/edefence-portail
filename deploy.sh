#!/bin/bash
# Script de déploiement E-DÉFENCE Portail — edefence.tech
# Usage: bash deploy.sh
set -e

DOMAIN="edefence.tech"
EMAIL="lndubf@gmail.com"
REPO="https://github.com/LnDevAi/edefence-portail.git"
APP_DIR="/opt/edefence-portail"

echo "=== E-DÉFENCE Portail — Déploiement ==="

# 1. Docker
if ! command -v docker &>/dev/null; then
  echo "[1/6] Installation de Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker --now
else
  echo "[1/6] Docker déjà installé."
fi

# 2. Clone / pull
if [ -d "$APP_DIR/.git" ]; then
  echo "[2/6] Mise à jour du dépôt..."
  git -C "$APP_DIR" pull origin main
else
  echo "[2/6] Clonage du dépôt..."
  git clone "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"

# 3. Fichier .env
if [ ! -f backend/.env ]; then
  echo "[3/6] Création du fichier .env..."
  cp backend/.env.example backend/.env
  read -p "  SECRET_KEY (min 32 chars) : " SECRET_KEY
  read -p "  ADMIN_EMAIL               : " ADMIN_EMAIL
  read -s -p "  ADMIN_PASSWORD            : " ADMIN_PASSWORD; echo
  read -p "  ANTHROPIC_API_KEY         : " ANTHROPIC_API_KEY
  read -p "  POSTGRES_USER (edefence)  : " PG_USER; PG_USER="${PG_USER:-edefence}"
  read -s -p "  POSTGRES_PASSWORD        : " PG_PASS; echo

  cat > backend/.env <<EOF
DATABASE_URL=postgresql+asyncpg://${PG_USER}:${PG_PASS}@postgres:5432/edefence_portail
SECRET_KEY=${SECRET_KEY}
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
FRONTEND_URL=https://${DOMAIN}
ALLOWED_ORIGINS=["https://${DOMAIN}","https://www.${DOMAIN}"]
DEBUG=false
POSTGRES_USER=${PG_USER}
POSTGRES_PASSWORD=${PG_PASS}
EOF
  echo "  .env créé."
else
  echo "[3/6] .env déjà présent."
fi

# 4. Démarrage HTTP (avant certificat)
echo "[4/6] Démarrage nginx HTTP (challenge Let's Encrypt)..."
cp nginx/conf.d/edefence-http.conf nginx/conf.d/default.conf
rm -f nginx/conf.d/edefence.conf
docker compose up -d nginx api postgres

# 5. Certificat Let's Encrypt
echo "[5/6] Obtention du certificat Let's Encrypt..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" -d "www.$DOMAIN"

# Activer la config HTTPS
cp nginx/conf.d/edefence.conf nginx/conf.d/default.conf
docker compose exec nginx nginx -s reload

# 6. Migrations Alembic
echo "[6/6] Migrations base de données..."
docker compose exec api alembic upgrade head

echo ""
echo "=== Déploiement terminé ==="
echo "    https://${DOMAIN}"
