import { COOKIE_NAME, valorCookieEsperado } from '../lib/contratos-auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}') } catch { body = {} }
  }
  const { password } = body || {}

  if (!process.env.CONTRATOS_PASSWORD) {
    return res.status(500).json({ error: 'CONTRATOS_PASSWORD no configurada en el servidor' })
  }

  if (password !== process.env.CONTRATOS_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' })
  }

  const valor = valorCookieEsperado()
  const maxAge = 60 * 60 * 24 * 30 // 30 días
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${valor}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`)
  res.status(200).json({ ok: true })
}
