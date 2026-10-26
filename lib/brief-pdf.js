import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { SECCIONES_BRIEF } from '../src/data/brief-preguntas.js'

const PURPLE = rgb(161 / 255, 0, 1)
const DARK = rgb(0.11, 0.07, 0.19)
const GRAY = rgb(0.45, 0.45, 0.5)
const PAGE_W = 595.28 // A4 en puntos
const PAGE_H = 841.89
const MARGIN = 56
const CONTENT_W = PAGE_W - MARGIN * 2

function envolverTexto(texto, font, size, maxWidth) {
  const palabras = texto.split(/\s+/)
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

const textoRespuesta = (pregunta, respuestas) => {
  const valor = respuestas[pregunta.id]
  let texto
  if (Array.isArray(valor)) {
    texto = valor.join(', ')
  } else {
    texto = (valor || '').toString().trim()
  }
  const otros = respuestas[pregunta.id + '_otros']
  if (otros && texto.includes('Otros')) {
    texto = texto.replace('Otros', `Otros: ${otros}`)
  }
  return texto
}

/** Genera el PDF con todas las preguntas y respuestas de un brief. */
export async function generarBriefPdf(cliente, respuestas) {
  const pdf = await PDFDocument.create()
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)

  let page = pdf.addPage([PAGE_W, PAGE_H])
  let y = PAGE_H - MARGIN

  const nuevaPagina = () => {
    page = pdf.addPage([PAGE_W, PAGE_H])
    y = PAGE_H - MARGIN
  }

  const asegurarEspacio = (alto) => {
    if (y - alto < MARGIN) nuevaPagina()
  }

  const escribirParrafo = (texto, { size = 10, font = fontRegular, color = DARK, gap = 13, spaceAfter = 4 } = {}) => {
    const lineas = envolverTexto(texto, font, size, CONTENT_W)
    for (const linea of lineas) {
      asegurarEspacio(gap)
      page.drawText(linea, { x: MARGIN, y, size, font, color })
      y -= gap
    }
    y -= spaceAfter
  }

  page.drawText('BRIEF DE MARCA', { x: MARGIN, y, size: 20, font: fontBold, color: DARK })
  y -= 26
  page.drawText(cliente, { x: MARGIN, y, size: 13, font: fontBold, color: PURPLE })
  y -= 18
  page.drawText(`Generado el ${new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })} · Conectux`, { x: MARGIN, y, size: 9, font: fontRegular, color: GRAY })
  y -= 30

  for (const seccion of SECCIONES_BRIEF) {
    asegurarEspacio(34)
    page.drawLine({ start: { x: MARGIN, y: y + 6 }, end: { x: PAGE_W - MARGIN, y: y + 6 }, thickness: 0.7, color: rgb(0.85, 0.85, 0.88) })
    y -= 10
    page.drawText(seccion.titulo.toUpperCase(), { x: MARGIN, y, size: 11.5, font: fontBold, color: PURPLE })
    y -= 20

    for (const pregunta of seccion.preguntas) {
      escribirParrafo(pregunta.label, { size: 9.5, font: fontBold, color: DARK, gap: 12, spaceAfter: 3 })
      const respuesta = textoRespuesta(pregunta, respuestas)
      if (respuesta) {
        escribirParrafo(respuesta, { size: 10, font: fontRegular, color: DARK, gap: 13, spaceAfter: 10 })
      } else {
        escribirParrafo('— sin responder —', { size: 9.5, font: fontRegular, color: GRAY, gap: 12, spaceAfter: 10 })
      }
    }
  }

  return pdf.save()
}
