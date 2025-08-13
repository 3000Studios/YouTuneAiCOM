import { defineConfig } from 'vite'
import { resolve } from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  root: '.',
  base: '',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'assets/js/app.js')
      },
      output: {
        assetFileNames: 'css/[name].[hash][extname]',
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js'
      }
    },
    cssCodeSplit: false,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    host: 'localhost',
    origin: 'http://localhost:5173'
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'assets'),
      '@js': resolve(__dirname, 'assets/js'),
      '@css': resolve(__dirname, 'assets/css'),
      '@img': resolve(__dirname, 'assets/img'),
      '@models': resolve(__dirname, 'assets/models')
    }
  },
  optimizeDeps: {
    include: ['three', 'gsap']
  }
})