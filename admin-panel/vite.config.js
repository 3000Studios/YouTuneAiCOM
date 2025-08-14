import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/debug': 'http://localhost:5000',
      '/voice-command': 'http://localhost:5000'
    }
  },
});
