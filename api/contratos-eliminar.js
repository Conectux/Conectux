import { get, put, del } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}') } catch { body = {} }
  }
  const { id } = body || {}

  if (!id) {
    return res.status(400).json({ error: 'Falta id' })
  }

  try {
    const result = await get('contratos-manifest.json', { access: 'private', useCache: false })
    if (result?.statusCode !== 200) {
      return res.status(404).json({ error: 'No hay contratos' })
    }
    const chunks = []
    for await (const chunk of result.stream) chunks.push(chunk)
    let manifest = JSON.parse(Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8'))

    const contrato = manifest.find((c) => c.id === id)
    if (!contrato) {
      return res.status(404).json({ error: 'No encontrado' })
    }

    manifest = manifest.filter((c) => c.id !== id)
    await put('contratos-manifest.json', JSON.stringify(manifest, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    await del(contrato.pathname, { access: 'private' })

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('contratos-eliminar error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
