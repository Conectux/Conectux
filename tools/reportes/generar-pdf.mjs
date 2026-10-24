import { readFileSync, existsSync, mkdirSync } from 'node:fs'
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

// Frases cortas y directas (resumen, plan de acción) — con numeración circular.
const punchList = (items = []) => items.map(
  (i, idx) => `<li><span class="num">${idx + 1}</span>${esc(i)}</li>`
).join('\n')

// Tarjetas cortas con emoji propio (enfoque, entregables, qué funcionó, oportunidades)
const punchCards = (items = []) => items.map(
  (i) => `<div class="punch-card"><span class="emoji">${esc(i.emoji)}</span><span class="txt">${esc(i.texto)}</span></div>`
).join('\n')

// Números grandes para la portada
const heroStats = (items = []) => items.map(
  (s) => `<div class="hero-stat"><div class="icon-circle">${esc(s.emoji)}</div><div class="value">${esc(s.value)}</div><div class="label">${esc(s.label)}</div></div>`
).join('\n')

// Números grandes para secciones internas (redes, publicidad, comercial)
const bigStats = (items = []) => items.map(
  (s) => `<div class="big-stat"><div class="icon-circle">${esc(s.emoji)}</div><div class="value">${esc(s.value)}</div><div class="label">${esc(s.label)}</div></div>`
).join('\n')

// Filas de campaña tipo tarjeta, con barra de participación de gasto y el resultado como número grande
const campaignRows = (campanas = []) => {
  const maxGasto = Math.max(1, ...campanas.map((c) => c.gasto_numero || 0))
  return campanas.map((c) => {
    const pct = Math.max(4, Math.round(((c.gasto_numero || 0) / maxGasto) * 100))
    return `
  <div class="campaign-row">
    <div class="campaign-row-top">
      <div>
        <div class="name">${esc(c.nombre)}</div>
        <div class="obj">${esc(c.objetivo)}</div>
      </div>
      <div>
        <div class="result">${esc(c.resultado_valor)}</div>
        <div class="cost">${esc(c.resultado_label)} · ${esc(c.costo)}</div>
      </div>
    </div>
    <div class="campaign-bar-track"><div class="campaign-bar-fill" style="width:${pct}%"></div></div>
    <div class="campaign-bar-label">% del gasto en este cliente</div>
  </div>`
  }).join('\n')
}

const contentCards = (contenidos = []) => contenidos.map((c) => `
  <div class="content-card">
    <div class="img-wrap">
      <img src="${esc(c.imagen)}" />
      <span class="tag">${esc(c.tag)}</span>
    </div>
    <div class="body">
      <div class="titulo">${esc(c.titulo)}</div>
      <div class="result">${esc(c.resultado)}</div>
      <div class="why">${esc(c.porque)}</div>
    </div>
  </div>`).join('\n')

let html = readFileSync(resolve(__dirname, 'template.html'), 'utf-8')

const replacements = {
  LOGO_SRC: logoSrc,
  CLIENTE: esc(data.cliente),
  PERIODO: esc(data.periodo),
  HERO_STATS: heroStats(data.hero_stats),
  RESUMEN_PUNCH: punchList(data.resumen_punch),
  ENFOQUE_PUNCH: punchCards(data.enfoque_punch),
  ENTREGABLES_PUNCH: punchCards(data.entregables_punch),
  REDES_STATS: bigStats(data.redes_stats),
  ADS_STATS: bigStats(data.ads_stats),
  CAMPAIGNS_ROWS: campaignRows(data.campanas),
  CONTENT_CARDS: contentCards(data.contenidos),
  COMERCIAL_STATS: bigStats(data.comercial_stats),
  FUNCIONO_PUNCH: punchCards(data.funciono_punch),
  OPORTUNIDADES_PUNCH: punchCards(data.oportunidades_punch),
  PLAN_PUNCH: punchList(data.plan_punch),
}

for (const [token, value] of Object.entries(replacements)) {
  html = html.replaceAll(`{{${token}}}`, value)
}

const outDir = resolve(__dirname, 'salida')
mkdirSync(outDir, { recursive: true })
const slug = basename(resolvedDataPath, '.json')
const outPath = resolve(outDir, `${slug}.pdf`)

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
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
