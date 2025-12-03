#!/bin/bash
set -e

# Configuration
VPS_USER="root"
VPS_HOST="31.97.41.98"
VPS_PATH="/home/holycityofgod/htdocs"
BACKUP_DIR="/home/holycityofgod/backups/deployments"
MAX_BACKUPS=5
HEALTH_CHECK_URL="https://holycityofgod.org/api/health"
HEALTH_CHECK_RETRIES=5
HEALTH_CHECK_TIMEOUT=10

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}✅${NC} $1"
}

log_error() {
    echo -e "${RED}❌${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

backup_current_deployment() {
    log_info "Creating backup of current deployment..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="backup_$TIMESTAMP.tar.gz"
    
    ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${BACKUP_DIR} && cd ${VPS_PATH} && tar -czf ${BACKUP_DIR}/${BACKUP_FILE} . 2>/dev/null || true"
    
    log_info "Backup created: ${BACKUP_FILE}"
    
    # Clean up old backups
    ssh ${VPS_USER}@${VPS_HOST} "cd ${BACKUP_DIR} && ls -1t backup_*.tar.gz 2>/dev/null | tail -n +$((MAX_BACKUPS + 1)) | xargs rm -f 2>/dev/null || true"
}

rollback_deployment() {
    log_error "Deployment failed! Attempting rollback..."
    
    LATEST_BACKUP=$(ssh ${VPS_USER}@${VPS_HOST} "ls -1t ${BACKUP_DIR}/backup_*.tar.gz 2>/dev/null | head -n 1")
    
    if [ -n "$LATEST_BACKUP" ]; then
        log_info "Restoring from backup: $(basename $LATEST_BACKUP)"
        ssh ${VPS_USER}@${VPS_HOST} "cd ${VPS_PATH} && tar -xzf ${LATEST_BACKUP}"
        ssh ${VPS_USER}@${VPS_HOST} "cd ${VPS_PATH} && pm2 restart holycityofgod"
        log_info "Rollback completed"
    else
        log_error "No backup found for rollback!"
    fi
}

health_check() {
    log_info "Performing health check..."
    
    for i in $(seq 1 $HEALTH_CHECK_RETRIES); do
        log_info "Health check attempt $i/$HEALTH_CHECK_RETRIES..."
        
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$HEALTH_CHECK_TIMEOUT" "$HEALTH_CHECK_URL" || echo "000")
        
        if [ "$HTTP_CODE" = "200" ]; then
            log_info "Health check passed!"
            return 0
        fi
        
        if [ $i -lt $HEALTH_CHECK_RETRIES ]; then
            log_warn "Health check failed (HTTP $HTTP_CODE), retrying in 5 seconds..."
            sleep 5
        fi
    done
    
    log_error "Health check failed after $HEALTH_CHECK_RETRIES attempts"
    return 1
}

echo "Starting deployment process..."

backup_current_deployment

echo "Building Next.js application..."
npm run build || { log_error "Build failed!"; exit 1; }

log_info "Build successful! Transferring files..."

# Transfer files as root
scp -r app .next data public lib components hooks context scripts ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/ || { log_error "File transfer failed!"; rollback_deployment; exit 1; }
scp middleware.ts types.ts constants.ts package.json package-lock.json next.config.ts tsconfig.json ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/ || { log_error "File transfer failed!"; rollback_deployment; exit 1; }

echo "Fixing file ownership..."
ssh ${VPS_USER}@${VPS_HOST} "chown -R holycityofgod:holycityofgod ${VPS_PATH} && chmod -R 755 ${VPS_PATH}" || { log_error "Ownership fix failed!"; rollback_deployment; exit 1; }

echo "Installing dependencies..."
ssh ${VPS_USER}@${VPS_HOST} "su - holycityofgod -c 'cd ${VPS_PATH} && rm -rf node_modules package-lock.json && npm install --omit=dev'" || { log_error "Dependency installation failed!"; rollback_deployment; exit 1; }

echo "Restarting application..."
ssh ${VPS_USER}@${VPS_HOST} "su - holycityofgod -c 'cd ${VPS_PATH} && pm2 restart holycityofgod'" || { log_error "Application restart failed!"; rollback_deployment; exit 1; }

sleep 5

if ! health_check; then
    rollback_deployment
    exit 1
fi

log_info "Deployment complete!"