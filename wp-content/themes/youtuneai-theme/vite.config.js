import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(async () => {
  const tailwindcss = await import('tailwindcss')
  const autoprefixer = await import('autoprefixer')
  
  return {
    root: '.',
    base: '',
    build: {
      outDir: 'assets',
      emptyOutDir: false,
      manifest: true,
      rollupOptions: {
        input: {
          app: resolve(__dirname, 'assets/js/app.js'),
          admin: resolve(__dirname, 'assets/js/admin.js')
        },
        output: {
          assetFileNames: 'css/[name].[hash][extname]',
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].[hash].js'
        }
      },
      cssCodeSplit: false,
      sourcemap: false,
      minify: 'esbuild'
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
          tailwindcss.default(),
          autoprefixer.default(),
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
  }
})