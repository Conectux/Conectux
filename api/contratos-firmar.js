import { get, put } from '@vercel/blob'
import { insertarFirmaCliente } from '../lib/contrato-pdf.js'

async function leerJson(pathname) {
  const result = await get(pathname, { access: 'private', useCache: false })
  if (result?.statusCode !== 200) return null
  const chunks = []
  for await (const chunk of result.stream) chunks.push(chunk)
  return JSON.parse(Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8'))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}') } catch { body = {} }
  }
  const { token, nombreFirmante, firmaBase64, firmaTipo } = body || {}

  if (!token || !nombreFirmante || !firmaBase64) {
    return res.status(400).json({ error: 'Faltan campos (token, nombreFirmante, firmaBase64)' })
  }

  try {
    const manifest = await leerJson('contratos-manifest.json')
    if (!manifest) {
      return res.status(404).json({ error: 'No encontrado' })
    }
    const idx = manifest.findIndex((c) => c.token === token)
    if (idx === -1) {
      return res.status(404).json({ error: 'No encontrado' })
    }
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
  } catch (err) {
    console.error('contratos-firmar error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
