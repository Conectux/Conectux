export const config = {
  matcher: ['/api/contratos-admin'],
}

const COOKIE_NAME = 'contratos_sesion'

async function sha256hex(texto) {
  const datos = new TextEncoder().encode(texto)
  const hash = await crypto.subtle.digest('SHA-256', datos)
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function leerCookie(request, nombre) {
  const header = request.headers.get('cookie') || ''
  for (const parte of header.split(';')) {
    const [k, ...v] = parte.trim().split('=')
    if (k === nombre) return decodeURIComponent(v.join('='))
  }
  return null
}

export default async function middleware(request) {
  const password = process.env.CONTRATOS_PASSWORD
  if (!password) {
    return new Response('CONTRATOS_PASSWORD no configurada', { status: 500 })
  }

  const esperado = await sha256hex(`conectux-contratos:${password}`)
  const cookie = leerCookie(request, COOKIE_NAME)

  if (cookie === esperado) {
    return undefined // continúa normal
  }

  return new Response(JSON.stringify({ error: 'No autenticado' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}
