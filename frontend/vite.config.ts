import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
        configure: (proxy) => {
          // En cada request, destruir el socket para forzar nueva conexión TCP.
          // Esto evita ECONNREFUSED por conexiones keepAlive rotas cuando
          // el backend se reinicia en Docker.
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('[proxy] →', req.method, req.url, '→', API_TARGET)
            // Deshabilitar keep-alive a nivel de header
            proxyReq.setHeader('Connection', 'close')
          })

          proxy.on('error', (err, _req, res) => {
            console.error('[proxy] error:', err.message)
            if (res && 'writeHead' in res && typeof res.writeHead === 'function') {
              try {
                res.writeHead(502, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Backend no disponible', detail: err.message }))
              } catch (_) { /* ignorar si ya se envió la respuesta */ }
            }
          })
        },
      },
    },
  },
})
