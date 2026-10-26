import { get } from '@vercel/blob'
import { estaAutenticado } from '../lib/contratos-auth.js'

export default async function handler(req, res) {
  const { token, id } = req.query

  try {
    const manifestResult = await get('contratos-manifest.json', { access: 'private', useCache: false })
    if (manifestResult?.statusCode !== 200) {
      return res.status(404).send('Not found')
    }
    const chunks0 = []
    for await (const chunk of manifestResult.stream) chunks0.push(chunk)
    const manifest = JSON.parse(Buffer.concat(chunks0.map((c) => Buffer.from(c))).toString('utf-8'))

    let contrato = null
    if (token) {
      contrato = manifest.find((c) => c.token === token)
    } else if (id && estaAutenticado(req)) {
      contrato = manifest.find((c) => c.id === id)
    }

    if (!contrato) {
      return res.status(404).send('Not found')
    }

    const result = await get(contrato.pathname, { access: 'private', useCache: false })
    if (result?.statusCode !== 200) {
      return res.status(404).send('Not found')
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Content-Disposition', `inline; filename="contrato-${contrato.slug}.pdf"`)
    res.setHeader('Cache-Control', 'private, no-cache')
    const chunks = []
    for await (const chunk of result.stream) chunks.push(chunk)
    res.status(200).send(Buffer.concat(chunks.map((c) => Buffer.from(c))))
  } catch (err) {
    console.error('contratos-descargar error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
