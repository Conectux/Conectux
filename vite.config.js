import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// En desarrollo, /pagina (sin "/" final) cae en la página principal.
// Redirige a /pagina/ cuando existe pagina/index.html, como hace Vercel en producción.
const trailingSlashRedirect = {
  name: 'trailing-slash-redirect',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const [path, query = ''] = (req.url || '').split('?')
      if (/^\/[\w-]+$/.test(path) && existsSync(resolve(__dirname, `.${path}/index.html`))) {
        res.statusCode = 301
        res.setHeader('Location', `${path}/${query ? `?${query}` : ''}`)
        return res.end()
      }
      next()
    })
  },
}

export default defineConfig({
  plugins: [vue(), trailingSlashRedirect],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sectores: resolve(__dirname, 'sectores/index.html'),
        presentacion: resolve(__dirname, 'presentacion/index.html'),
        presentacionSalud: resolve(__dirname, 'presentacion-salud/index.html'),
        briefSalud: resolve(__dirname, 'brief-salud/index.html'),
        propuestaManual: resolve(__dirname, 'propuesta-manual/index.html'),
        briefManuales: resolve(__dirname, 'brief-manuales/index.html'),
        reportes: resolve(__dirname, 'reportes/index.html'),
        contratos: resolve(__dirname, 'contratos/index.html'),
        firmarContrato: resolve(__dirname, 'firmar-contrato/index.html'),
        brief: resolve(__dirname, 'brief/index.html'),
        llenarBrief: resolve(__dirname, 'llenar-brief/index.html'),
        cotizaciones: resolve(__dirname, 'cotizaciones/index.html'),
        verCotizacion: resolve(__dirname, 'ver-cotizacion/index.html'),
        cotizador: resolve(__dirname, 'cotizador/index.html'),
      },
    },
  },
})