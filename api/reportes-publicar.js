import { get, put } from '@vercel/blob'

const slugify = (s) => s
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}') } catch { body = {} }
  }
  const { cliente, slug, periodo, pdfBase64 } = body || {}

  if (!cliente || !slug || !periodo || !pdfBase64) {
    return res.status(400).json({ error: 'Faltan campos (cliente, slug, periodo, pdfBase64)' })
  }

  try {
    const pdfBuffer = Buffer.from(pdfBase64, 'base64')
    const pdfPath = `${slug}/${slugify(periodo)}.pdf`

    const pdfBlob = await put(pdfPath, pdfBuffer, {
      access: 'private',
      contentType: 'application/pdf',
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    // ── Manifest ──
    let manifest = []
    const manifestResult = await get('manifest.json', { access: 'private', useCache: false })
    if (manifestResult?.statusCode === 200) {
      const chunks = []
      for await (const chunk of manifestResult.stream) chunks.push(chunk)
      manifest = JSON.parse(Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8'))
    }
    manifest = manifest.filter((item) => item.slug !== slug)
    manifest.push({
      cliente,
      slug,
      periodo,
      pathname: pdfBlob.pathname,
      publicado_en: new Date().toISOString(),
    })
    await put('manifest.json', JSON.stringify(manifest, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    // ── Marcar solicitud pendiente como resuelta ──
    const solicitudesResult = await get('solicitudes.json', { access: 'private', useCache: false })
    if (solicitudesResult?.statusCode === 200) {
      const chunks = []
      for await (const chunk of solicitudesResult.stream) chunks.push(chunk)
      let solicitudes = JSON.parse(Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8'))
      solicitudes = solicitudes.filter((s) => !(s.slug === slug && s.estado === 'pendiente'))
      await put('solicitudes.json', JSON.stringify(solicitudes, null, 2), {
        access: 'private',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
      })
    }

    res.status(200).json({ ok: true, pathname: pdfBlob.pathname })
  } catch (err) {
    console.error('reportes-publicar error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
