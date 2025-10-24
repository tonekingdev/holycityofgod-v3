#!/bin/bash
set -e

echo "Starting deployment process..."

# Transfer files as root (has write access)
VPS_USER="root"
VPS_HOST="31.97.41.98"
VPS_PATH="/home/holycityofgod/htdocs"

echo "Building Next.js application..."
npm run build || { echo "❌ Build failed!"; exit 1; }

echo "✅ Build successful! Transferring files..."

# Transfer files as root
scp -r app .next data public lib components hooks ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/
scp middleware.ts types.ts constants.ts package.json package-lock.json next.config.ts tsconfig.json ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/

echo "Fixing file ownership..."
ssh ${VPS_USER}@${VPS_HOST} "chown -R holycityofgod:holycityofgod ${VPS_PATH} && chmod -R 755 ${VPS_PATH}"

echo "Installing dependencies..."
ssh ${VPS_USER}@${VPS_HOST} "su - holycityofgod -c 'cd ${VPS_PATH} && rm -rf node_modules package-lock.json && npm install --omit=dev'"

echo "Restarting application..."
ssh ${VPS_USER}@${VPS_HOST} "su - holycityofgod -c 'cd ${VPS_PATH} && pm2 restart holycityofgod'"

echo "✅ Deployment complete!"