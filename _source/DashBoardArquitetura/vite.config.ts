import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Desabilitar sourcemaps para produção
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2']
        }
      }
    }
  },
  publicDir: 'public', // Garantir que arquivos públicos sejam copiados
  // Configuração para Vercel
  base: '/',
  // Otimizações para produção
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
