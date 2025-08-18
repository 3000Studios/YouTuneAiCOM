import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/debug': 'https://youtuneai.com',
      '/voice-command': 'https://youtuneai.com'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
