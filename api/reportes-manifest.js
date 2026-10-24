import { get } from '@vercel/blob'

export default async function handler() {
  try {
    const result = await get('manifest.json', { access: 'private' })
    if (result?.statusCode !== 200) {
      return new Response('[]', { headers: { 'Content-Type': 'application/json' } })
    }
    return new Response(result.stream, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, no-cache',
      },
    })
  } catch {
    return new Response('[]', { headers: { 'Content-Type': 'application/json' } })
  }
}
