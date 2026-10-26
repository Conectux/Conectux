// Preguntas del Brief Conectux — misma estructura que el formulario original de Google Forms,
// reconstruido como formulario nativo. Cada pregunta tiene un id único (clave en `respuestas`).
export const SECCIONES_BRIEF = [
  {
    titulo: '1. Información general de la marca',
    preguntas: [
      { id: 'nombre_marca', label: 'Nombre de su marca', tipo: 'texto', requerido: true },
      { id: 'persona_responsable', label: 'Nombre persona responsable', tipo: 'texto', requerido: true },
      { id: 'cargo', label: 'Cargo dentro de la empresa', tipo: 'texto', requerido: false },
      { id: 'ciudad_pais', label: 'Ciudad y país donde opera la marca', tipo: 'texto', requerido: true },
    ],
  },
  {
    titulo: '2. Sobre tu negocio',
    preguntas: [
      { id: 'productos_servicios', label: '¿Qué productos o servicios ofrecen actualmente?', tipo: 'parrafo', requerido: true },
      { id: 'problema_principal', label: '¿Qué problema principal solucionas con tu producto o servicio?', tipo: 'parrafo', requerido: true },
      { id: 'mayor_beneficio', label: '¿Cuál es el mayor beneficio que obtiene tu cliente al comprarte?', tipo: 'parrafo', requerido: true },
    ],
  },
  {
    titulo: '3. Diferenciación y mercado',
    preguntas: [
      { id: 'diferencial', label: '¿Cuál es el diferencial más fuerte frente a su competencia?', tipo: 'parrafo', requerido: true },
      { id: 'por_que_elegirte', label: '¿Por qué un cliente debería elegirte a ti y no a otra marca?', tipo: 'parrafo', requerido: false },
      { id: 'objeciones', label: '¿Qué objeciones suelen poner sus clientes antes de comprar?', tipo: 'parrafo', requerido: true },
      { id: 'preguntas_antes_comprar', label: '¿Qué preguntas te hacen siempre antes de cerrar una venta?', tipo: 'parrafo', requerido: true },
    ],
  },
  {
    titulo: '4. Objetivos del proyecto',
    preguntas: [
      {
        id: 'objetivos', label: '¿Qué objetivos quieres lograr con nuestra ayuda? (puedes marcar varios)', tipo: 'checkbox', requerido: true,
        opciones: ['Aumentar ventas', 'Captar más leads', 'Posicionar marca', 'Aumentar comunidad', 'Autoridad en el mercado'],
        otros: true,
      },
    ],
  },
  {
    titulo: '5. Avatar / cliente ideal — Perfil demográfico',
    preguntas: [
      { id: 'edad_cliente', label: 'Edad aproximada de tu cliente ideal', tipo: 'texto', requerido: true },
      { id: 'ubicacion_cliente', label: 'Ubicación', tipo: 'texto', requerido: true },
      { id: 'nivel_socioeconomico', label: 'Nivel socioeconómico', tipo: 'opcion', requerido: true, opciones: ['Bajo', 'Medio Bajo', 'Medio', 'Medio Alto', 'Alto'] },
      { id: 'persona_o_empresa', label: '¿Es persona natural o empresa?', tipo: 'opcion', requerido: true, opciones: ['Persona Natural', 'Empresa'] },
    ],
  },
  {
    titulo: 'Avatar / cliente ideal — Perfil profesional',
    preguntas: [
      { id: 'a_que_se_dedica', label: '¿A qué se dedica tu cliente ideal?', tipo: 'parrafo', requerido: true },
      { id: 'negocio_propio_o_empresa', label: '¿Tiene negocio propio o trabaja para una empresa?', tipo: 'texto', requerido: true },
      {
        id: 'nivel_profesional', label: '¿En qué nivel está?', tipo: 'opcion', requerido: true,
        opciones: ['Emprendedor', 'Empresario', 'Profesional', 'Directivo'], otros: true,
      },
    ],
  },
  {
    titulo: 'Avatar / cliente ideal — Perfil emocional y mental',
    preguntas: [
      { id: 'frustracion', label: '¿Qué le frustra hoy en relación a tu producto o servicio?', tipo: 'parrafo', requerido: true },
      { id: 'miedo_compra', label: '¿Qué miedo tiene antes de comprar?', tipo: 'parrafo', requerido: true },
      { id: 'deseo_real', label: '¿Qué desea lograr realmente (más allá del dinero)?', tipo: 'parrafo', requerido: true },
      { id: 'que_lo_desvela', label: '¿Qué lo mantiene despierto por las noches?', tipo: 'parrafo', requerido: true },
    ],
  },
  {
    titulo: 'Avatar / cliente ideal — Nivel de conciencia',
    preguntas: [
      {
        id: 'nivel_conciencia', label: 'Tu cliente ideal hoy...', tipo: 'opcion', requerido: true,
        opciones: ['Sabe que tiene un problema', 'Sabe que necesita una solución', 'Ya compara proveedores', 'Ya compra activamente'],
      },
    ],
  },
  {
    titulo: 'Avatar / cliente ideal — Comportamiento digital',
    preguntas: [
      {
        id: 'redes_sociales', label: '¿En qué redes sociales pasa más tiempo?', tipo: 'checkbox', requerido: true,
        opciones: ['Instagram', 'TikTok', 'Facebook', 'WhatsApp', 'LinkedIn', 'X'],
      },
      { id: 'tipo_contenido_consume', label: '¿Consume contenido educativo, entretenimiento o ventas?', tipo: 'parrafo', requerido: true },
      { id: 'compra_impulso_o_analisis', label: '¿Compra por impulso o necesita mucho análisis?', tipo: 'parrafo', requerido: true },
      { id: 'preguntas_frecuentes', label: '¿Qué preguntas te hacen siempre? Ejemplo: ¿Cuánto cuesta tu servicio?', tipo: 'parrafo', requerido: true },
    ],
  },
  {
    titulo: '6. Identidad de marca',
    preguntas: [
      { id: 'valores_marca', label: '¿Cuáles son los valores más importantes de tu marca? (Ej. honestidad, innovación, calidad)', tipo: 'parrafo', requerido: true },
      { id: 'mision_marca', label: '¿Cuál es la misión de tu marca?', tipo: 'parrafo', requerido: true },
      { id: 'descripcion_marca', label: '¿Cómo describirías tu marca en pocas palabras?', tipo: 'parrafo', requerido: true },
    ],
  },
  {
    titulo: '7. Comunicación y tono',
    preguntas: [
      {
        id: 'tono_comunicacion', label: '¿Cómo quieres que tu marca se comunique con sus seguidores?', tipo: 'checkbox', requerido: true,
        opciones: ['Cercana', 'Profesional', 'Educativa', 'Directa', 'Inspiradora'], otros: true,
      },
      { id: 'palabras_frases', label: '¿Qué palabras o frases usas regularmente en tus mensajes?', tipo: 'parrafo', requerido: true },
      { id: 'que_no_comunicar', label: '¿Qué cosas NO quieres que se comuniquen en tu marca?', tipo: 'parrafo', requerido: true },
      { id: 'percepcion_deseada', label: '¿Cómo te gustaría que las personas perciban tu marca?', tipo: 'parrafo', requerido: true },
      { id: 'referencias_visuales', label: '¿Tienes referencias visuales que te gusten?', tipo: 'parrafo', requerido: true },
      { id: 'contenido_no_hacer', label: '¿Hay algún tipo de contenido que NO quieres hacer?', tipo: 'parrafo', requerido: false },
    ],
  },
  {
    titulo: '8. Competencia y referentes',
    preguntas: [
      { id: 'competidores', label: 'Pon el nombre de tus principales competidores y dinos cómo aparecen en redes', tipo: 'parrafo', requerido: true },
      { id: 'que_hacen_bien', label: '¿Qué hacen bien en redes?', tipo: 'parrafo', requerido: true },
      { id: 'que_hacen_mal', label: '¿Qué hacen mal o no te gusta?', tipo: 'parrafo', requerido: true },
      { id: 'marcas_inspiran', label: '¿Qué marcas te inspiran y por qué?', tipo: 'parrafo', requerido: true },
    ],
  },
  {
    titulo: '9. Contenido y material',
    preguntas: [
      { id: 'fotos_videos_link', label: '¿Tienes fotos o videos profesionales? (link)', tipo: 'texto', requerido: true },
      { id: 'logo_material_link', label: '¿Tienes logotipo y material gráfico? (link)', tipo: 'texto', requerido: false },
      { id: 'manual_marca_link', label: '¿Cuentas con manual de marca? (link)', tipo: 'texto', requerido: true },
      { id: 'colores_marca', label: '¿Qué colores representan a tu marca? (¿Por qué escogiste esos colores?)', tipo: 'parrafo', requerido: true },
    ],
  },
  {
    titulo: '10. Comentarios finales',
    preguntas: [
      { id: 'comentarios_finales', label: '¿Hay algo importante que debamos saber antes de empezar?', tipo: 'parrafo', requerido: false },
    ],
  },
]

export const TOTAL_PREGUNTAS = SECCIONES_BRIEF.reduce((n, s) => n + s.preguntas.length, 0)
