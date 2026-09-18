import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function spaFallbackPlugin(): Plugin {
  return {
    name: 'spa-fallback-plugin',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.resolve(distDir, 'index.html');
      const fallbackPath = path.resolve(distDir, '404.html');
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, fallbackPath);
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const token = (env.VITE_COUNTERAPI_TOKEN || env.COUNTERAPI_TOKEN || '').trim();

  return {
    plugins: [react(), spaFallbackPlugin()],
    base: '/',
    server: {
      port: 5173,
      open: false,
      proxy: {
        '/api/counter': {
          target: 'https://api.counterapi.dev/v2/aleric-dev/media-studio-generator-counter',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/counter/, ''),
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      },
    },
  };
});


