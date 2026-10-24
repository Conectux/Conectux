import { get, put } from '@vercel/blob'

const TRIGGER_PATH = 'tools/reportes/.trigger'

// Hace un pequeño commit al repo para disparar el webhook de push, que
// a su vez dispara la rutina programada al instante (en vez de esperar
// hasta la próxima corrida por cron, hasta 1 hora). No contiene datos
// de clientes. Si falla, no es grave: la rutina igual corre cada hora.
const dispararGeneracionInstantanea = async (slug) => {
  const token = process.env.GITHUB_TOKEN
  if (!token) return
  const apiBase = 'https://api.github.com/repos/Conectux/Conectux/contents/' + TRIGGER_PATH
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  }

  const getRes = await fetch(apiBase, { headers })
  if (!getRes.ok) throw new Error(`No se pudo leer el archivo disparador (${getRes.status})`)
  const getData = await getRes.json()

  const content = Buffer.from(
    JSON.stringify({ ultimo_disparo: new Date().toISOString(), cliente_slug: slug }, null, 2) + '\n'
  ).toString('base64')

  const putRes = await fetch(apiBase, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `chore: disparar generación de reporte (${slug})`,
      content,
      sha: getData.sha,
      branch: 'main',
    }),
  })
  if (!putRes.ok) {
    const text = await putRes.text()
    throw new Error(`No se pudo actualizar el archivo disparador (${putRes.status}): ${text}`)
  }
}

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
    const existing = await get('solicitudes.json', { access: 'private', useCache: false })
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

    // Si falla, no es grave: la rutina programada cada hora lo recoge igual.
    try {
      await dispararGeneracionInstantanea(slug)
    } catch (err) {
      console.error('No se pudo disparar la generación instantánea:', err)
    }

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('reportes-solicitar error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
