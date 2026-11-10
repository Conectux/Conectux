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

// Pastilla opcional de comparación vs el mes anterior ({ delta: "+18% vs oct" })
const deltaTag = (s) => s.delta ? `<div class="delta">${esc(s.delta)}</div>` : ''

// Números grandes para la portada
const heroStats = (items = []) => items.map(
  (s) => `<div class="hero-stat"><div class="icon-circle">${esc(s.emoji)}</div><div class="value">${esc(s.value)}</div><div class="label">${esc(s.label)}</div>${deltaTag(s)}</div>`
).join('\n')

// Números grandes para secciones internas (redes, publicidad, comercial, engagement, audiencia, balance, metas)
const bigStats = (items = []) => items.map(
  (s) => `<div class="big-stat"><div class="icon-circle">${esc(s.emoji)}</div><div class="value">${esc(s.value)}</div><div class="label">${esc(s.label)}</div>${deltaTag(s)}</div>`
).join('\n')

// Barras horizontales de proporción (desglose de audiencia, plataformas)
const barList = (items = []) => items.map((it) => {
  const pct = Math.max(2, Math.min(100, Number(it.pct) || 0))
  const etiqueta = it.pct_label || (it.pct !== undefined ? `${it.pct}%` : '')
  return `
  <div class="bar-item">
    <div class="bar-item-top"><span class="nombre">${esc(it.nombre)}</span><span class="pct">${esc(etiqueta)}</span></div>
    <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
  </div>`
}).join('\n')

// Filas de campaña tipo tarjeta, con barra de participación de gasto, el resultado como número
// grande, y una fila opcional de métricas secundarias (CPM, frecuencia) si vienen en los datos.
const campaignRows = (campanas = []) => {
  const maxGasto = Math.max(1, ...campanas.map((c) => c.gasto_numero || 0))
  return campanas.map((c) => {
    const pct = Math.max(4, Math.round(((c.gasto_numero || 0) / maxGasto) * 100))
    const extra = (c.cpm || c.frecuencia || c.alcance) ? `
    <div class="campaign-extra">
      ${c.cpm ? `<div class="item">CPM<b>${esc(c.cpm)}</b></div>` : ''}
      ${c.frecuencia ? `<div class="item">Frecuencia<b>${esc(c.frecuencia)}</b></div>` : ''}
      ${c.alcance ? `<div class="item">Alcance<b>${esc(c.alcance)}</b></div>` : ''}
    </div>` : ''
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
    ${extra}
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
      ${c.detalle ? `<div class="detalle">${esc(c.detalle)}</div>` : ''}
    </div>
  </div>`).join('\n')

// ── Secciones opcionales: solo aparecen si el dato correspondiente viene en el JSON.
// Así un reporte sin Instagram Insights conectado, por ejemplo, simplemente no muestra
// "Engagement orgánico" ni "Audiencia", sin dejar huecos ni inventar cifras.

const engagementSection = (stats = []) => !stats.length ? '' : `
    <p class="section-kicker" style="margin-top:28px;">Interacción</p>
    <div class="subsection-title">💬 Engagement orgánico</div>
    <div class="big-stat-grid">${bigStats(stats)}</div>`

const audienciaSection = (stats = [], desglose = []) => (!stats.length && !desglose.length) ? '' : `
    <p class="section-kicker" style="margin-top:28px;">Audiencia</p>
    <div class="subsection-title">👥 Quién te sigue y compra</div>
    ${stats.length ? `<div class="big-stat-grid">${bigStats(stats)}</div>` : ''}
    ${desglose.length ? `<div class="bar-list">${barList(desglose)}</div>` : ''}`

const platformsSection = (items = []) => !items.length ? '' : `
    <div class="section-divider"></div>
    <p class="section-kicker">Desglose</p>
    <div class="subsection-title">📊 Por plataforma</div>
    <div class="bar-list">${barList(items)}</div>`

const balanceStatsSection = (stats = []) => !stats.length ? '' : `
    <p class="subsection-title" style="margin-top:4px;">📊 Indicadores vs. mes anterior</p>
    <div class="big-stat-grid">${bigStats(stats)}</div>`

const metasSection = (stats = []) => !stats.length ? '' : `
    <p class="subsection-title">🎯 Metas para el próximo mes</p>
    <div class="big-stat-grid" style="margin-bottom:28px;">${bigStats(stats)}</div>`

let html = readFileSync(resolve(__dirname, 'template.html'), 'utf-8')

const replacements = {
  LOGO_SRC: logoSrc,
  CLIENTE: esc(data.cliente),
  PERIODO: esc(data.periodo),
  TOTAL_PAGINAS: '07',
  HERO_STATS: heroStats(data.hero_stats),
  RESUMEN_PUNCH: punchList(data.resumen_punch),
  ENFOQUE_PUNCH: punchCards(data.enfoque_punch),
  ENTREGABLES_PUNCH: punchCards(data.entregables_punch),
  REDES_STATS: bigStats(data.redes_stats),
  ENGAGEMENT_SECTION: engagementSection(data.engagement_stats),
  AUDIENCIA_SECTION: audienciaSection(data.audiencia_stats, data.audiencia_desglose),
  ADS_STATS: bigStats(data.ads_stats),
  CAMPAIGNS_ROWS: campaignRows(data.campanas),
  PLATAFORMAS_SECTION: platformsSection(data.plataformas),
  CONTENT_CARDS: contentCards(data.contenidos),
  COMERCIAL_STATS: bigStats(data.comercial_stats),
  BALANCE_STATS_SECTION: balanceStatsSection(data.balance_stats),
  FUNCIONO_PUNCH: punchCards(data.funciono_punch),
  OPORTUNIDADES_PUNCH: punchCards(data.oportunidades_punch),
  METAS_SECTION: metasSection(data.metas_stats),
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
