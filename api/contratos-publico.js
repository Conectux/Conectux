import { get, put } from '@vercel/blob'
import { insertarFirmaCliente } from '../lib/contrato-pdf.js'
import { COOKIE_NAME, estaAutenticado, valorCookieEsperado } from '../lib/contratos-auth.js'

// Acceso público por token (cliente firmando) + descarga interna por id:
// GET  ?accion=detalle&token=       → datos del contrato para la página de firma
// GET  ?accion=descargar&token=     → PDF (cliente, vía token)
// GET  ?accion=descargar&id=        → PDF (interno, requiere cookie de sesión)
// POST accion=firmar                → estampa la firma del cliente
// POST accion=login                 → inicia sesión admin (misma cookie usada por /contratos, /brief, /cotizaciones)

async function login(req, res, body) {
  const { password } = body || {}
  if (!process.env.CONTRATOS_PASSWORD) {
    return res.status(500).json({ error: 'CONTRATOS_PASSWORD no configurada en el servidor' })
  }
  if (password !== process.env.CONTRATOS_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' })
  }
  const valor = valorCookieEsperado()
  const maxAge = 60 * 60 * 24 * 30 // 30 días
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${valor}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`)
  res.status(200).json({ ok: true })
}

async function leerManifest() {
  const result = await get('contratos-manifest.json', { access: 'private', useCache: false })
  if (result?.statusCode !== 200) return null
  const chunks = []
  for await (const chunk of result.stream) chunks.push(chunk)
  return JSON.parse(Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8'))
}

async function detalle(req, res) {
  const { token } = req.query
  if (!token) return res.status(400).json({ error: 'Falta token' })

  const manifest = await leerManifest()
  const contrato = manifest?.find((c) => c.token === token)
  if (!contrato) return res.status(404).json({ error: 'No encontrado' })

  res.status(200).json({
    cliente: contrato.cliente,
    documentoCliente: contrato.documentoCliente,
    ciudad: contrato.ciudad,
    fechaInicioContrato: contrato.fechaInicioContrato,
    fechaInicioTrabajo: contrato.fechaInicioTrabajo,
    plan: contrato.plan,
    estado: contrato.estado,
    firmado_en: contrato.firmado_en,
  })
}

async function descargar(req, res) {
  const { token, id } = req.query
  const manifest = await leerManifest()
  if (!manifest) return res.status(404).send('Not found')

  let contrato = null
  if (token) {
    contrato = manifest.find((c) => c.token === token)
  } else if (id && estaAutenticado(req)) {
    contrato = manifest.find((c) => c.id === id)
  }
  if (!contrato) return res.status(404).send('Not found')

  const result = await get(contrato.pathname, { access: 'private', useCache: false })
  if (result?.statusCode !== 200) return res.status(404).send('Not found')

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Content-Disposition', `inline; filename="contrato-${contrato.slug}.pdf"`)
  res.setHeader('Cache-Control', 'private, no-cache')
  const chunks = []
  for await (const chunk of result.stream) chunks.push(chunk)
  res.status(200).send(Buffer.concat(chunks.map((c) => Buffer.from(c))))
}

async function firmar(req, res, body) {
  const { token, nombreFirmante, firmaBase64, firmaTipo } = body || {}
  if (!token || !nombreFirmante || !firmaBase64) {
    return res.status(400).json({ error: 'Faltan campos (token, nombreFirmante, firmaBase64)' })
  }

  const manifest = await leerManifest()
  if (!manifest) return res.status(404).json({ error: 'No encontrado' })
  const idx = manifest.findIndex((c) => c.token === token)
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' })
  const contrato = manifest[idx]
  if (contrato.estado === 'firmado') {
    return res.status(409).json({ error: 'Este contrato ya fue firmado' })
  }

  const pdfResult = await get(contrato.pathname, { access: 'private', useCache: false })
  if (pdfResult?.statusCode !== 200) {
    return res.status(404).json({ error: 'No se encontró el PDF del contrato' })
  }
  const chunks = []
  for await (const chunk of pdfResult.stream) chunks.push(chunk)
  const pdfBytesOriginal = Buffer.concat(chunks.map((c) => Buffer.from(c)))

  const firmaImagenBytes = Buffer.from(firmaBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || ''
  const fechaHoraISO = new Date().toISOString()

  const pdfFirmado = await insertarFirmaCliente(pdfBytesOriginal, contrato.firmaClienteRect, {
    nombreFirmante,
    firmaImagenBytes,
    firmaImagenTipo: firmaTipo === 'jpg' ? 'jpg' : 'png',
    fechaHoraISO,
    ip,
  })

  await put(contrato.pathname, Buffer.from(pdfFirmado), {
    access: 'private',
    contentType: 'application/pdf',
    addRandomSuffix: false,
    allowOverwrite: true,
  })

  manifest[idx] = {
    ...contrato,
    estado: 'firmado',
    firmado_en: fechaHoraISO,
    firmante_nombre: nombreFirmante,
    firmante_ip: ip,
  }
  await put('contratos-manifest.json', JSON.stringify(manifest, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })

  res.status(200).json({ ok: true })
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (req.query.accion === 'descargar') return await descargar(req, res)
      return await detalle(req, res)
    }

    if (req.method === 'POST') {
      let body = req.body
      if (!body || typeof body === 'string') {
        try { body = JSON.parse(body || '{}') } catch { body = {} }
      }
      if (body.accion === 'login') return await login(req, res, body)
      return await firmar(req, res, body)
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('contratos-publico error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
