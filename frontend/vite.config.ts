import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// En el contexto del servidor de Vite (Node.js), process.env está disponible.
// VITE_API_BASE_URL se inyecta como variable de entorno normal en Docker,
// NO como VITE_* (esas son solo para el cliente).
const API_TARGET = process.env.API_TARGET
  || process.env.VITE_API_BASE_URL
  || 'http://localhost:8080'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: parseInt(process.env.PORT || '4200'),
    host: true,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        // Forzar re-resolución DNS en cada petición para evitar
        // ECONNREFUSED cuando el backend se reinicia en Docker
        ws: false,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            console.error('[proxy] error:', err.message)
            if ('writeHead' in res) {
              res.writeHead(502, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Backend no disponible', detail: err.message }))
            }
          })
          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log('[proxy] →', req.method, req.url, '→', API_TARGET)
          })
        },
      },
    },
  },
})
