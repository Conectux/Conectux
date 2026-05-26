import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],
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
      },
    },
  },
})