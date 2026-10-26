import { createHash, timingSafeEqual } from 'node:crypto'

export const COOKIE_NAME = 'contratos_sesion'

export function valorCookieEsperado() {
  const password = process.env.CONTRATOS_PASSWORD || ''
  return createHash('sha256').update(`conectux-contratos:${password}`).digest('hex')
}

function parsearCookies(cookieHeader = '') {
  const map = {}
  for (const parte of cookieHeader.split(';')) {
    const [k, ...v] = parte.trim().split('=')
    if (k) map[k] = decodeURIComponent(v.join('='))
  }
  return map
}

export function estaAutenticado(req) {
  if (!process.env.CONTRATOS_PASSWORD) return false
  const cookies = parsearCookies(req.headers.cookie || '')
  const valor = cookies[COOKIE_NAME]
  if (!valor) return false
  const esperado = valorCookieEsperado()
  const a = Buffer.from(valor)
  const b = Buffer.from(esperado)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
