import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const PURPLE = rgb(161 / 255, 0, 1)
const DARK = rgb(0.11, 0.07, 0.19)
const GRAY = rgb(0.4, 0.4, 0.45)
const PAGE_W = 595.28 // A4 en puntos
const PAGE_H = 841.89
const MARGIN = 56
const CONTENT_W = PAGE_W - MARGIN * 2

const formatoFechaLarga = (iso) => {
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} de ${meses[m - 1]} de ${y}`
}

// Envuelve texto en líneas que quepan en maxWidth, usando la fuente/tamaño dados.
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

/**
 * Genera el PDF del contrato sin la firma del cliente (la firma de Conectux ya va incrustada).
 * Devuelve los bytes del PDF y el rectángulo exacto {pageIndex, x, y, width, height} donde
 * debe estamparse la firma del cliente más adelante.
 */
export async function generarContratoSinFirmar(datos, firmaRepresentanteBytes) {
  const {
    cliente, documentoCliente, ciudad,
    fechaInicioContrato, fechaInicioTrabajo, plan,
    nombreRepresentante,
  } = datos

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

  const escribirParrafo = (texto, { size = 10.5, font = fontRegular, color = DARK, gap = 14, spaceAfter = 10 } = {}) => {
    const lineas = envolverTexto(texto, font, size, CONTENT_W)
    for (const linea of lineas) {
      asegurarEspacio(gap)
      page.drawText(linea, { x: MARGIN, y, size, font, color })
      y -= gap
    }
    y -= spaceAfter
  }

  const escribirTitulo = (texto, { size = 11, spaceBefore = 6, spaceAfter = 8 } = {}) => {
    asegurarEspacio(size + spaceBefore + spaceAfter)
    y -= spaceBefore
    page.drawText(texto, { x: MARGIN, y, size, font: fontBold, color: PURPLE })
    y -= size + spaceAfter
  }

  // ── Encabezado ──
  page.drawText('CONTRATO DE PRESTACIÓN DE SERVICIOS', { x: MARGIN, y, size: 16, font: fontBold, color: DARK })
  y -= 20
  page.drawText('DE MARKETING DIGITAL', { x: MARGIN, y, size: 16, font: fontBold, color: DARK })
  y -= 28
  page.drawText('CONECTUX S.A.S. · NIT 901.562.623', { x: MARGIN, y, size: 9.5, font: fontRegular, color: GRAY })
  y -= 26

  escribirParrafo(
    `Entre los suscritos, CONECTUX S.A.S., sociedad identificada con NIT 901.562.623, representada legalmente por ${nombreRepresentante} (en adelante "CONECTUX"), y ${cliente}, identificado(a) con documento No. ${documentoCliente}, domiciliado(a) en ${ciudad} (en adelante "EL CLIENTE"), se celebra el presente contrato de prestación de servicios de marketing digital, sujeto a las siguientes cláusulas:`
  )

  escribirTitulo('PRIMERA — OBJETO')
  escribirParrafo(`CONECTUX prestará a EL CLIENTE servicios de marketing digital bajo el siguiente plan de trabajo: ${plan}.`)

  escribirTitulo('SEGUNDA — VIGENCIA')
  escribirParrafo(
    `El presente contrato inicia su vigencia el ${formatoFechaLarga(fechaInicioContrato)}. Los servicios contratados comenzarán a ejecutarse a partir del ${formatoFechaLarga(fechaInicioTrabajo)}.`
  )

  escribirTitulo('TERCERA — TITULARIDAD DE LA ESTRATEGIA Y CAMPAÑAS')
  escribirParrafo(
    'Las estrategias, estructuras de campañas, segmentaciones y configuraciones de pauta digital desarrolladas por CONECTUX S.A.S. en ejecución del presente contrato son de su propiedad y know-how exclusivo. Finalizada la relación comercial por cualquier causa, CONECTUX S.A.S. procederá a pausar o desactivar dichas campañas, sin que ello genere derecho a indemnización alguna a favor de EL CLIENTE.'
  )

  escribirTitulo('CUARTA — TERMINACIÓN Y PREAVISO')
  escribirParrafo(
    'Cualquiera de las partes podrá dar por terminado el presente contrato. EL CLIENTE deberá notificar su intención de terminación con un preaviso mínimo de treinta (30) días calendario de anticipación a la fecha efectiva de terminación de los servicios.'
  )

  escribirTitulo('QUINTA — SERVICIOS ADICIONALES')
  escribirParrafo(
    'Todo servicio, pieza o actividad solicitada por EL CLIENTE que no esté expresamente incluida en el plan contratado deberá ser objeto de una cotización independiente, aprobada por escrito antes de su ejecución.'
  )

  escribirParrafo(
    'Las partes aceptan que la firma electrónica consignada en este documento es válida y vinculante de conformidad con la Ley 527 de 1999 y demás normas concordantes, y produce los mismos efectos jurídicos que la firma manuscrita.',
    { size: 9, color: GRAY, gap: 12, spaceAfter: 6 }
  )

  // ── Bloque de firmas ──
  const alturaBloqueFirmas = 150
  asegurarEspacio(alturaBloqueFirmas)
  y -= 20

  const colAncho = CONTENT_W / 2 - 14
  const colIzqX = MARGIN
  const colDerX = MARGIN + CONTENT_W / 2 + 14
  const yBloque = y

  // Firma de Conectux (imagen fija del representante legal)
  if (firmaRepresentanteBytes) {
    const esPng = firmaRepresentanteBytes[0] === 0x89
    const imagen = esPng ? await pdf.embedPng(firmaRepresentanteBytes) : await pdf.embedJpg(firmaRepresentanteBytes)
    const escala = Math.min(colAncho / imagen.width, 60 / imagen.height)
    page.drawImage(imagen, {
      x: colIzqX, y: yBloque - 55,
      width: imagen.width * escala, height: imagen.height * escala,
    })
  }
  page.drawLine({ start: { x: colIzqX, y: yBloque - 60 }, end: { x: colIzqX + colAncho, y: yBloque - 60 }, thickness: 0.7, color: GRAY })
  page.drawText('CONECTUX S.A.S.', { x: colIzqX, y: yBloque - 74, size: 9.5, font: fontBold, color: DARK })
  page.drawText(nombreRepresentante, { x: colIzqX, y: yBloque - 87, size: 9, font: fontRegular, color: GRAY })
  page.drawText('Representante Legal', { x: colIzqX, y: yBloque - 99, size: 9, font: fontRegular, color: GRAY })

  // Área reservada para la firma del cliente (se completa al firmar)
  const firmaClienteRect = { pageIndex: pdf.getPageCount() - 1, x: colDerX, y: yBloque - 60, width: colAncho, height: 55 }
  page.drawLine({ start: { x: colDerX, y: yBloque - 60 }, end: { x: colDerX + colAncho, y: yBloque - 60 }, thickness: 0.7, color: GRAY })
  page.drawText('EL CLIENTE', { x: colDerX, y: yBloque - 74, size: 9.5, font: fontBold, color: DARK })
  page.drawText(cliente, { x: colDerX, y: yBloque - 87, size: 9, font: fontRegular, color: GRAY })
  page.drawText(`C.C./NIT ${documentoCliente}`, { x: colDerX, y: yBloque - 99, size: 9, font: fontRegular, color: GRAY })

  const pdfBytes = await pdf.save()
  return { pdfBytes, firmaClienteRect }
}

/**
 * Toma un contrato ya generado (sin firma del cliente) y le estampa la firma del cliente
 * más un bloque de auditoría (nombre, fecha/hora, IP) en el área reservada.
 */
export async function insertarFirmaCliente(pdfBytesOriginal, firmaClienteRect, datosFirma) {
  const { nombreFirmante, firmaImagenBytes, firmaImagenTipo, fechaHoraISO, ip } = datosFirma

  const pdf = await PDFDocument.load(pdfBytesOriginal)
  const page = pdf.getPage(firmaClienteRect.pageIndex)
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica)

  // firmaClienteRect.y es la línea sobre la que va "EL CLIENTE" / nombre / documento.
  // La firma se dibuja ARRIBA de esa línea (igual que la firma de Conectux), con un
  // pequeño espacio de separación.
  const imagen = firmaImagenTipo === 'png' ? await pdf.embedPng(firmaImagenBytes) : await pdf.embedJpg(firmaImagenBytes)
  const escala = Math.min(firmaClienteRect.width / imagen.width, firmaClienteRect.height / imagen.height)
  page.drawImage(imagen, {
    x: firmaClienteRect.x,
    y: firmaClienteRect.y + 5,
    width: imagen.width * escala,
    height: imagen.height * escala,
  })

  // El bloque de auditoría va DEBAJO del texto fijo (EL CLIENTE / nombre / documento),
  // que ya ocupa hasta ~39pt bajo la línea.
  const fecha = new Date(fechaHoraISO)
  const fechaTexto = fecha.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
  page.drawText(`Firmado electrónicamente por ${nombreFirmante}`, {
    x: firmaClienteRect.x, y: firmaClienteRect.y - 54,
    size: 7, font: fontRegular, color: GRAY,
  })
  page.drawText(`${fechaTexto} · IP ${ip || 'no disponible'}`, {
    x: firmaClienteRect.x, y: firmaClienteRect.y - 64,
    size: 7, font: fontRegular, color: GRAY,
  })

  return pdf.save()
}
