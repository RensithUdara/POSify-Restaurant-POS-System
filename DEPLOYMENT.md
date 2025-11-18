# Deployment Guide for POSify Restaurant POS System

This guide will help you deploy the POSify Restaurant POS System to various platforms.

## Prerequisites

- Node.js 18+ installed
- Git repository set up
- Basic understanding of deployment platforms

## Build Process

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build the application**
   ```bash
   npm run build
   ```

3. **Test the production build locally**
   ```bash
   npm start
   ```

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:
1. Push your code to GitHub, GitLab, or Bitbucket
2. Visit [vercel.com](https://vercel.com) and sign up
3. Click "New Project" and import your repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (if the project is in the root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click "Deploy"

#### Environment Variables:
Add these in your Vercel dashboard under Settings > Environment Variables:
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 2. Netlify

#### Steps:
1. Push your code to a Git repository
2. Visit [netlify.com](https://netlify.com) and sign up
3. Click "New site from Git"
4. Connect your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
6. Add this to your `next.config.mjs`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   
   export default nextConfig
   ```

### 3. AWS Amplify

#### Steps:
1. Install AWS CLI and configure credentials
2. Install Amplify CLI: `npm install -g @aws-amplify/cli`
3. Initialize Amplify in your project:
   ```bash
   amplify init
   ```
4. Add hosting:
   ```bash
   amplify add hosting
   ```
5. Deploy:
   ```bash
   amplify publish
   ```

### 4. Docker Deployment

#### Dockerfile:
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### docker-compose.yml:
```yaml
version: '3.8'
services:
  posify:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### Deploy commands:
```bash
docker build -t posify-pos .
docker run -p 3000:3000 posify-pos
```

### 5. Traditional VPS/Server

#### Using PM2 (Process Manager):

1. **Install PM2 globally**
   ```bash
   npm install -g pm2
   ```

2. **Create ecosystem file** (`ecosystem.config.js`):
   ```javascript
   module.exports = {
     apps: [{
       name: 'posify-pos',
       script: 'npm',
       args: 'start',
       cwd: '/path/to/your/app',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   ```

3. **Deploy with PM2**:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

#### Using Nginx as Reverse Proxy:

1. **Install Nginx**
   ```bash
   sudo apt install nginx
   ```

2. **Configure Nginx** (`/etc/nginx/sites-available/posify`):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable the site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/posify /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## Environment Variables

Create a `.env.local` file for local development:

```env
# App Configuration
NEXT_PUBLIC_APP_NAME=POSify Restaurant POS
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (if using)
DATABASE_URL=your_database_url

# Payment Processing (if integrated)
STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret

# Email Service (if using)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Analytics (if using)
GOOGLE_ANALYTICS_ID=your_ga_id
```

## SSL Certificate (HTTPS)

### Using Let's Encrypt with Certbot:

1. **Install Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain certificate**:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal**:
   ```bash
   sudo crontab -e
   # Add this line:
   0 12 * * * /usr/bin/certbot renew --quiet
   ```

## Performance Optimization

### 1. Enable Compression
Add to your `next.config.mjs`:
```javascript
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}
```

### 2. Optimize Images
- Use WebP format when possible
- Implement lazy loading
- Use Next.js Image component

### 3. Bundle Analysis
```bash
npm install --save-dev @next/bundle-analyzer
```

Add to `next.config.mjs`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

Run analysis:
```bash
ANALYZE=true npm run build
```

## Monitoring and Maintenance

### 1. Health Checks
Create `/api/health` endpoint:
```javascript
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
}
```

### 2. Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage analytics

### 3. Backup Strategy
- Regular database backups
- Code repository backups
- Static asset backups

## Security Considerations

1. **Use HTTPS in production**
2. **Set security headers**:
   ```javascript
   // next.config.mjs
   const nextConfig = {
     async headers() {
       return [
         {
           source: '/(.*)',
           headers: [
             {
               key: 'X-Frame-Options',
               value: 'DENY'
             },
             {
               key: 'X-Content-Type-Options',
               value: 'nosniff'
             },
             {
               key: 'Referrer-Policy',
               value: 'origin-when-cross-origin'
             }
           ]
         }
       ]
     }
   }
   ```

3. **Validate all inputs**
4. **Use environment variables for sensitive data**
5. **Regular security updates**

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Clear node_modules and reinstall
   - Check for TypeScript errors

2. **Performance Issues**:
   - Optimize images and assets
   - Use CDN for static files
   - Enable caching

3. **Memory Issues**:
   - Increase server memory
   - Optimize bundle size
   - Use PM2 with cluster mode

### Support Resources:
- Next.js Documentation: [nextjs.org/docs](https://nextjs.org/docs)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Community Forums: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)

## Conclusion

Choose the deployment method that best fits your needs:
- **Vercel**: Best for quick deployment and scaling
- **Docker**: Best for containerized environments
- **VPS**: Best for full control and customization
- **Netlify**: Good alternative to Vercel

Remember to test your deployment thoroughly before going live and always have a backup strategy in place.