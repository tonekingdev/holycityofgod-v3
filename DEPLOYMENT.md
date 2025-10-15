# Deployment Guide for Holy City of God Website

## Prerequisites

- SSH access to your VPS server
- Node.js and npm installed locally
- SCP access configured

## Deployment Steps

### Option 1: Using the Deployment Script (Recommended)

1. **Update VPS connection details** in `deploy.sh`:
   \`\`\`bash
   VPS_USER="holycityofgod"
   VPS_HOST="your-vps-hostname-or-ip"  # Update this!
   VPS_PATH="/home/holycityofgod/htdocs"
   \`\`\`

2. **Make the script executable**:
   \`\`\`bash
   chmod +x deploy.sh
   \`\`\`

3. **Run the deployment**:
   \`\`\`bash
   npm run deploy
   \`\`\`

### Option 2: Manual Deployment

If you prefer to deploy manually or need to transfer specific files:

1. **Build the application**:
   \`\`\`bash
   npm run build
   \`\`\`

2. **Transfer files to VPS**:
   \`\`\`bash
   # Transfer .next folder
   scp -r .next holycityofgod@your-vps:/home/holycityofgod/htdocs/

   # Transfer data folder (IMPORTANT - contains content.json)
   scp -r data holycityofgod@your-vps:/home/holycityofgod/htdocs/

   # Transfer public folder
   scp -r public holycityofgod@your-vps:/home/holycityofgod/htdocs/

   # Transfer configuration files
   scp package.json package-lock.json next.config.mjs holycityofgod@your-vps:/home/holycityofgod/htdocs/
   \`\`\`

3. **SSH into your VPS and restart the server**:
   \`\`\`bash
   ssh holycityofgod@your-vps
   cd /home/holycityofgod/htdocs
   npm install --production
   pm2 restart holy-city-of-god  # or your process name
   \`\`\`

## Important Files for Deployment

### Must Include:
- `.next/` - Built Next.js application
- `data/content.json` - **CRITICAL** - Contains all page content (home, about, pastor, etc.)
- `public/` - Static assets (images, fonts, etc.)
- `package.json` - Dependencies list
- `next.config.mjs` - Next.js configuration

### Environment Variables:
Make sure your VPS has a `.env` file with all required variables:
- Database connection (DATABASE_URL)
- JWT secrets (JWT_SECRET, JWT_REFRESH_SECRET)
- Site URL (NEXT_PUBLIC_SITE_URL)
- Email configuration
- Calendar API credentials

## Troubleshooting

### Content Not Showing Up
If content is missing on public pages:
1. Verify `data/content.json` exists on the VPS:
   \`\`\`bash
   ssh holycityofgod@your-vps
   ls -la /home/holycityofgod/htdocs/data/content.json
   \`\`\`

2. Check file permissions:
   \`\`\`bash
   chmod 644 /home/holycityofgod/htdocs/data/content.json
   \`\`\`

3. Check browser console for `[Anointed Innovations]` logs to see API errors

### Build Errors
If the build fails:
- Check that all environment variables are set in `.env.local`
- Ensure all TypeScript errors are resolved
- Verify database connection is working

## Post-Deployment Checklist

- [ ] Verify homepage loads and shows content
- [ ] Check that featured content section displays
- [ ] Test CTA section with action cards
- [ ] Verify About, Pastor, and other pages show content
- [ ] Test authentication (login/logout)
- [ ] Check admin panel access
- [ ] Verify blog posts display correctly
- [ ] Test contact form submission
- [ ] Check calendar functionality