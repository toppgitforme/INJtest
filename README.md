# Injective Grid Trading Bot

A professional grid trading bot for the Injective blockchain with real-time market data and automated order placement.

## Features

- Real-time market data streaming
- Automated grid trading strategy
- Wallet integration (Keplr, Leap, Metamask, Rabby)
- Order book visualization
- Trading statistics dashboard
- Grid level management

## Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Deployment

### Prerequisites
- Node.js 20.x or higher
- pnpm package manager

### Build Configuration
- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `pnpm install`
- Node Version: 20.11.0

### Environment Variables
No environment variables required for basic deployment.

### Deployment Platforms

#### Vercel
1. Import repository
2. Framework Preset: Vite
3. Build Command: `pnpm build`
4. Output Directory: `dist`
5. Install Command: `pnpm install`

#### Netlify
1. Import repository
2. Build Command: `pnpm build`
3. Publish Directory: `dist`
4. Node Version: 20.11.0

## Troubleshooting

If deployment fails:
1. Verify `pnpm build` works locally
2. Check Node.js version (20.x required)
3. Ensure all dependencies install correctly
4. Review build logs for specific errors
