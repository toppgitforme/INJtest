import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from '@bangjelkoski/vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    minify: false,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'injective-sdk': ['@injectivelabs/sdk-ts'],
          'injective-networks': ['@injectivelabs/networks'],
          'injective-utils': ['@injectivelabs/utils', '@injectivelabs/exceptions', '@injectivelabs/ts-types'],
          'wallet-strategy': ['@injectivelabs/wallet-strategy'],
          'wallet-core': ['@injectivelabs/wallet-core', '@injectivelabs/wallet-base'],
          'wallet-cosmos': [
            '@injectivelabs/wallet-cosmos',
            '@injectivelabs/wallet-cosmos-strategy',
            '@injectivelabs/wallet-cosmostation',
          ],
          'wallet-evm': ['@injectivelabs/wallet-evm'],
          'wallet-hardware': [
            '@injectivelabs/wallet-ledger',
            '@injectivelabs/wallet-trezor',
          ],
          'wallet-other': [
            '@injectivelabs/wallet-magic',
            '@injectivelabs/wallet-private-key',
            '@injectivelabs/wallet-turnkey',
            '@injectivelabs/wallet-wallet-connect',
          ],
          'icons': ['lucide-react'],
        },
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      '@injectivelabs/sdk-ts',
      '@injectivelabs/networks',
      '@injectivelabs/utils',
      '@injectivelabs/wallet-strategy',
    ],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  server: {
    fs: {
      strict: false,
    },
    hmr: {
      overlay: true,
    },
  },
})
