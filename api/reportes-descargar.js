import { get } from '@vercel/blob'

export default async function handler(req, res) {
  const { pathname } = req.query

  if (!pathname) {
    return res.status(400).json({ error: 'Falta pathname' })
  }

  try {
    // Solo se sirven rutas que estén listadas en el manifest publicado.
    const manifestResult = await get('manifest.json', { access: 'private' })
    if (manifestResult?.statusCode !== 200) {
      return res.status(404).send('Not found')
    }
    const manifestChunks = []
    for await (const chunk of manifestResult.stream) manifestChunks.push(chunk)
    const manifest = JSON.parse(Buffer.concat(manifestChunks.map((c) => Buffer.from(c))).toString('utf-8'))
    const match = manifest.find((item) => item.pathname === pathname)
    if (!match) {
      return res.status(404).send('Not found')
    }

    const result = await get(pathname, { access: 'private' })
    if (result?.statusCode !== 200) {
      return res.status(404).send('Not found')
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Content-Disposition', `inline; filename="${match.slug}-${match.periodo.replace(/\s+/g, '-')}.pdf"`)
    res.setHeader('Cache-Control', 'private, no-cache')
    const chunks = []
    for await (const chunk of result.stream) chunks.push(chunk)
    res.status(200).send(Buffer.concat(chunks.map((c) => Buffer.from(c))))
  } catch (err) {
    console.error('reportes-descargar error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
