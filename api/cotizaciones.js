import { get, put, del } from '@vercel/blob'
import { estaAutenticado } from '../lib/contratos-auth.js'
import { generarCotizacionPdf } from '../lib/cotizacion-pdf.js'

// Un solo archivo (el proyecto está en el límite de funciones serverless del
// plan Hobby de Vercel) que maneja todo /cotizaciones. Misma autenticación
// de equipo que /contratos y /brief (cookie compartida, verificada en código).
//
// GET  ?accion=pdf&slug=     → descargar la cotización en PDF (pública)
// GET  ?slug=                → detalle de una cotización (pública, para la vista web)
// GET  (sin slug)             → listar todas las cotizaciones (requiere sesión admin)
// POST accion=crear           → crear/sobrescribir una cotización (requiere sesión admin)
// POST accion=eliminar        → eliminar una cotización (requiere sesión admin)

const slugify = (s) => s
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')

async function leerManifest() {
  const result = await get('cotizaciones-manifest.json', { access: 'private', useCache: false })
  if (result?.statusCode !== 200) return []
  const chunks = []
  for await (const chunk of result.stream) chunks.push(chunk)
  return JSON.parse(Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8'))
}

async function escribirManifest(data) {
  await put('cotizaciones-manifest.json', JSON.stringify(data, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

async function listar(req, res) {
  if (!estaAutenticado(req)) return res.status(401).json({ error: 'No autenticado' })
  const manifest = await leerManifest()
  res.setHeader('Cache-Control', 'private, no-cache')
  res.status(200).json(manifest)
}

async function detalle(req, res, slug) {
  const manifest = await leerManifest()
  const cot = manifest.find((c) => c.slug === slug)
  if (!cot) return res.status(404).json({ error: 'No encontrada' })
  res.setHeader('Cache-Control', 'public, max-age=60')
  res.status(200).json(cot)
}

async function descargarPdf(req, res, slug) {
  const manifest = await leerManifest()
  const cot = manifest.find((c) => c.slug === slug)
  if (!cot) return res.status(404).send('Not found')

  const pdfBytes = await generarCotizacionPdf(cot)
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Content-Disposition', `inline; filename="cotizacion-${cot.slug}.pdf"`)
  res.setHeader('Cache-Control', 'public, max-age=60')
  res.status(200).send(Buffer.from(pdfBytes))
}

async function crear(req, res, body) {
  if (!estaAutenticado(req)) return res.status(401).json({ error: 'No autenticado' })
  const cliente = (body.cliente || '').trim()
  if (!cliente) return res.status(400).json({ error: 'Falta el nombre del cliente' })

  const slug = (body.slug && body.slug.trim()) ? slugify(body.slug) : slugify(cliente)
  const manifest = await leerManifest()
  const idx = manifest.findIndex((c) => c.slug === slug)

  const inicialesDe = (texto) => (texto || '')
    .split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()

  const descripcionCorta = body.descripcionCorta || ''
  const planesCrudos = Array.isArray(body.planes) ? body.planes : []
  // Descarta bloques de plan que el admin dejó completamente vacíos (el
  // formulario simple siempre arranca con uno por defecto).
  const planes = planesCrudos
    .filter((p) => (p.nombre || '').trim() || (p.items?.length) || (p.precioMostrado || '').trim())
    .map((p) => ({ ...p, nombre: p.nombre || cliente, avatar: p.avatar || inicialesDe(p.nombre || cliente) }))
  const primerPlan = planes[0] || {}

  // Campos "avanzados": si el admin no los llena (formulario simple), se
  // derivan solos a partir del cliente/planes para que la cotización igual
  // quede completa y bien presentada.
  const heroTitulo = body.heroTitulo || `Propuesta de marketing digital para ${cliente}`
  const heroSubtitulo = body.heroSubtitulo || descripcionCorta
  const precioLabel = body.precioLabel || primerPlan.precioLabel || (planes.length > 1 ? 'Desde' : 'Precio')
  const precioMostrado = body.precioMostrado || primerPlan.precioMostrado || ''
  const planesTitulo = body.planesTitulo || 'Plan de trabajo'
  let resumenFilas = Array.isArray(body.resumenFilas) ? body.resumenFilas : []
  if (!resumenFilas.length && planes.length > 1) {
    resumenFilas = planes.map((p) => ({ servicio: p.nombre, antes: p.precioAntes || '', precio: p.precioMostrado || '' }))
  }
  const cierreTitulo = body.cierreTitulo || (body.cierreTexto ? '' : 'Listos para empezar')
  const cierreTexto = body.cierreTexto || (body.cierreTitulo ? '' : 'Queremos ser tu aliado digital. Más clientes, más presencia, más resultados, mes a mes.')

  const cot = {
    slug,
    cliente,
    periodo: body.periodo || '',
    heroTitulo,
    heroSubtitulo,
    estadoLabel: body.estadoLabel || 'Activa',
    descripcionCorta,
    etiquetas: Array.isArray(body.etiquetas) ? body.etiquetas : [],
    precioLabel,
    precioMostrado,
    pilaresTitulo: body.pilaresTitulo || '',
    pilaresSubtitulo: body.pilaresSubtitulo || '',
    pilares: Array.isArray(body.pilares) ? body.pilares : [],
    planesTitulo,
    planesSubtitulo: body.planesSubtitulo || '',
    planesBadge: body.planesBadge || '',
    planes,
    resumenFilas,
    resumenTotal: body.resumenTotal || null,
    cierreTitulo,
    cierreTexto,
    exclusiones: Array.isArray(body.exclusiones) ? body.exclusiones : [],
    creado_en: idx === -1 ? new Date().toISOString() : manifest[idx].creado_en,
    actualizado_en: new Date().toISOString(),
  }

  if (idx === -1) manifest.push(cot)
  else manifest[idx] = cot

  await escribirManifest(manifest)
  res.status(200).json({ ok: true, slug })
}

async function eliminar(req, res, body) {
  if (!estaAutenticado(req)) return res.status(401).json({ error: 'No autenticado' })
  const { slug } = body
  if (!slug) return res.status(400).json({ error: 'Falta slug' })

  const manifest = await leerManifest()
  const existe = manifest.some((c) => c.slug === slug)
  if (!existe) return res.status(404).json({ error: 'No encontrada' })

  await escribirManifest(manifest.filter((c) => c.slug !== slug))
  res.status(200).json({ ok: true })
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (req.query.accion === 'pdf') return await descargarPdf(req, res, req.query.slug)
      if (req.query.slug) return await detalle(req, res, req.query.slug)
      return await listar(req, res)
    }

    if (req.method === 'POST') {
      let body = req.body
      if (!body || typeof body === 'string') {
        try { body = JSON.parse(body || '{}') } catch { body = {} }
      }
      if (body.accion === 'eliminar') return await eliminar(req, res, body)
      return await crear(req, res, body)
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('cotizaciones error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
