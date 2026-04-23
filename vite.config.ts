import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, './src'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules') && (
              id.includes('/recharts/')
              || id.includes('/recharts-scale/')
              || id.includes('/react-smooth/')
              || id.includes('/decimal.js-light/')
              || id.includes('/d3-')
              || id.includes('/internmap/')
              || id.includes('/robust-predicates/')
            )
          ) {
            return 'charts-vendor';
          }
          if (
            id.includes('node_modules') && (
              id.includes('/@radix-ui/')
              || id.includes('/class-variance-authority/')
              || id.includes('/tailwind-merge/')
              || id.includes('/clsx/')
            )
          ) {
            return 'ui-vendor';
          }
          if (
            id.includes('node_modules') && (
              id.includes('/react-router')
              || id.includes('/@remix-run/')
            )
          ) {
            return 'router-vendor';
          }
          return undefined;
        },
      },
    },
  },
});
