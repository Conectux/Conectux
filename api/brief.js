import { get, put, del } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import { estaAutenticado } from '../lib/contratos-auth.js'
import { generarBriefPdf } from '../lib/brief-pdf.js'

// Un solo archivo (el proyecto está cerca del límite de funciones serverless
// del plan Hobby de Vercel) que maneja todo /brief. La autenticación interna
// se valida adentro con la misma cookie/contraseña de /contratos, en vez de
// usar middleware de Vercel por ruta.
//
// GET  ?accion=pdf&id=   → descargar el brief en PDF (requiere sesión admin)
// GET  ?token=           → detalle de un brief (público, para precargar el formulario)
// GET  (sin token)       → listar todos los briefs (requiere sesión admin)
// POST accion=crear      → crear un brief nuevo (requiere sesión admin)
// POST accion=eliminar   → eliminar un brief (requiere sesión admin)
// POST { token, respuestas } → guardar respuestas (público vía token, se puede repetir)

const slugify = (s) => s
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')

async function leerManifest() {
  const result = await get('brief-manifest.json', { access: 'private', useCache: false })
  if (result?.statusCode !== 200) return []
  const chunks = []
  for await (const chunk of result.stream) chunks.push(chunk)
  return JSON.parse(Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8'))
}

async function escribirManifest(data) {
  await put('brief-manifest.json', JSON.stringify(data, null, 2), {
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

async function detalle(req, res, token) {
  const manifest = await leerManifest()
  const brief = manifest.find((b) => b.token === token)
  if (!brief) return res.status(404).json({ error: 'No encontrado' })
  res.status(200).json({ cliente: brief.cliente, respuestas: brief.respuestas || {} })
}

async function descargarPdf(req, res, id) {
  if (!estaAutenticado(req)) return res.status(401).json({ error: 'No autenticado' })
  if (!id) return res.status(400).json({ error: 'Falta id' })

  const manifest = await leerManifest()
  const brief = manifest.find((b) => b.id === id)
  if (!brief) return res.status(404).send('Not found')

  const pdfBytes = await generarBriefPdf(brief.cliente, brief.respuestas || {})
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Content-Disposition', `inline; filename="brief-${brief.id}.pdf"`)
  res.setHeader('Cache-Control', 'private, no-cache')
  res.status(200).send(Buffer.from(pdfBytes))
}

async function crear(req, res, body) {
  if (!estaAutenticado(req)) return res.status(401).json({ error: 'No autenticado' })
  const cliente = (body.cliente || '').trim()
  if (!cliente) return res.status(400).json({ error: 'Falta el nombre del cliente' })

  const manifest = await leerManifest()
  const id = `${slugify(cliente)}-${Date.now()}`
  const token = uuidv4()
  manifest.push({
    id, cliente, token,
    estado: 'por_llenar',
    creado_en: new Date().toISOString(),
    actualizado_en: null,
    respuestas: {},
  })
  await escribirManifest(manifest)

  const host = req.headers['x-forwarded-host'] || req.headers.host
  const protocolo = req.headers['x-forwarded-proto'] || 'https'
  const linkCliente = `${protocolo}://${host}/llenar-brief/?token=${token}`

  res.status(200).json({ ok: true, id, linkCliente })
}

async function eliminar(req, res, body) {
  if (!estaAutenticado(req)) return res.status(401).json({ error: 'No autenticado' })
  const { id } = body
  if (!id) return res.status(400).json({ error: 'Falta id' })

  const manifest = await leerManifest()
  const existe = manifest.some((b) => b.id === id)
  if (!existe) return res.status(404).json({ error: 'No encontrado' })

  await escribirManifest(manifest.filter((b) => b.id !== id))
  res.status(200).json({ ok: true })
}

async function guardar(req, res, body) {
  const { token, respuestas } = body
  if (!token) return res.status(400).json({ error: 'Falta token' })

  const manifest = await leerManifest()
  const idx = manifest.findIndex((b) => b.token === token)
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' })

  manifest[idx] = {
    ...manifest[idx],
    respuestas: respuestas || {},
    estado: 'lleno',
    actualizado_en: new Date().toISOString(),
  }
  await escribirManifest(manifest)
  res.status(200).json({ ok: true })
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (req.query.accion === 'pdf') return await descargarPdf(req, res, req.query.id)
      if (req.query.token) return await detalle(req, res, req.query.token)
      return await listar(req, res)
    }

    if (req.method === 'POST') {
      let body = req.body
      if (!body || typeof body === 'string') {
        try { body = JSON.parse(body || '{}') } catch { body = {} }
      }
      if (body.accion === 'crear') return await crear(req, res, body)
      if (body.accion === 'eliminar') return await eliminar(req, res, body)
      return await guardar(req, res, body)
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('brief error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
