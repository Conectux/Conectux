import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { put } from '@vercel/blob'

const archivo = process.argv[2]
if (!archivo) {
  console.error('Uso: node --env-file=tools/reportes/.env.local tools/contratos/subir-firma.mjs <ruta-a-la-imagen-de-firma.png>')
  process.exit(1)
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Falta BLOB_READ_WRITE_TOKEN. Corre con --env-file=tools/reportes/.env.local')
  process.exit(1)
}

const bytes = readFileSync(resolve(archivo))
await put('contratos/firma-representante.png', bytes, {
  access: 'private',
  contentType: 'image/png',
  addRandomSuffix: false,
  allowOverwrite: true,
})

console.log('Firma del representante legal subida correctamente.')
