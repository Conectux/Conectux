import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const PURPLE = rgb(161 / 255, 0, 1)
const DARK = rgb(0.11, 0.07, 0.19)
const GRAY = rgb(0.45, 0.45, 0.5)
const LINE = rgb(0.85, 0.85, 0.88)
const PAGE_W = 595.28 // A4 en puntos
const PAGE_H = 841.89
const MARGIN = 56
const CONTENT_W = PAGE_W - MARGIN * 2

// La fuente estándar (WinAnsi) no soporta emojis ni símbolos como ★ — se
// quitan para no reventar la generación del PDF. Se conservan tildes/ñ
// (codepoints ≤ 0xFF) y algunos signos tipográficos que WinAnsi sí soporta
// aunque su codepoint Unicode esté por encima de 0xFF (viñeta, rayas, comillas).
const EXTRA_SEGUROS = new Set([0x2022, 0x2013, 0x2014, 0x2018, 0x2019, 0x201c, 0x201d, 0x2026])
const limpiar = (texto) => Array.from(texto || '')
  .filter((ch) => {
    const cp = ch.codePointAt(0)
    return cp <= 0xff || EXTRA_SEGUROS.has(cp)
  })
  .join('')
  .replace(/\s+/g, ' ')
  .trim()

function envolverTexto(textoCrudo, font, size, maxWidth) {
  const texto = limpiar(textoCrudo)
  const palabras = (texto || '').split(/\s+/)
  const lineas = []
  let actual = ''
  for (const palabra of palabras) {
    const prueba = actual ? `${actual} ${palabra}` : palabra
    if (font.widthOfTextAtSize(prueba, size) > maxWidth && actual) {
      lineas.push(actual)
      actual = palabra
    } else {
      actual = prueba
    }
  }
  if (actual) lineas.push(actual)
  return lineas
}

/** Genera un PDF legible y ordenado de una cotización (no es una réplica pixel-a-pixel de la web). */
export async function generarCotizacionPdf(cot) {
  const pdf = await PDFDocument.create()
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)

  let page = pdf.addPage([PAGE_W, PAGE_H])
  let y = PAGE_H - MARGIN

  const nuevaPagina = () => {
    page = pdf.addPage([PAGE_W, PAGE_H])
    y = PAGE_H - MARGIN
  }
  const asegurarEspacio = (alto) => { if (y - alto < MARGIN) nuevaPagina() }

  const escribirParrafo = (texto, { size = 10, font = fontRegular, color = DARK, gap = 13, spaceAfter = 8, x = MARGIN, maxWidth = CONTENT_W } = {}) => {
    const lineas = envolverTexto(texto, font, size, maxWidth)
    for (const linea of lineas) {
      asegurarEspacio(gap)
      page.drawText(linea, { x, y, size, font, color })
      y -= gap
    }
    y -= spaceAfter
  }

  const escribirTitulo = (textoCrudo, { size = 13, spaceBefore = 10, spaceAfter = 10 } = {}) => {
    const texto = limpiar(textoCrudo)
    asegurarEspacio(size + spaceBefore + spaceAfter + 4)
    y -= spaceBefore
    page.drawLine({ start: { x: MARGIN, y: y + size + 2 }, end: { x: PAGE_W - MARGIN, y: y + size + 2 }, thickness: 0.7, color: LINE })
    y -= 6
    page.drawText(texto, { x: MARGIN, y, size, font: fontBold, color: PURPLE })
    y -= size + spaceAfter
  }

  const filaPrecio = (etiquetaCrudo, antesCrudo, precioCrudo, periodoCrudo) => {
    const etiqueta = limpiar(etiquetaCrudo)
    const antes = limpiar(antesCrudo)
    const precioTexto = limpiar(`${precioCrudo || ''}${periodoCrudo ? ' ' + periodoCrudo : ''}`)

    const anchoEtiqueta = fontRegular.widthOfTextAtSize(etiqueta, 10.5)
    const anchoAntes = antes ? fontRegular.widthOfTextAtSize(antes, 9) + 10 : 0
    const anchoPrecio = fontBold.widthOfTextAtSize(precioTexto, 11)
    const espacioDisponible = CONTENT_W - anchoEtiqueta - 14

    asegurarEspacio(16)
    if (anchoAntes + anchoPrecio <= espacioDisponible) {
      // Cabe todo en una sola línea: etiqueta a la izquierda, precio a la derecha.
      page.drawText(etiqueta, { x: MARGIN, y, size: 10.5, font: fontRegular, color: DARK })
      let xDer = PAGE_W - MARGIN - anchoPrecio
      page.drawText(precioTexto, { x: xDer, y, size: 11, font: fontBold, color: PURPLE })
      if (antes) {
        xDer -= anchoAntes
        page.drawText(antes, { x: xDer, y, size: 9, font: fontRegular, color: GRAY })
      }
      y -= 17
    } else {
      // El precio es muy largo (ej. nota de comisión) — se apila debajo de la etiqueta.
      page.drawText(etiqueta, { x: MARGIN, y, size: 10.5, font: fontBold, color: DARK })
      y -= 15
      if (antes) {
        page.drawText(antes, { x: MARGIN, y, size: 9, font: fontRegular, color: GRAY })
        y -= 12
      }
      escribirParrafo(precioTexto, { size: 10.5, font: fontBold, color: PURPLE, gap: 13, spaceAfter: 4 })
    }
  }

  // ── Encabezado ──
  page.drawText('COTIZACION', { x: MARGIN, y, size: 11, font: fontBold, color: GRAY })
  y -= 16
  page.drawText(limpiar(cot.cliente), { x: MARGIN, y, size: 20, font: fontBold, color: DARK })
  y -= 20
  if (cot.periodo) {
    page.drawText(limpiar(cot.periodo), { x: MARGIN, y, size: 9.5, font: fontRegular, color: GRAY })
    y -= 22
  } else {
    y -= 6
  }
  escribirParrafo(cot.heroTitulo, { size: 13, font: fontBold, color: DARK, gap: 16, spaceAfter: 2 })
  if (cot.heroSubtitulo) escribirParrafo(cot.heroSubtitulo, { size: 10, color: GRAY, spaceAfter: 14 })

  // ── Pilares / enfoque ──
  if (cot.pilares?.length) {
    escribirTitulo(cot.pilaresTitulo || 'Enfoque')
    if (cot.pilaresSubtitulo) escribirParrafo(cot.pilaresSubtitulo, { size: 9.5, color: GRAY, spaceAfter: 10 })
    for (const p of cot.pilares) {
      escribirParrafo(`${p.numero} · ${p.titulo}`, { size: 10.5, font: fontBold, color: DARK, gap: 13, spaceAfter: 2 })
      escribirParrafo(p.descripcion, { size: 9.5, color: GRAY, spaceAfter: 8 })
    }
  }

  // ── Planes ──
  if (cot.planes?.length) {
    escribirTitulo(cot.planesTitulo || 'Plan')
    if (cot.planesSubtitulo) escribirParrafo(cot.planesSubtitulo, { size: 9.5, color: GRAY, spaceAfter: 6 })
    if (cot.planesBadge) escribirParrafo(cot.planesBadge, { size: 9, font: fontBold, color: PURPLE, spaceAfter: 10 })

    for (const plan of cot.planes) {
      asegurarEspacio(24)
      page.drawText(limpiar(`${plan.nombre}${plan.tipo ? ' - ' + plan.tipo : ''}`), { x: MARGIN, y, size: 11, font: fontBold, color: DARK })
      y -= 16
      for (const item of plan.items || []) {
        escribirParrafo(`• ${item}`, { size: 9.5, color: DARK, gap: 12.5, spaceAfter: 0, x: MARGIN + 10, maxWidth: CONTENT_W - 10 })
      }
      y -= 4
      filaPrecio(plan.precioLabel || 'Precio', plan.precioAntes, plan.precioMostrado, plan.periodo)
      y -= 10
    }
  }

  // ── Resumen económico ──
  if (cot.resumenFilas?.length) {
    escribirTitulo('Resumen económico')
    for (const fila of cot.resumenFilas) {
      filaPrecio(fila.servicio, fila.antes, fila.precio, '')
    }
    if (cot.resumenTotal) {
      y -= 4
      asegurarEspacio(20)
      page.drawLine({ start: { x: MARGIN, y: y + 10 }, end: { x: PAGE_W - MARGIN, y: y + 10 }, thickness: 0.7, color: LINE })
      filaPrecio('Total', cot.resumenTotal.antes, cot.resumenTotal.monto, cot.resumenTotal.periodo)
    }
    y -= 8
  }

  // ── Cierre ──
  if (cot.cierreTitulo || cot.cierreTexto) {
    escribirTitulo(cot.cierreTitulo || 'Listos para empezar')
    if (cot.cierreTexto) escribirParrafo(cot.cierreTexto, { size: 10, color: DARK, spaceAfter: 10 })
  }

  // ── Exclusiones ──
  if (cot.exclusiones?.length) {
    escribirTitulo('Esta cotización no incluye')
    for (const ex of cot.exclusiones) {
      escribirParrafo(`– ${ex}`, { size: 9, color: GRAY, gap: 12, spaceAfter: 5 })
    }
  }

  // ── Pie ──
  asegurarEspacio(30)
  y -= 10
  page.drawLine({ start: { x: MARGIN, y: y + 10 }, end: { x: PAGE_W - MARGIN, y: y + 10 }, thickness: 0.7, color: LINE })
  page.drawText(limpiar(`Propuesta confidencial - ${cot.cliente} - conectux.com`), { x: MARGIN, y, size: 8.5, font: fontRegular, color: GRAY })

  return pdf.save()
}
