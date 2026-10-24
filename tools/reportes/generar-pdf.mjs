import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))

const dataPath = process.argv[2]
if (!dataPath) {
  console.error('Uso: node tools/reportes/generar-pdf.mjs tools/reportes/data/<cliente-mes>.json')
  process.exit(1)
}

const resolvedDataPath = resolve(dataPath)
if (!existsSync(resolvedDataPath)) {
  console.error(`No se encontró el archivo de datos: ${resolvedDataPath}`)
  process.exit(1)
}

const data = JSON.parse(readFileSync(resolvedDataPath, 'utf-8'))

const logoPath = resolve(__dirname, '../../src/assets/logo-conectux.png')
const logoBase64 = readFileSync(logoPath).toString('base64')
const logoSrc = `data:image/png;base64,${logoBase64}`

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

const bullets = (items = []) => items.map((i) => `<li>${esc(i)}</li>`).join('\n')

const statCards = (stats = []) => stats.map(
  (s) => `<div class="stat-card"><div class="value">${esc(s.value)}</div><div class="label">${esc(s.label)}</div></div>`
).join('\n')

const campaignRows = (campanas = []) => campanas.map((c) => `
  <tr>
    <td>${esc(c.nombre)}</td>
    <td>${esc(c.objetivo)}</td>
    <td>${esc(c.inversion)}</td>
    <td>${esc(c.resultado)}</td>
    <td>${esc(c.costo)}</td>
  </tr>`).join('\n')

const contentCards = (contenidos = []) => contenidos.map((c) => `
  <div class="content-card">
    <img src="${esc(c.imagen)}" />
    <div class="body">
      <span class="tag">${esc(c.tag)}</span>
      <div style="font-weight:700; font-size:12px; margin-bottom:4px;">${esc(c.titulo)}</div>
      <div class="result">${esc(c.resultado)}</div>
      <div class="why">${esc(c.porque)}</div>
    </div>
  </div>`).join('\n')

let html = readFileSync(resolve(__dirname, 'template.html'), 'utf-8')

const replacements = {
  LOGO_SRC: logoSrc,
  CLIENTE: esc(data.cliente),
  PERIODO: esc(data.periodo),
  RESUMEN_BULLETS: bullets(data.resumen),
  ENFOQUE_INTRO: esc(data.enfoque_intro || ''),
  ENFOQUE_BULLETS: bullets(data.enfoque),
  ENTREGABLES_BULLETS: bullets(data.entregables),
  REDES_STATS: statCards(data.redes_stats),
  REDES_NOTA: esc(data.redes_nota || ''),
  ADS_STATS: statCards(data.ads_stats),
  CAMPAIGNS_ROWS: campaignRows(data.campanas),
  CONTENT_CARDS: contentCards(data.contenidos),
  COMERCIAL_STATS: statCards(data.comercial_stats),
  COMERCIAL_NOTA: esc(data.comercial_nota || ''),
  FUNCIONO_BULLETS: bullets(data.funciono),
  OPORTUNIDADES_BULLETS: bullets(data.oportunidades),
  PLAN_BULLETS: bullets(data.plan),
}

for (const [token, value] of Object.entries(replacements)) {
  html = html.replaceAll(`{{${token}}}`, value)
}

const outDir = resolve(__dirname, 'salida')
const slug = basename(resolvedDataPath, '.json')
const outPath = resolve(outDir, `${slug}.pdf`)

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.setContent(html, { waitUntil: 'networkidle0' })
await page.pdf({
  path: outPath,
  format: 'A4',
  printBackground: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
})
await browser.close()

console.log(`Reporte generado: ${outPath}`)
