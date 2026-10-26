import { get, put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import { generarContratoSinFirmar } from '../lib/contrato-pdf.js'

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}') } catch { body = {} }
  }
  const { cliente, documentoCliente, ciudad, fechaInicioContrato, fechaInicioTrabajo, plan, nombreRepresentante } = body || {}

  if (!cliente || !documentoCliente || !ciudad || !fechaInicioContrato || !fechaInicioTrabajo || !plan || !nombreRepresentante) {
    return res.status(400).json({ error: 'Faltan campos requeridos' })
  }

  try {
    let firmaRepresentanteBytes = null
    const firmaResult = await get('contratos/firma-representante.png', { access: 'private' })
    if (firmaResult?.statusCode === 200) {
      const chunks = []
      for await (const chunk of firmaResult.stream) chunks.push(chunk)
      firmaRepresentanteBytes = Buffer.concat(chunks.map((c) => Buffer.from(c)))
    }

    const { pdfBytes, firmaClienteRect } = await generarContratoSinFirmar(
      { cliente, documentoCliente, ciudad, fechaInicioContrato, fechaInicioTrabajo, plan, nombreRepresentante },
      firmaRepresentanteBytes
    )

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
      cliente, documentoCliente, ciudad,
      fechaInicioContrato, fechaInicioTrabajo, plan,
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
  } catch (err) {
    console.error('contratos-crear error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
