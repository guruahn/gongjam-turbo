# CloudFlare Pages Deployment Guide

## Prerequisites

1. CloudFlare account with Pages enabled
2. Wrangler CLI installed: `npm install -g wrangler`
3. Authenticated with CloudFlare: `wrangler login`

## Deployment Steps

### Option 1: Manual Deployment via Wrangler

```bash
# From the monorepo root
cd apps/hello-world

# Build the project
pnpm build

# Deploy to CloudFlare Pages
wrangler pages deploy dist --project-name=gongjam-hello-world
```

### Option 2: GitHub Integration (Recommended)

1. Connect your GitHub repository to CloudFlare Pages
2. Go to CloudFlare Dashboard > Pages > Create a project
3. Select your GitHub repository
4. Configure build settings:
   - **Build command**: `cd apps/hello-world && pnpm install && pnpm build`
   - **Build output directory**: `apps/hello-world/dist`
   - **Root directory**: `/` (monorepo root)

## Custom Domain Configuration

After deployment, configure the custom domain:

1. Go to CloudFlare Dashboard
2. Navigate to: Pages > gongjam-hello-world > Custom domains
3. Click "Set up a custom domain"
4. Enter: `jeongwoo.in`
5. Add path routing: `/hello` → hello-world app

## Environment Variables

If you need environment variables:

1. Go to CloudFlare Dashboard > Pages > gongjam-hello-world > Settings > Environment variables
2. Add variables for Production and Preview environments

## Automatic Deployments

- **Production**: Deploys from `main` branch
- **Preview**: Deploys from all other branches (for testing)

## Build Configuration

The project uses:
- **Framework**: Vue 3 + Vite
- **Build tool**: Turborepo
- **Package manager**: pnpm

## Troubleshooting

### Build Fails

If the build fails in CloudFlare Pages:

1. Check that pnpm is installed: Add to build command
   ```bash
   npm install -g pnpm && cd apps/hello-world && pnpm install && pnpm build
   ```

2. Ensure all workspace dependencies are resolved

### Custom Domain Not Working

1. Verify DNS settings in CloudFlare
2. Check path routing configuration
3. Wait for DNS propagation (up to 24 hours)

## Useful Commands

```bash
# Local preview of production build
pnpm preview

# Check deployment status
wrangler pages deployment list --project-name=gongjam-hello-world

# View deployment logs
wrangler pages deployment tail --project-name=gongjam-hello-world
```
