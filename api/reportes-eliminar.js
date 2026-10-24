import { del, get, put } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}') } catch { body = {} }
  }
  const { pathname } = body || {}

  if (!pathname) {
    return res.status(400).json({ error: 'Falta pathname' })
  }

  try {
    const manifestResult = await get('manifest.json', { access: 'private', useCache: false })
    if (manifestResult?.statusCode !== 200) {
      return res.status(404).json({ error: 'No hay reportes publicados' })
    }
    const chunks = []
    for await (const chunk of manifestResult.stream) chunks.push(chunk)
    let manifest = JSON.parse(Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8'))

    const existe = manifest.some((item) => item.pathname === pathname)
    if (!existe) {
      return res.status(404).json({ error: 'Ese reporte no existe' })
    }

    manifest = manifest.filter((item) => item.pathname !== pathname)
    await put('manifest.json', JSON.stringify(manifest, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    await del(pathname, { access: 'private' })

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('reportes-eliminar error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
