import { get } from '@vercel/blob'

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Falta BLOB_READ_WRITE_TOKEN. Corre con --env-file=tools/reportes/.env.local')
  process.exit(1)
}

const result = await get('solicitudes.json', { access: 'private' })
if (result?.statusCode !== 200) {
  console.log('No hay solicitudes todavía.')
  process.exit(0)
}

const text = await new Response(result.stream).text()
const solicitudes = JSON.parse(text)
const pendientes = solicitudes.filter((s) => s.estado === 'pendiente')

if (!pendientes.length) {
  console.log('No hay solicitudes pendientes.')
  process.exit(0)
}

console.log(`${pendientes.length} solicitud(es) pendiente(s):\n`)
for (const s of pendientes) {
  console.log(`- ${s.cliente} (${s.slug}): ${s.desde} a ${s.hasta} — pedido el ${s.solicitado_en}`)
}
