import { get } from '@vercel/blob'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  try {
    const result = await get('solicitudes.json', { access: 'private' })
    if (result?.statusCode !== 200) {
      return res.status(200).send('[]')
    }
    res.setHeader('Cache-Control', 'private, no-cache')
    const chunks = []
    for await (const chunk of result.stream) chunks.push(chunk)
    res.status(200).send(Buffer.concat(chunks.map((c) => Buffer.from(c))))
  } catch (err) {
    console.error('reportes-solicitudes error:', err)
    res.status(200).send('[]')
  }
}
