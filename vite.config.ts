import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from '@bangjelkoski/vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    minify: false,
    target: 'esnext',
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
