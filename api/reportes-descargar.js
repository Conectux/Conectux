import { get } from '@vercel/blob'

export default async function handler(request) {
  const { searchParams } = new URL(request.url)
  const pathname = searchParams.get('pathname')

  if (!pathname) {
    return new Response(JSON.stringify({ error: 'Falta pathname' }), { status: 400 })
  }

  // Solo se sirven rutas que estén listadas en el manifest publicado.
  const manifestResult = await get('manifest.json', { access: 'private' })
  if (manifestResult?.statusCode !== 200) {
    return new Response('Not found', { status: 404 })
  }
  const manifest = await new Response(manifestResult.stream).json()
  const match = manifest.find((item) => item.pathname === pathname)
  if (!match) {
    return new Response('Not found', { status: 404 })
  }

  const result = await get(pathname, { access: 'private' })
  if (result?.statusCode !== 200) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(result.stream, {
    headers: {
      'Content-Type': 'application/pdf',
      'X-Content-Type-Options': 'nosniff',
      'Content-Disposition': `inline; filename="${match.slug}-${match.periodo.replace(/\s+/g, '-')}.pdf"`,
      'Cache-Control': 'private, no-cache',
    },
  })
}
