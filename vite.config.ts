import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from '@bangjelkoski/vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    minify: 'esbuild',
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
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
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
      supported: {
        'top-level-await': true,
      },
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
})
