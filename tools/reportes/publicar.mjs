import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { put, get } from '@vercel/blob'

const __dirname = dirname(fileURLToPath(import.meta.url))

const slugify = (s) => s
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')

const [, , pdfArg, clienteArg, periodoArg] = process.argv
if (!pdfArg || !clienteArg || !periodoArg) {
  console.error('Uso: node --env-file=tools/reportes/.env.local tools/reportes/publicar.mjs <ruta-al-pdf> "<Nombre del cliente>" "<Periodo, ej. Septiembre 2026>"')
  process.exit(1)
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Falta BLOB_READ_WRITE_TOKEN en el entorno. Corre con --env-file=tools/reportes/.env.local')
  process.exit(1)
}

const pdfPath = resolve(pdfArg)
if (!existsSync(pdfPath)) {
  console.error(`No se encontró el PDF: ${pdfPath}`)
  process.exit(1)
}

const slug = slugify(clienteArg)
const pdfBuffer = readFileSync(pdfPath)
const pdfBlobPath = `${slug}/${slugify(periodoArg)}.pdf`

console.log(`Subiendo ${basename(pdfPath)} a Blob (privado)...`)
const pdfBlob = await put(pdfBlobPath, pdfBuffer, {
  access: 'private',
  contentType: 'application/pdf',
  addRandomSuffix: false,
  allowOverwrite: true,
})

// ── Actualizar manifest.json ────────────────────────────────────────
const manifestPath = 'manifest.json'
let manifest = []
try {
  const result = await get(manifestPath, { access: 'private', useCache: false })
  if (result?.statusCode === 200) {
    manifest = await new Response(result.stream).json()
  }
} catch {
  // No existe aún: empezamos con manifest vacío
}

// Reemplaza solo si ya existía un reporte para este mismo cliente+período (re-generación).
// Reportes de otros períodos del mismo cliente se conservan como historial.
manifest = manifest.filter((item) => item.pathname !== pdfBlob.pathname)
manifest.push({
  cliente: clienteArg,
  slug,
  periodo: periodoArg,
  pathname: pdfBlob.pathname,
  publicado_en: new Date().toISOString(),
})

await put(manifestPath, JSON.stringify(manifest, null, 2), {
  access: 'private',
  contentType: 'application/json',
  addRandomSuffix: false,
  allowOverwrite: true,
})

// ── Marcar como resuelta cualquier solicitud pendiente de este cliente ──
try {
  const solicitudesResult = await get('solicitudes.json', { access: 'private', useCache: false })
  if (solicitudesResult?.statusCode === 200) {
    let solicitudes = await new Response(solicitudesResult.stream).json()
    const antes = solicitudes.length
    solicitudes = solicitudes.filter((s) => s.slug !== slug)
    if (solicitudes.length !== antes) {
      await put('solicitudes.json', JSON.stringify(solicitudes, null, 2), {
        access: 'private',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
      })
      console.log('Solicitud pendiente marcada como resuelta.')
    }
  }
} catch {
  // No hay solicitudes.json todavía, no pasa nada
}

console.log(`Reporte publicado para "${clienteArg}" (${periodoArg}).`)
console.log(`  pathname en Blob: ${pdfBlob.pathname}`)
console.log('Ya debería verse en /reportes una vez desplegado (vía /api/reportes-manifest).')
