# Maintenance Mode Guide

## Enabling Maintenance Mode

To enable maintenance mode on your VPS:

1. **Edit the .env file:**
   \`\`\`bash
   nano ~/htdocs/.env
   \`\`\`

2. **Set maintenance mode variables:**
   \`\`\`env
   MAINTENANCE_MODE=true
   NEXT_PUBLIC_MAINTENANCE_END_TIME=2025-01-15T14:30:00Z
   NEXT_PUBLIC_MAINTENANCE_REASON=scheduled maintenance
   \`\`\`

3. **Save and rebuild:**
   \`\`\`bash
   npm run build
   pm2 restart holycityofgod --update-env
   \`\`\`

## Configuration Options

### MAINTENANCE_MODE
- `true` - Enables maintenance mode (redirects all visitors to /maintenance page)
- `false` - Disables maintenance mode (normal operation)

### NEXT_PUBLIC_MAINTENANCE_END_TIME
- Format: ISO 8601 date string (e.g., `2025-01-15T14:30:00Z`)
- Displays countdown timer on maintenance page
- Leave empty to hide countdown

### NEXT_PUBLIC_MAINTENANCE_REASON
- Custom message for why site is down
- Examples:
  - `scheduled maintenance`
  - `system upgrades`
  - `database migration`
  - `server maintenance`

### MAINTENANCE_BYPASS_IPS (Optional)
- Comma-separated list of IP addresses that can bypass maintenance mode
- Useful for admin access during maintenance
- Example: `MAINTENANCE_BYPASS_IPS=127.0.0.1,192.168.1.100`

## Common Maintenance Scenarios

### Building/Rebuilding (30 minutes)
\`\`\`env
MAINTENANCE_MODE=true
NEXT_PUBLIC_MAINTENANCE_END_TIME=2025-01-15T14:30:00Z
NEXT_PUBLIC_MAINTENANCE_REASON=system updates and improvements
\`\`\`

### Database Migration (varies)
\`\`\`env
MAINTENANCE_MODE=true
NEXT_PUBLIC_MAINTENANCE_END_TIME=
NEXT_PUBLIC_MAINTENANCE_REASON=database migration
\`\`\`

### Emergency Maintenance
\`\`\`env
MAINTENANCE_MODE=true
NEXT_PUBLIC_MAINTENANCE_END_TIME=
NEXT_PUBLIC_MAINTENANCE_REASON=emergency maintenance
\`\`\`

## Disabling Maintenance Mode

1. **Edit .env file:**
   \`\`\`bash
   nano ~/htdocs/.env
   \`\`\`

2. **Set MAINTENANCE_MODE to false:**
   \`\`\`env
   MAINTENANCE_MODE=false
   \`\`\`

3. **Restart application:**
   \`\`\`bash
   pm2 restart holycityofgod --update-env
   \`\`\`

Note: No rebuild needed when disabling maintenance mode.