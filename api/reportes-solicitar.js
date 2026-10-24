import { get, put } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}') } catch { body = {} }
  }
  const { cliente, slug, desde, hasta } = body || {}

  if (!cliente || !slug || !desde || !hasta) {
    return res.status(400).json({ error: 'Faltan campos (cliente, slug, desde, hasta)' })
  }

  try {
    let solicitudes = []
    const existing = await get('solicitudes.json', { access: 'private' })
    if (existing?.statusCode === 200) {
      const chunks = []
      for await (const chunk of existing.stream) chunks.push(chunk)
      solicitudes = JSON.parse(Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8'))
    }

    // Reemplaza cualquier solicitud pendiente previa del mismo cliente.
    solicitudes = solicitudes.filter((s) => !(s.slug === slug && s.estado === 'pendiente'))
    solicitudes.push({
      id: `${slug}-${Date.now()}`,
      cliente,
      slug,
      desde,
      hasta,
      solicitado_en: new Date().toISOString(),
      estado: 'pendiente',
    })

    await put('solicitudes.json', JSON.stringify(solicitudes, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('reportes-solicitar error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
