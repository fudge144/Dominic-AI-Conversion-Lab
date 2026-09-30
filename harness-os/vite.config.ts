import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@hermes/shared': path.resolve(__dirname, '/opt/hermes/apps/shared/src/index.ts'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 9120,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:9119',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            const token = process.env.HERMES_SESSION_TOKEN || '';
            if (token) {
              proxyReq.setHeader('X-Hermes-Session-Token', token);
            }
          });
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});