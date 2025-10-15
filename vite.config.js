import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          math: ['mathjs'],
          plotly: ['plotly.js-dist-min', 'react-plotly.js'],
          katex: ['katex', 'react-katex']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['mathjs', 'plotly.js-dist-min', 'react-plotly.js', 'katex', 'react-katex']
  }
})
