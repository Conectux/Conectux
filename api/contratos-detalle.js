import { get } from '@vercel/blob'

export default async function handler(req, res) {
  const { token } = req.query
  if (!token) {
    return res.status(400).json({ error: 'Falta token' })
  }

  try {
    const result = await get('contratos-manifest.json', { access: 'private', useCache: false })
    if (result?.statusCode !== 200) {
      return res.status(404).json({ error: 'No encontrado' })
    }
    const chunks = []
    for await (const chunk of result.stream) chunks.push(chunk)
    const manifest = JSON.parse(Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8'))
    const contrato = manifest.find((c) => c.token === token)
    if (!contrato) {
      return res.status(404).json({ error: 'No encontrado' })
    }

    res.status(200).json({
      cliente: contrato.cliente,
      documentoCliente: contrato.documentoCliente,
      ciudad: contrato.ciudad,
      fechaInicioContrato: contrato.fechaInicioContrato,
      fechaInicioTrabajo: contrato.fechaInicioTrabajo,
      plan: contrato.plan,
      estado: contrato.estado,
      firmado_en: contrato.firmado_en,
    })
  } catch (err) {
    console.error('contratos-detalle error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
