import { get, put, del } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import { generarContratoSinFirmar, CLAUSULAS_DEFAULT } from '../lib/contrato-pdf.js'

// Uso interno (protegido por middleware vía cookie de /api/contratos-login):
// GET  accion=defaults      → texto estándar de las cláusulas editables
// GET  (sin accion)         → listar contratos
// POST accion=crear         → crear contrato nuevo
// POST accion=previsualizar → generar el PDF sin guardarlo (para revisar antes de enviar)
// POST accion=editar        → regenerar el PDF de un contrato aún no firmado (mismo link/token)
// POST accion=eliminar      → eliminar contrato existente

const slugify = (s) => s
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')

async function leerJson(pathname, porDefecto) {
  const result = await get(pathname, { access: 'private', useCache: false })
  if (result?.statusCode !== 200) return porDefecto
  const chunks = []
  for await (const chunk of result.stream) chunks.push(chunk)
  return JSON.parse(Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8'))
}

async function escribirJson(pathname, data) {
  await put(pathname, JSON.stringify(data, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

async function listar(req, res) {
  res.setHeader('Content-Type', 'application/json')
  const manifest = await leerJson('contratos-manifest.json', [])
  res.setHeader('Cache-Control', 'private, no-cache')
  res.status(200).json(manifest)
}

async function leerFirmaRepresentante() {
  const firmaResult = await get('contratos/firma-representante.png', { access: 'private' })
  if (firmaResult?.statusCode !== 200) return null
  const chunks = []
  for await (const chunk of firmaResult.stream) chunks.push(chunk)
  return Buffer.concat(chunks.map((c) => Buffer.from(c)))
}

function validarCampos(body) {
  const { cliente, documentoCliente, ciudad, fechaInicioContrato, fechaInicioTrabajo, plan, valor, nombreRepresentante } = body || {}
  if (!cliente || !documentoCliente || !ciudad || !fechaInicioContrato || !fechaInicioTrabajo || !plan || !valor || !nombreRepresentante) {
    return 'Faltan campos requeridos'
  }
  return null
}

async function defaults(req, res) {
  res.status(200).json({ clausulas: CLAUSULAS_DEFAULT })
}

async function previsualizar(req, res, body) {
  const errorValidacion = validarCampos(body)
  if (errorValidacion) return res.status(400).json({ error: errorValidacion })

  const firmaRepresentanteBytes = await leerFirmaRepresentante()
  const { pdfBytes } = await generarContratoSinFirmar(body, firmaRepresentanteBytes)

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'inline; filename="vista-previa-contrato.pdf"')
  res.status(200).send(Buffer.from(pdfBytes))
}

const camposEditables = (body) => {
  const { cliente, documentoCliente, ciudad, fechaInicioContrato, fechaInicioTrabajo, plan, valor } = body
  const clausulas = Array.isArray(body.clausulas)
    ? body.clausulas.map((c) => ({ titulo: c.titulo || '', texto: c.texto || '' }))
    : []
  return { cliente, documentoCliente, ciudad, fechaInicioContrato, fechaInicioTrabajo, plan, valor, clausulas }
}

async function crear(req, res, body) {
  const errorValidacion = validarCampos(body)
  if (errorValidacion) return res.status(400).json({ error: errorValidacion })
  const { cliente } = body

  const firmaRepresentanteBytes = await leerFirmaRepresentante()
  const { pdfBytes, firmaClienteRect } = await generarContratoSinFirmar(body, firmaRepresentanteBytes)

  const slug = slugify(cliente)
  const id = `${slug}-${Date.now()}`
  const token = uuidv4()
  const pathname = `contratos/${slug}/${id}.pdf`

  await put(pathname, Buffer.from(pdfBytes), {
    access: 'private',
    contentType: 'application/pdf',
    addRandomSuffix: false,
    allowOverwrite: true,
  })

  const manifest = await leerJson('contratos-manifest.json', [])
  manifest.push({
    id, slug, token, pathname,
    ...camposEditables(body),
    firmaClienteRect,
    estado: 'pendiente_firma',
    creado_en: new Date().toISOString(),
    firmado_en: null,
    firmante_nombre: null,
  })
  await escribirJson('contratos-manifest.json', manifest)

  const host = req.headers['x-forwarded-host'] || req.headers.host
  const protocolo = req.headers['x-forwarded-proto'] || 'https'
  const linkCliente = `${protocolo}://${host}/firmar-contrato/?token=${token}`

  res.status(200).json({ ok: true, id, linkCliente })
}

async function editar(req, res, body) {
  const { id } = body || {}
  if (!id) return res.status(400).json({ error: 'Falta id' })
  const errorValidacion = validarCampos(body)
  if (errorValidacion) return res.status(400).json({ error: errorValidacion })

  const manifest = await leerJson('contratos-manifest.json', null)
  if (!manifest) return res.status(404).json({ error: 'No hay contratos' })
  const idx = manifest.findIndex((c) => c.id === id)
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' })
  if (manifest[idx].estado === 'firmado') {
    return res.status(409).json({ error: 'No se puede editar un contrato ya firmado' })
  }

  const firmaRepresentanteBytes = await leerFirmaRepresentante()
  const { pdfBytes, firmaClienteRect } = await generarContratoSinFirmar(body, firmaRepresentanteBytes)

  await put(manifest[idx].pathname, Buffer.from(pdfBytes), {
    access: 'private',
    contentType: 'application/pdf',
    addRandomSuffix: false,
    allowOverwrite: true,
  })

  manifest[idx] = { ...manifest[idx], ...camposEditables(body), firmaClienteRect }
  await escribirJson('contratos-manifest.json', manifest)

  res.status(200).json({ ok: true })
}

async function eliminar(req, res, body) {
  const { id } = body || {}
  if (!id) return res.status(400).json({ error: 'Falta id' })

  const manifest = await leerJson('contratos-manifest.json', null)
  if (!manifest) return res.status(404).json({ error: 'No hay contratos' })

  const contrato = manifest.find((c) => c.id === id)
  if (!contrato) return res.status(404).json({ error: 'No encontrado' })

  await escribirJson('contratos-manifest.json', manifest.filter((c) => c.id !== id))
  await del(contrato.pathname, { access: 'private' })

  res.status(200).json({ ok: true })
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (req.query.accion === 'defaults') return await defaults(req, res)
      return await listar(req, res)
    }

    if (req.method === 'POST') {
      let body = req.body
      if (!body || typeof body === 'string') {
        try { body = JSON.parse(body || '{}') } catch { body = {} }
      }
      if (body.accion === 'eliminar') return await eliminar(req, res, body)
      if (body.accion === 'previsualizar') return await previsualizar(req, res, body)
      if (body.accion === 'editar') return await editar(req, res, body)
      return await crear(req, res, body)
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('contratos-admin error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
