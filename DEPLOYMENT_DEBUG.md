# Deployment Troubleshooting Guide

## Step 1: Test Local Production Build

First, let's verify the app builds correctly locally:

```bash
# Clean install dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Step 2: Check Build Output

After running `pnpm build`, check:
- Does the build complete successfully?
- Are there any warnings or errors?
- Is the `dist/` folder created?

## Step 3: Common Deployment Issues

### Issue 1: Build Size Too Large
- Check `dist/` folder size
- May need to optimize bundle size

### Issue 2: Environment Variables
- Ensure all required env vars are set in deployment platform
- Check if any API keys or endpoints are missing

### Issue 3: Node Version Mismatch
- Deployment platform may use different Node version
- Add `.nvmrc` or specify in platform settings

### Issue 4: Build Command Issues
- Verify build command in deployment platform matches `pnpm build`
- Check if platform supports pnpm (may need to use npm)

### Issue 5: Output Directory
- Ensure deployment platform points to `dist/` folder
- Some platforms expect `build/` instead

## Step 4: Platform-Specific Fixes

### Vercel
- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `pnpm install`

### Netlify
- Build Command: `pnpm build`
- Publish Directory: `dist`
- Add `[[redirects]]` for SPA routing

### GitHub Pages
- May need `base` config in vite.config.ts
- Requires special workflow file

## Step 5: Get Detailed Error Info

Please provide:
1. Which deployment platform are you using? (Vercel/Netlify/Other)
2. Full error message from deployment logs
3. Does `pnpm build` work locally?
4. Any warnings during build?
