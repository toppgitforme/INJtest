# Deployment Fix Guide

## Error: "Failed to create site"

This error typically means the deployment platform cannot initialize your project. Here's how to fix it:

## Option 1: Deploy to Vercel (Recommended)

### Prerequisites
1. Create account at https://vercel.com
2. Install Vercel CLI (if deploying from terminal)

### Steps
1. **Via Vercel Dashboard** (Easiest):
   - Go to https://vercel.com/new
   - Import your Git repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

2. **Via Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

### Configuration
Vercel should auto-detect from `vercel.json`:
- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `pnpm install`

## Option 2: Deploy to Netlify

### Prerequisites
1. Create account at https://netlify.com
2. Install Netlify CLI (if deploying from terminal)

### Steps
1. **Via Netlify Dashboard** (Easiest):
   - Go to https://app.netlify.com/start
   - Connect your Git repository
   - Netlify will use `netlify.toml` configuration
   - Click "Deploy site"

2. **Via Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

### Configuration
Netlify should auto-detect from `netlify.toml`:
- Build Command: `pnpm build`
- Publish Directory: `dist`

## Option 3: Manual Deployment

If automated deployment fails, you can deploy the built files manually:

### Step 1: Build Locally
```bash
pnpm install
pnpm build
```

### Step 2: Deploy `dist/` folder
- **Netlify**: Drag and drop `dist/` folder to https://app.netlify.com/drop
- **Vercel**: Use `vercel --prod` after building
- **GitHub Pages**: Push `dist/` to `gh-pages` branch

## Common Issues & Fixes

### Issue 1: Authentication
**Error**: "Failed to create site" or "Not authenticated"
**Fix**: 
- Log in to deployment platform first
- For CLI: Run `vercel login` or `netlify login`
- For Dashboard: Ensure you're logged in to your account

### Issue 2: Missing Build Output
**Error**: "No such file or directory: dist"
**Fix**:
```bash
# Ensure build completes successfully
pnpm build
# Check dist folder exists
ls -la dist/
```

### Issue 3: Git Repository Required
**Error**: "No Git repository found"
**Fix**:
- Most platforms require Git repository
- Initialize Git if needed:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  ```
- Push to GitHub/GitLab/Bitbucket
- Connect repository to deployment platform

### Issue 4: Build Command Fails
**Error**: Build fails during deployment
**Fix**:
- Test build locally first: `pnpm build`
- Check Node version matches (20.11.0)
- Verify all dependencies install correctly

### Issue 5: Environment Variables
**Error**: App loads but features don't work
**Fix**:
- Add environment variables in platform dashboard
- For Injective mainnet/testnet endpoints
- Check if any API keys are needed

## Recommended Approach

**For fastest deployment**:
1. Ensure `pnpm build` works locally
2. Push code to GitHub repository
3. Use Vercel Dashboard to import repository
4. Click "Deploy" - Vercel handles everything automatically

**Current Status**:
- ✅ Build configuration ready (`vercel.json`, `netlify.toml`)
- ✅ Production build tested and working
- ✅ Bundle optimized and under size limits
- ⏳ Need to connect to deployment platform

## Next Steps

Please specify:
1. Which deployment platform are you using? (Vercel/Netlify/Other)
2. Are you deploying via:
   - Dashboard (import Git repository)
   - CLI (command line)
   - Manual (drag and drop)
3. Do you have a Git repository set up?

Once you provide this info, I can give you exact steps to resolve the deployment error.
