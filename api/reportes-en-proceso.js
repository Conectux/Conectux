import { get, put } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}') } catch { body = {} }
  }
  const { slug } = body || {}

  if (!slug) {
    return res.status(400).json({ error: 'Falta slug' })
  }

  try {
    const result = await get('solicitudes.json', { access: 'private', useCache: false })
    if (result?.statusCode !== 200) {
      return res.status(404).json({ error: 'No hay solicitudes' })
    }
    const chunks = []
    for await (const chunk of result.stream) chunks.push(chunk)
    const solicitudes = JSON.parse(Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8'))

    let encontrada = false
    for (const s of solicitudes) {
      if (s.slug === slug && s.estado === 'pendiente') {
        s.estado = 'en_proceso'
        encontrada = true
      }
    }

    if (!encontrada) {
      return res.status(404).json({ error: 'No hay una solicitud pendiente para ese cliente' })
    }

    await put('solicitudes.json', JSON.stringify(solicitudes, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('reportes-en-proceso error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
