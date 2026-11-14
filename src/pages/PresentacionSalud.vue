<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useReveal } from '../composables/useReveal'
import logo from '../assets/logo-conectux.png'

const page = ref(null)
const { init } = useReveal()
onMounted(() => init(page.value))

const challenges = [
  {
    icon: 'mdi-eye-off-outline',
    color: '#a100ff',
    title: 'No eres suficientemente visible',
    desc: 'Tu consulta es excelente, pero los pacientes no te encuentran antes de ir donde la competencia.',
  },
  {
    icon: 'mdi-shield-off-outline',
    color: '#c84bff',
    title: 'Tu presencia no genera confianza',
    desc: 'Tus redes no comunican quién eres ni por qué confiar en ti. Solo hay contenido sin estrategia.',
  },
  {
    icon: 'mdi-chart-timeline',
    color: '#00d4ff',
    title: 'Dependes solo del voz a voz',
    desc: 'El crecimiento es lento e impredecible. No tienes un sistema que atraiga pacientes de forma constante.',
  },
]

const results = [
  { icon: 'mdi-shield-star-outline', title: 'Mayor posicionamiento', desc: 'Tu marca médica se convierte en referente dentro de tu especialidad y zona geográfica.' },
  { icon: 'mdi-account-heart-outline', title: 'Más confianza del paciente', desc: 'Los pacientes llegan con intención y confianza antes de hacer su primera consulta.' },
  { icon: 'mdi-message-text-outline', title: 'Conversaciones calificadas', desc: 'Solo personas que realmente están interesadas en tu servicio te contactan.' },
  { icon: 'mdi-calendar-check-outline', title: 'Más citas agendadas', desc: 'El sistema convierte el interés digital en citas reales para tu agenda.' },
  { icon: 'mdi-badge-account-outline', title: 'Imagen profesional', desc: 'Tu perfil transmite autoridad, no una página abandonada o meramente estética.' },
  { icon: 'mdi-trending-up', title: 'Crecimiento predecible', desc: 'Cada acción tiene un objetivo comercial claro. No publicamos por publicar.' },
]

const steps = [
  {
    number: '01',
    icon: 'mdi-magnify',
    title: 'Estrategia inicial',
    desc: 'Diagnóstico de marca, servicios, público ideal, diferenciales y objetivos comerciales de tu consulta.',
    tags: ['Diagnóstico de marca', 'Público ideal', 'Objetivos claros'],
  },
  {
    number: '02',
    icon: 'mdi-doctor',
    title: 'Posicionamiento médico',
    desc: 'Definimos cómo comunicar tu experiencia para que te veas confiable, experto y cercano sin sonar comercial ni invasivo.',
    tags: ['Tono de voz', 'Autoridad médica', 'Diferenciación'],
  },
  {
    number: '03',
    icon: 'mdi-video-plus-outline',
    title: 'Creación de contenido',
    desc: 'Reels, carruseles, historias y piezas educativas estratégicas que resuelvan dudas reales de tus pacientes.',
    tags: ['Reels', 'Carruseles', 'Guiones para video'],
  },
  {
    number: '04',
    icon: 'mdi-bullhorn-outline',
    title: 'Campañas publicitarias',
    desc: 'Pauta en Meta Ads para llevar tráfico calificado hacia tu WhatsApp, formulario o agenda.',
    tags: ['Meta Ads', 'Público segmentado', 'Pauta estratégica'],
  },
  {
    number: '05',
    icon: 'mdi-filter-check-outline',
    title: 'Embudo de atención',
    desc: 'Revisamos cómo llega el paciente, qué mensaje recibe, cómo se le responde y cómo se guía hasta la cita.',
    tags: ['Flujo de mensajes', 'WhatsApp', 'Seguimiento'],
  },
  {
    number: '06',
    icon: 'mdi-chart-line',
    title: 'Optimización mensual',
    desc: 'Analizamos contenidos, campañas y conversaciones para mejorar los resultados cada mes.',
    tags: ['Reporte mensual', 'Ajustes continuos', 'Datos reales'],
  },
]

const videos = ref([
  'https://www.instagram.com/reel/DXIMvz-CWb3/',
  'https://www.instagram.com/reel/DUt6P1TgaoZ/',
  'https://www.instagram.com/reel/DWB0-u5DXP6/',
])

const embedUrl = (url) => {
  const match = url.match(/instagram\.com\/(?:reel|p)\/([^/?]+)/)
  return match ? `https://www.instagram.com/reel/${match[1]}/embed/` : null
}

const offerItems = [
  { title: 'Estrategia mensual de contenido', desc: 'Plan editorial con objetivos comerciales claros para cada mes.' },
  { title: 'Creación de contenido', desc: 'Reels, posts e historias para tu marca médica. Tú eliges la cantidad en el cotizador.' },
  { title: 'Sesión de grabación mensual', desc: 'Grabamos contigo el material del mes, con guiones enfocados en tu especialidad.' },
  { title: 'Diseño de piezas gráficas', desc: 'Diseño profesional de todas las piezas visuales del mes.' },
  { title: 'Publicación en Instagram, Facebook y TikTok', desc: 'Tu contenido publicado en las tres redes sin costo adicional.' },
  { title: 'Gestión de campañas Meta Ads', desc: 'Configuración, segmentación y optimización de pauta publicitaria.' },
  { title: 'Reporte mensual con resultados', desc: 'Métricas de alcance, leads, conversaciones y ROI cada mes.' },
  { title: 'Consultoría estratégica mensual', desc: 'Reunión de revisión y ajuste de estrategia con tu equipo Conectux.' },
]

const excluded = [
  'Presupuesto de pauta (va directo a Meta)',
  'Uso de mensajes de WhatsApp (API)',
]

// ─── Cotizador ─────────────────────────────────────────────
// Todos los precios en COP / mes. Editar aquí para cambiar el cotizador.
// El plan base ($1.500.000) incluye las cantidades mínimas de contenido,
// estrategia + consultoría, gestión Meta Ads y publicación en IG + FB + TikTok.
const PRICING = {
  base: 1_500_000,
  metaAds: 300_000,        // se descuenta si el cliente quita Meta Ads (mínimo $1.200.000)
  reel: 120_000,           // por reel adicional
  post: 60_000,            // por post adicional
  historiaDia: 40_000,     // por cada día adicional de historias a la semana
  sesion: 200_000,         // por sesión de grabación adicional
  crmUSD: 50,              // CRM + embudo de atención al paciente, en dólares (TRM del día)
  botUSD: 100,             // bot de IA, en dólares (se convierte con la TRM del día)
  tiktokEstrategia: 300_000, // estrategia diferente para TikTok
  tiktokReel: 120_000,     // por reel exclusivo de TikTok
}
const INCLUDED = { reels: 4, posts: 4, historias: 3, sesiones: 1 }
const WHATSAPP = '573147101116'

// TRM: oficial (datos.gov.co) → respaldo (open.er-api.com) → valor fijo
const TRM_FALLBACK = 3_300
const trm = ref({ value: TRM_FALLBACK, source: 'aprox.', loading: true })
const loadTrm = async () => {
  try {
    const r = await fetch('https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciadesde%20DESC&$limit=1')
    const v = parseFloat((await r.json())?.[0]?.valor)
    if (v > 0) return (trm.value = { value: v, source: 'TRM oficial', loading: false })
  } catch {}
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD')
    const v = (await r.json())?.rates?.COP
    if (v > 0) return (trm.value = { value: v, source: 'tasa del día', loading: false })
  } catch {}
  trm.value = { value: TRM_FALLBACK, source: 'aprox.', loading: false }
}
onMounted(loadTrm)
const usdToCop = (usd) => Math.round((usd * trm.value.value) / 1000) * 1000
const botCOP = computed(() => usdToCop(PRICING.botUSD))
const crmCOP = computed(() => usdToCop(PRICING.crmUSD))

const quantityControls = [
  { key: 'reels', label: 'Reels', line: 'reels', one: 'reel', icon: 'mdi-movie-open-play-outline', unit: 'al mes', max: 12, price: PRICING.reel },
  { key: 'posts', label: 'Posts', line: 'posts', one: 'post', icon: 'mdi-view-carousel-outline', unit: 'al mes', max: 12, price: PRICING.post },
  { key: 'historias', label: 'Historias', line: 'días de historias', one: 'día de historias', icon: 'mdi-circle-slice-8', unit: 'días por semana', max: 7, price: PRICING.historiaDia },
  { key: 'sesiones', label: 'Grabación', line: 'sesiones de grabación', one: 'sesión de grabación', icon: 'mdi-video-vintage', unit: 'sesiones al mes', max: 4, price: PRICING.sesion },
]

const durations = [
  { key: 'none', label: 'Sin permanencia', short: 'Mes a mes', tag: 'Sin permanencia', discount: 0, months: 0,
    desc: 'Pagas mes a mes y puedes terminar el servicio cuando quieras. Total libertad, sin descuento.' },
  { key: '6', label: '6 meses', short: '6 meses', tag: '−5%', discount: 0.05, months: 6,
    desc: 'Te comprometes a mantener el plan durante 6 meses y, a cambio, pagas 5% menos cada mes.' },
  { key: '12', label: '12 meses', short: '12 meses', tag: '−10%', discount: 0.1, months: 12,
    desc: 'Te comprometes a mantener el plan durante 12 meses y, a cambio, pagas 10% menos cada mes. Es la opción con mayor ahorro.' },
]

const quote = ref({
  reels: INCLUDED.reels,
  posts: INCLUDED.posts,
  historias: INCLUDED.historias,
  sesiones: INCLUDED.sesiones,
  metaAds: true,
  crm: false,
  bot: false,
  tiktok: false,
  tiktokReels: 4,
  duration: 'none',
})

const changeQty = (ctrl, delta) => {
  const min = INCLUDED[ctrl.key]
  quote.value[ctrl.key] = Math.min(ctrl.max, Math.max(min, quote.value[ctrl.key] + delta))
}
const changeTiktokReels = (delta) => {
  quote.value.tiktokReels = Math.min(12, Math.max(1, quote.value.tiktokReels + delta))
}

const fmt = (n) => '$' + Math.round(n).toLocaleString('es-CO')

const breakdown = computed(() => {
  const q = quote.value
  const lines = [{ label: 'Plan base', amount: PRICING.base }]
  if (!q.metaAds) lines.push({ label: 'Sin gestión de Meta Ads', amount: -PRICING.metaAds })
  for (const c of quantityControls) {
    const extra = q[c.key] - INCLUDED[c.key]
    if (extra > 0) lines.push({ label: `+${extra} ${extra === 1 ? c.one : c.line}`, amount: extra * c.price })
  }
  if (q.crm) lines.push({ label: `CRM + embudo (US$${PRICING.crmUSD})`, amount: crmCOP.value })
  if (q.bot) lines.push({ label: `Bot de IA (US$${PRICING.botUSD})`, amount: botCOP.value })
  if (q.tiktok) {
    lines.push({ label: 'Estrategia TikTok', amount: PRICING.tiktokEstrategia })
    lines.push({ label: `${q.tiktokReels} reels exclusivos TikTok`, amount: q.tiktokReels * PRICING.tiktokReel })
  }
  return lines
})

const subtotal = computed(() => breakdown.value.reduce((a, l) => a + l.amount, 0))
const selectedDuration = computed(() => durations.find((d) => d.key === quote.value.duration))
const discountAmount = computed(() => Math.round(subtotal.value * selectedDuration.value.discount))
const total = computed(() => subtotal.value - discountAmount.value)

const whatsappLink = computed(() => {
  const q = quote.value
  const lines = [
    'Hola, quiero cotizar el plan de marketing para mi consulta:',
    `• ${q.reels} reels, ${q.posts} posts al mes`,
    `• Historias ${q.historias} días por semana`,
    `• ${q.sesiones} ${q.sesiones === 1 ? 'sesión' : 'sesiones'} de grabación al mes`,
    `• Gestión Meta Ads: ${q.metaAds ? 'Sí' : 'No'}`,
    `• CRM + embudo: ${q.crm ? `Sí (US$${PRICING.crmUSD} ≈ ${fmt(crmCOP.value)})` : 'No'}`,
    `• Bot de IA: ${q.bot ? `Sí (US$${PRICING.botUSD} ≈ ${fmt(botCOP.value)})` : 'No'}`,
    `• Estrategia TikTok: ${q.tiktok ? `Sí (${q.tiktokReels} reels)` : 'No'}`,
    `• Permanencia: ${selectedDuration.value.label}`,
    `Total estimado: ${fmt(total.value)} / mes + IVA`,
  ]
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`
})

const extraCost = (c) => (quote.value[c.key] - INCLUDED[c.key]) * c.price
const durationIndex = computed(() => durations.findIndex((d) => d.key === quote.value.duration))
const totalSavings = computed(() => discountAmount.value * selectedDuration.value.months)

const services = computed(() => [
  {
    key: 'metaAds',
    icon: 'mdi-bullhorn-outline',
    title: 'Gestión de Meta Ads',
    desc: 'Campañas en Facebook e Instagram',
    price: quote.value.metaAds ? 'Incluido en el plan' : `Ahorras ${fmt(PRICING.metaAds)} sin este servicio`,
    included: true,
  },
  {
    key: 'crm',
    icon: 'mdi-account-convert-outline',
    title: 'CRM + embudo de atención',
    desc: 'Seguimiento de cada paciente hasta la cita',
    price: `+US$${PRICING.crmUSD} ≈ ${fmt(crmCOP.value)} / mes`,
  },
  {
    key: 'bot',
    icon: 'mdi-robot-outline',
    title: 'Bot de IA',
    desc: 'Responde y califica pacientes 24/7',
    price: `+US$${PRICING.botUSD} ≈ ${fmt(botCOP.value)} / mes`,
  },
])

// Total animado
const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const displayTotal = ref(total.value)
let totalRaf = 0
watch(total, (to) => {
  cancelAnimationFrame(totalRaf)
  if (reduceMotion) return (displayTotal.value = to)
  const from = displayTotal.value
  const t0 = performance.now()
  const step = (t) => {
    const p = Math.min((t - t0) / 500, 1)
    const e = 1 - Math.pow(1 - p, 3)
    displayTotal.value = p < 1 ? Math.round((from + (to - from) * e) / 1000) * 1000 : to
    if (p < 1) totalRaf = requestAnimationFrame(step)
  }
  totalRaf = requestAnimationFrame(step)
})
const totalBump = ref(false)
watch(total, () => {
  totalBump.value = false
  requestAnimationFrame(() => (totalBump.value = true))
})

// Barra fija (móvil): visible mientras el cotizador está en pantalla y el resumen no
const quoterEl = ref(null)
const summaryEl = ref(null)
const quoterVisible = ref(false)
const summaryVisible = ref(false)
const showBar = computed(() => quoterVisible.value && !summaryVisible.value)
let barObservers = []
onMounted(() => {
  const watchEl = (el, target, options) => {
    if (!el) return
    const o = new IntersectionObserver(([e]) => (target.value = e.isIntersecting), options)
    o.observe(el)
    barObservers.push(o)
  }
  watchEl(quoterEl.value, quoterVisible, { threshold: 0 })
  watchEl(summaryEl.value, summaryVisible, { threshold: 0.2 })
})
onBeforeUnmount(() => {
  barObservers.forEach((o) => o.disconnect())
  cancelAnimationFrame(totalRaf)
})
const scrollToSummary = () =>
  summaryEl.value?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })

const whys = [
  { icon: 'mdi-hospital-building', text: 'Especializados 100% en el sector salud' },
  { icon: 'mdi-cog-sync-outline', text: 'Sistema completo: no solo publicaciones' },
  { icon: 'mdi-layers-outline', text: 'Estrategia + contenido + pauta + conversión' },
  { icon: 'mdi-chart-bar', text: 'Optimización mensual basada en datos reales' },
  { icon: 'mdi-handshake-outline', text: 'Acompañamiento cercano y personalizado' },
  { icon: 'mdi-calendar-star', text: 'Más de 6 años generando resultados en salud' },
]
</script>

<template>
  <v-app>
    <div ref="page">

      <!-- ─── NAV BAR ───────────────────────────────────────────── -->
      <header class="ps-navbar">
        <div class="ps-navbar-inner">
          <img :src="logo" alt="Conectux" class="ps-logo" />
        </div>
      </header>

      <!-- ─── HERO ──────────────────────────────────────────────── -->
      <section class="ps-hero">
        <div class="blob blob-1" />
        <div class="blob blob-2" />
        <div class="blob blob-3" />
        <div class="hero-grid" />

        <v-container class="ps-hero-container">
          <v-row justify="center">
            <v-col cols="12" md="9" lg="7" class="text-center">

              <div class="section-badge mx-auto mb-6">
                <v-icon size="15">mdi-medical-bag</v-icon>
                Marketing para el Sector Salud
              </div>

              <h1 class="ps-hero-title">
                Tu marca médica,<br />
                <span class="gradient-text">posicionada para</span><br />
                atraer pacientes
              </h1>

              <p class="ps-hero-sub mx-auto mt-6 mb-14">
                En salud, el paciente no compra por impulso. Primero necesita <strong>confiar</strong>.
                Construimos el sistema digital que posiciona tu consulta, genera autoridad y
                convierte el interés en <strong>citas reales</strong>.
              </p>

              <div class="ps-stats mx-auto">
                <div class="ps-stat">
                  <span class="ps-stat-num gradient-text">6+</span>
                  <span class="ps-stat-label">Años generando ventas</span>
                </div>
                <div class="ps-stat">
                  <span class="ps-stat-num gradient-text">50+</span>
                  <span class="ps-stat-label">Empresas atendidas</span>
                </div>
                <div class="ps-stat">
                  <span class="ps-stat-num gradient-text">+300%</span>
                  <span class="ps-stat-label">ROI promedio</span>
                </div>
              </div>

            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ─── EL RETO ───────────────────────────────────────────── -->
      <section class="ps-section ps-section-alt">
        <div class="ps-blob-center" />
        <v-container>
          <v-row justify="center" class="mb-14">
            <v-col cols="12" md="8" class="text-center">
              <div class="reveal section-badge mx-auto">
                <v-icon size="15">mdi-alert-circle-outline</v-icon>
                El reto del sector salud
              </div>
              <h2 class="reveal d1 ps-section-title mt-2">
                ¿Por qué la mayoría de doctores<br />
                <span class="gradient-text">no crecen en digital?</span>
              </h2>
              <p class="reveal d2 ps-section-sub">
                Tener buena reputación clínica no es suficiente hoy.
                El paciente busca en Google, mira redes y decide antes de llamar.
              </p>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col
              v-for="(c, i) in challenges"
              :key="i"
              cols="12"
              md="4"
              class="reveal"
              :class="`d${i + 1}`"
            >
              <div class="ps-challenge-card glass-card pa-8 h-100 text-center">
                <div class="ps-challenge-icon mx-auto mb-5" :style="`border-color: ${c.color}33; background: ${c.color}15`">
                  <v-icon size="30" :color="c.color">{{ c.icon }}</v-icon>
                </div>
                <h3 class="ps-card-title mb-3">{{ c.title }}</h3>
                <p class="ps-card-desc">{{ c.desc }}</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ─── LO QUE CONSEGUIRÁS ────────────────────────────────── -->
      <section class="ps-section">
        <v-container>
          <v-row justify="center" class="mb-14">
            <v-col cols="12" md="8" class="text-center">
              <div class="reveal section-badge mx-auto">
                <v-icon size="15">mdi-star-circle-outline</v-icon>
                Lo que conseguirás
              </div>
              <h2 class="reveal d1 ps-section-title mt-2">
                Resultados reales para<br />
                <span class="gradient-text">tu consulta médica</span>
              </h2>
              <p class="reveal d2 ps-section-sub">
                No prometemos pacientes mágicos. Construimos el sistema que
                aumenta las probabilidades de atraerlos y convertirlos.
              </p>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              v-for="(r, i) in results"
              :key="i"
              cols="12"
              sm="6"
              lg="4"
              class="reveal"
              :class="`d${(i % 3) + 1}`"
            >
              <div class="ps-result-card glass-card pa-7 h-100">
                <div class="ps-result-icon mb-4">
                  <v-icon size="26" color="#a100ff">{{ r.icon }}</v-icon>
                </div>
                <h3 class="ps-card-title mb-2">{{ r.title }}</h3>
                <p class="ps-card-desc">{{ r.desc }}</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ─── REFERENTES DE CONTENIDO ─────────────────────────── -->
      <section class="ps-section">
        <div class="ps-blob-center" />
        <v-container>
          <v-row justify="center" class="mb-14">
            <v-col cols="12" md="8" class="text-center">
              <div class="reveal section-badge mx-auto">
                <v-icon size="15">mdi-play-circle-outline</v-icon>
                Referentes de contenido
              </div>
              <h2 class="reveal d1 ps-section-title mt-2">
                Así se podría ver<br />
                <span class="gradient-text">tu consultorio</span>
              </h2>
              <p class="reveal d2 ps-section-sub">
                Contenido educativo, cercano y estratégico que posiciona al doctor
                como referente de confianza antes de que el paciente llame.
              </p>
            </v-col>
          </v-row>

          <!-- Videos embeds -->
          <div v-if="videos.length" class="ps-videos-row">
            <div
              v-for="(url, i) in videos"
              :key="i"
              class="reveal"
              :class="`d${i + 1}`"
            >
              <div class="ps-video-wrap">
                <iframe
                  :src="embedUrl(url)"
                  frameborder="0"
                  scrolling="no"
                  allowfullscreen
                  class="ps-video-frame"
                />
                <div class="ps-video-mask-bottom" />
              </div>
            </div>
          </div>

          <!-- Placeholders cuando no hay videos -->
          <v-row v-else justify="center">
            <v-col
              v-for="n in 3"
              :key="n"
              cols="12"
              sm="6"
              md="4"
              class="reveal d-flex justify-center"
              :class="`d${n}`"
            >
              <div class="ps-video-placeholder glass-card">
                <v-icon size="40" color="rgba(161,0,255,0.35)">mdi-instagram</v-icon>
                <p class="ps-placeholder-text mt-3">Video de referencia</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ─── EL SISTEMA ────────────────────────────────────────── -->
      <section id="sistema" class="ps-section ps-section-alt">
        <div class="ps-blob-center" />
        <v-container>
          <v-row justify="center" class="mb-16">
            <v-col cols="12" md="8" class="text-center">
              <div class="reveal section-badge mx-auto">
                <v-icon size="15">mdi-cog-outline</v-icon>
                Nuestro sistema
              </div>
              <h2 class="reveal d1 ps-section-title mt-2">
                Un sistema completo en<br />
                <span class="gradient-text">6 pasos probados</span>
              </h2>
              <p class="reveal d2 ps-section-sub">
                No trabajamos el marketing como simple diseño. Lo vemos como
                un ecosistema: estrategia, contenido, pauta y conversión.
              </p>
            </v-col>
          </v-row>

          <div class="ps-steps-wrapper">
            <div
              v-for="(step, i) in steps"
              :key="i"
              class="ps-step-row reveal"
              :class="`d${i + 1}`"
            >
              <div class="ps-step-num-col">
                <div class="ps-step-num">{{ step.number }}</div>
                <div v-if="i < steps.length - 1" class="ps-step-line" />
              </div>
              <div class="ps-step-card glass-card pa-7 mb-5">
                <div class="d-flex align-center mb-4" style="gap:16px">
                  <div class="ps-step-icon">
                    <v-icon size="24" color="#a100ff">{{ step.icon }}</v-icon>
                  </div>
                  <h3 class="ps-step-title">{{ step.title }}</h3>
                </div>
                <p class="ps-card-desc mb-5">{{ step.desc }}</p>
                <div class="d-flex flex-wrap" style="gap:8px">
                  <span v-for="tag in step.tags" :key="tag" class="ps-tag">
                    <v-icon size="13" color="#4ade80">mdi-check-circle</v-icon>
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </v-container>
      </section>

      <!-- ─── POR QUÉ CONECTUX ──────────────────────────────────── -->
      <section class="ps-section">
        <v-container>
          <v-row justify="center" align="center">
            <v-col cols="12" md="5" class="mb-10 mb-md-0">
              <div class="reveal section-badge">
                <v-icon size="15">mdi-lightning-bolt-outline</v-icon>
                Nuestro diferencial
              </div>
              <h2 class="reveal d1 ps-section-title mt-4">
                No somos una agencia genérica.<br />
                <span class="gradient-text">Somos tu equipo</span><br />
                de marketing médico.
              </h2>
              <p class="reveal d2 ps-section-sub mt-4">
                Una agencia común te hace publicaciones. Nosotros construimos
                el ecosistema para que tu marca médica sea más visible,
                más confiable y más rentable.
              </p>
            </v-col>
            <v-col cols="12" md="6" offset-md="1">
              <v-row>
                <v-col
                  v-for="(w, i) in whys"
                  :key="i"
                  cols="12"
                  sm="6"
                  class="reveal"
                  :class="`d${(i % 3) + 1}`"
                >
                  <div class="ps-why-item glass-card pa-5">
                    <v-icon size="22" color="#a100ff" class="mb-3">{{ w.icon }}</v-icon>
                    <p class="ps-why-text">{{ w.text }}</p>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ─── OFERTA ──────────────────────────────────────────────── -->
      <section class="ps-section ps-section-alt ps-offer-section">
        <div class="ps-blob-center" />
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="10" lg="8">

              <div class="text-center mb-12 reveal">
                <div class="section-badge mx-auto mb-5">
                  <v-icon size="15">mdi-gift-outline</v-icon>
                  La oferta
                </div>
                <h2 class="ps-section-title">
                  Esto es lo que vas<br />
                  <span class="gradient-text">a obtener</span>
                </h2>
              </div>

              <!-- Items incluidos -->
              <div class="ps-offer-grid reveal d1 mb-10">
                <div v-for="item in offerItems" :key="item.text" class="ps-offer-item">
                  <div class="ps-offer-check">
                    <v-icon size="16" color="#4ade80">mdi-check</v-icon>
                  </div>
                  <div>
                    <p class="ps-offer-item-title">{{ item.title }}</p>
                    <p class="ps-offer-item-desc">{{ item.desc }}</p>
                  </div>
                </div>
              </div>

              <!-- Botón sistema -->
              <div class="text-center reveal d2 mb-10">
                <v-btn
                  class="cta-btn"
                  href="https://app.conectux.com/"
                  target="_blank"
                  size="large"
                >
                  <v-icon start size="18">mdi-open-in-new</v-icon>
                  Conoce nuestro sistema Conectux
                </v-btn>
              </div>

              <!-- Cotizador -->
              <div id="cotizador" ref="quoterEl" class="qz">
                <div class="qz-glow" />

                <header class="qz-head">
                  <span class="qz-kicker">
                    <v-icon size="14">mdi-tune-variant</v-icon>
                    Cotizador
                  </span>
                  <h3 class="qz-title">Arma tu plan <span class="gradient-text">a la medida</span></h3>
                  <p class="qz-sub">Ajusta cada opción y mira tu inversión mensual al instante.</p>
                </header>

                <div class="qz-layout">
                  <div class="qz-controls">

                    <!-- 1. Contenido -->
                    <section class="qz-block">
                      <div class="qz-block-head">
                        <span class="qz-step">1</span>
                        <div>
                          <h4>Contenido mensual</h4>
                          <p>Lo que ves al inicio ya viene en el plan base.</p>
                        </div>
                      </div>
                      <div class="qz-tiles">
                        <div
                          v-for="c in quantityControls"
                          :key="c.key"
                          class="qz-tile"
                          :class="{ 'is-extra': extraCost(c) > 0 }"
                        >
                          <div class="qz-tile-top">
                            <span class="qz-tile-icon"><v-icon size="18">{{ c.icon }}</v-icon></span>
                            <span class="qz-chip" :class="{ 'qz-chip--extra': extraCost(c) > 0 }">
                              {{ extraCost(c) > 0 ? '+' + fmt(extraCost(c)) : 'Incluido' }}
                            </span>
                          </div>
                          <p class="qz-tile-label">{{ c.label }}</p>
                          <p class="qz-tile-unit">{{ c.unit }}</p>
                          <div class="qz-stepper">
                            <button
                              type="button"
                              :disabled="quote[c.key] <= INCLUDED[c.key]"
                              :aria-label="`Quitar ${c.label}`"
                              @click="changeQty(c, -1)"
                            ><v-icon size="18">mdi-minus</v-icon></button>
                            <span class="qz-num" aria-live="polite">{{ quote[c.key] }}</span>
                            <button
                              type="button"
                              :disabled="quote[c.key] >= c.max"
                              :aria-label="`Agregar ${c.label}`"
                              @click="changeQty(c, 1)"
                            ><v-icon size="18">mdi-plus</v-icon></button>
                          </div>
                          <p class="qz-tile-price">{{ fmt(c.price) }} c/u adicional</p>
                        </div>
                      </div>
                    </section>

                    <!-- 2. Servicios -->
                    <section class="qz-block">
                      <div class="qz-block-head">
                        <span class="qz-step">2</span>
                        <div>
                          <h4>Servicios</h4>
                          <p>Activa lo que necesites para tu consulta.</p>
                        </div>
                      </div>
                      <label
                        v-for="sv in services"
                        :key="sv.key"
                        class="qz-option"
                        :class="{ on: quote[sv.key] }"
                      >
                        <span class="qz-option-icon"><v-icon size="20">{{ sv.icon }}</v-icon></span>
                        <span class="qz-option-text">
                          <strong>{{ sv.title }}</strong>
                          <small>{{ sv.desc }}</small>
                          <em :class="{ 'qz-included': sv.included && quote[sv.key] }">{{ sv.price }}</em>
                        </span>
                        <input v-model="quote[sv.key]" type="checkbox" class="qz-switch" />
                      </label>
                      <p class="qz-trm">
                        <v-icon size="13">mdi-swap-horizontal</v-icon>
                        {{ trm.loading ? 'Consultando TRM del día…' : `Pesos calculados con ${trm.source}: ${fmt(trm.value)} por dólar` }}
                      </p>
                    </section>

                    <!-- 3. Redes -->
                    <section class="qz-block">
                      <div class="qz-block-head">
                        <span class="qz-step">3</span>
                        <div>
                          <h4>Redes sociales</h4>
                          <p>Publicamos tu contenido en las tres redes sin costo extra.</p>
                        </div>
                      </div>
                      <div class="qz-networks">
                        <span v-for="n in [
                          { icon: 'mdi-instagram', name: 'Instagram' },
                          { icon: 'mdi-facebook', name: 'Facebook' },
                          { icon: 'mdi-music-note', name: 'TikTok' },
                        ]" :key="n.name" class="qz-network">
                          <v-icon size="16">{{ n.icon }}</v-icon>
                          {{ n.name }}
                          <v-icon size="14" color="#4ade80">mdi-check-circle</v-icon>
                        </span>
                      </div>
                      <label class="qz-option" :class="{ on: quote.tiktok }">
                        <span class="qz-option-icon qz-option-icon--tiktok"><v-icon size="20">mdi-music-note</v-icon></span>
                        <span class="qz-option-text">
                          <strong>Estrategia propia para TikTok</strong>
                          <small>Contenido pensado solo para TikTok</small>
                          <em>+{{ fmt(PRICING.tiktokEstrategia) }} / mes + reels exclusivos</em>
                        </span>
                        <input v-model="quote.tiktok" type="checkbox" class="qz-switch" />
                      </label>
                      <transition name="qz-expand">
                        <div v-if="quote.tiktok" class="qz-sub-control">
                          <div>
                            <p class="qz-tile-label">Reels para TikTok</p>
                            <p class="qz-tile-unit">{{ fmt(PRICING.tiktokReel) }} c/u · al mes</p>
                          </div>
                          <div class="qz-stepper qz-stepper--inline">
                            <button type="button" :disabled="quote.tiktokReels <= 1" aria-label="Quitar reel de TikTok" @click="changeTiktokReels(-1)"><v-icon size="18">mdi-minus</v-icon></button>
                            <span class="qz-num" aria-live="polite">{{ quote.tiktokReels }}</span>
                            <button type="button" :disabled="quote.tiktokReels >= 12" aria-label="Agregar reel de TikTok" @click="changeTiktokReels(1)"><v-icon size="18">mdi-plus</v-icon></button>
                          </div>
                        </div>
                      </transition>
                    </section>

                    <!-- 4. Permanencia -->
                    <section class="qz-block">
                      <div class="qz-block-head">
                        <span class="qz-step">4</span>
                        <div>
                          <h4>Permanencia</h4>
                          <p>Es el tiempo mínimo que te comprometes a mantener el plan. A más tiempo, menor pago mensual.</p>
                        </div>
                      </div>
                      <div class="qz-seg" role="radiogroup" aria-label="Permanencia" :style="{ '--i': durationIndex }">
                        <span class="qz-seg-pill" />
                        <button
                          v-for="d in durations"
                          :key="d.key"
                          type="button"
                          role="radio"
                          :aria-checked="quote.duration === d.key"
                          :class="{ active: quote.duration === d.key }"
                          @click="quote.duration = d.key"
                        >
                          <strong>{{ d.short }}</strong>
                          <small :class="{ 'qz-seg-off': d.discount }">{{ d.tag }}</small>
                        </button>
                      </div>
                      <p class="qz-duration-desc">
                        {{ selectedDuration.desc }}
                        <span v-if="totalSavings" class="qz-duration-save">
                          Ahorras {{ fmt(totalSavings) }} en {{ selectedDuration.months }} meses.
                        </span>
                      </p>
                      <transition name="qz-expand">
                        <div v-if="selectedDuration.months" class="qz-warning">
                          <v-icon size="18" color="#fbbf24">mdi-alert-outline</v-icon>
                          <p>
                            <strong>Importante:</strong> al firmar con permanencia de
                            {{ selectedDuration.months }} meses te comprometes a pagar el plazo completo.
                            De acuerdo con el artículo 1602 del Código Civil colombiano, todo contrato
                            legalmente celebrado es ley para las partes: si decides terminar el servicio
                            antes de tiempo, deberás pagar los meses restantes del contrato.
                          </p>
                        </div>
                      </transition>
                    </section>
                  </div>

                  <!-- Resumen -->
                  <aside ref="summaryEl" class="qz-summary">
                    <p class="qz-sum-label">Tu inversión mensual</p>
                    <div class="qz-sum-total gradient-text" :class="{ bump: totalBump }">{{ fmt(displayTotal) }}</div>
                    <p class="qz-sum-period">/ mes · IVA no incluido</p>

                    <transition name="qz-expand">
                      <div v-if="totalSavings" class="qz-save-badge">
                        <v-icon size="16">mdi-piggy-bank-outline</v-icon>
                        Ahorras {{ fmt(totalSavings) }} con {{ selectedDuration.label }}
                      </div>
                    </transition>

                    <ul class="qz-lines">
                      <li v-for="l in breakdown" :key="l.label">
                        <span>{{ l.label }}</span>
                        <span>{{ l.amount < 0 ? '−' : '' }}{{ fmt(Math.abs(l.amount)) }}</span>
                      </li>
                      <li v-if="discountAmount" class="qz-line-discount">
                        <span>Descuento {{ selectedDuration.label }}</span>
                        <span>−{{ fmt(discountAmount) }}</span>
                      </li>
                    </ul>

                    <v-btn class="cta-btn qz-cta" block size="x-large" :href="whatsappLink" target="_blank">
                      <v-icon start>mdi-whatsapp</v-icon>
                      Quiero este plan
                    </v-btn>
                    <p class="qz-sum-hint">Te llega a WhatsApp con todo lo que elegiste.</p>

                    <div class="qz-excluded">
                      <p>No incluye</p>
                      <span v-for="ex in excluded" :key="ex">
                        <v-icon size="13" color="#f87171">mdi-close-circle</v-icon>
                        {{ ex }}
                      </span>
                    </div>
                  </aside>
                </div>
              </div>

              <!-- Barra fija del total (solo móvil) -->
              <transition name="qz-bar">
                <div v-if="showBar" class="qz-bar">
                  <button type="button" class="qz-bar-total" @click="scrollToSummary">
                    <small>Tu plan · ver detalle <v-icon size="12">mdi-chevron-down</v-icon></small>
                    <strong :class="{ bump: totalBump }">{{ fmt(displayTotal) }}</strong>
                    <span>/ mes + IVA</span>
                  </button>
                  <a class="qz-bar-cta" :href="whatsappLink" target="_blank" rel="noopener">
                    <v-icon size="18">mdi-whatsapp</v-icon>
                    Lo quiero
                  </a>
                </div>
              </transition>

            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ─── FOOTER MÍNIMO ─────────────────────────────────────── -->
      <footer class="ps-footer">
        <v-container>
          <div class="d-flex flex-wrap justify-space-between align-center" style="gap:16px">
            <img :src="logo" alt="Conectux" class="ps-footer-logo" />
            <p class="ps-footer-copy">© {{ new Date().getFullYear() }} Conectux LLC · Especialistas en Ventas para el Sector Salud</p>
          </div>
        </v-container>
      </footer>

    </div>
  </v-app>
</template>

<style scoped>
/* ─── Navbar ──────────────────────────────────────────────── */
.ps-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  background: rgba(9, 9, 15, 0.85);
  border-bottom: 1px solid rgba(161, 0, 255, 0.1);
  height: 72px;
  display: flex;
  align-items: center;
}
.ps-navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ps-logo {
  height: 32px;
  width: auto;
  filter: brightness(0) invert(1);
}

/* ─── Hero ────────────────────────────────────────────────── */
.ps-hero {
  position: relative;
  min-height: 100vh;
  background: #09090f;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}
.blob-1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(161, 0, 255, 0.22) 0%, transparent 65%);
  top: -200px; left: -200px;
  animation: blobFloat1 10s ease-in-out infinite;
}
.blob-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 65%);
  bottom: -150px; right: -100px;
  animation: blobFloat2 13s ease-in-out infinite;
}
.blob-3 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(161, 0, 255, 0.16) 0%, transparent 65%);
  top: 30%; right: 10%;
  animation: blobFloat3 9s ease-in-out infinite;
}
@keyframes blobFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(60px, 80px) scale(1.05); }
}
@keyframes blobFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-80px, -60px) scale(1.08); }
}
@keyframes blobFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, 40px) scale(0.95); }
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(161, 0, 255, 0.08) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
}
.ps-hero-container {
  position: relative;
  z-index: 1;
  padding-top: 140px;
  padding-bottom: 100px;
}
.ps-hero-title {
  font-size: clamp(2.6rem, 5.5vw, 4.8rem);
  font-weight: 900;
  line-height: 1.08;
  color: #fff;
  letter-spacing: -2px;
}
.ps-hero-sub {
  font-size: 1.15rem;
  color: rgba(160, 160, 184, 0.9);
  line-height: 1.8;
  max-width: 640px;
}
.ps-hero-sub strong {
  color: #fff;
  font-weight: 700;
}

/* Stats row */
.ps-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 580px;
  border-top: 1px solid rgba(161, 0, 255, 0.14);
  padding-top: 28px;
  gap: 0;
}
.ps-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  border-right: 1px solid rgba(161, 0, 255, 0.1);
}
.ps-stat:last-child { border-right: none; }
.ps-stat-num {
  font-size: 2.2rem;
  font-weight: 900;
  line-height: 1;
}
.ps-stat-label {
  font-size: 12px;
  color: rgba(160, 160, 184, 0.7);
  text-align: center;
  line-height: 1.4;
}

/* ─── Sections ────────────────────────────────────────────── */
.ps-section {
  position: relative;
  background: #09090f;
  padding: 100px 0;
  overflow: hidden;
}
.ps-section-alt {
  background: #0d0d1e;
}
.ps-blob-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(161, 0, 255, 0.05) 0%, transparent 65%);
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.ps-section-title {
  font-size: clamp(1.7rem, 3.8vw, 2.7rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.5px;
  margin-bottom: 14px;
}
.ps-section-sub {
  font-size: 1rem;
  color: rgba(160, 160, 184, 0.85);
  line-height: 1.8;
  max-width: 580px;
  margin: 0 auto;
}

/* ─── Cards ───────────────────────────────────────────────── */
.ps-challenge-icon {
  width: 60px; height: 60px;
  border-radius: 50%;
  border: 1px solid;
  display: flex; align-items: center; justify-content: center;
}
.ps-card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}
.ps-card-desc {
  font-size: 14.5px;
  color: rgba(160, 160, 184, 0.85);
  line-height: 1.75;
}

/* Result cards */
.ps-result-icon {
  width: 52px; height: 52px;
  border-radius: 14px;
  background: rgba(161, 0, 255, 0.1);
  border: 1px solid rgba(161, 0, 255, 0.22);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s ease;
}
.ps-result-card:hover .ps-result-icon {
  background: rgba(161, 0, 255, 0.2);
  transform: scale(1.08) rotate(3deg);
}

/* ─── Steps ───────────────────────────────────────────────── */
.ps-steps-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 820px;
  margin: 0 auto;
}
.ps-step-row {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 20px;
  align-items: flex-start;
}
.ps-step-num-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
}
.ps-step-num {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a100ff, #7b00cc);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 800; color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(161, 0, 255, 0.35);
}
.ps-step-line {
  width: 2px; flex: 1; min-height: 36px;
  background: linear-gradient(180deg, rgba(161, 0, 255, 0.4), rgba(161, 0, 255, 0.05));
  margin: 8px 0;
}
.ps-step-icon {
  width: 46px; height: 46px;
  border-radius: 13px;
  background: rgba(161, 0, 255, 0.1);
  border: 1px solid rgba(161, 0, 255, 0.22);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}
.ps-step-card:hover .ps-step-icon {
  background: rgba(161, 0, 255, 0.2);
  transform: scale(1.08);
}
.ps-step-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
}
.ps-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(200, 240, 200, 0.9);
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 100px;
  padding: 4px 11px;
}

/* ─── Video section ───────────────────────────────────────── */
.ps-videos-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}
.ps-video-wrap {
  position: relative;
  width: 320px;
  height: 460px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(161, 0, 255, 0.2);
  box-shadow: 0 8px 40px rgba(161, 0, 255, 0.12);
}
.ps-video-frame {
  position: absolute;
  top: -52px;
  left: 0;
  width: 320px;
  height: 580px;
  border: none;
}
.ps-video-mask-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 50px;
  background: #09090f;
  z-index: 5;
}
.ps-video-placeholder {
  width: 320px;
  height: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}
.ps-placeholder-text {
  font-size: 13px;
  color: rgba(160, 160, 184, 0.5);
  margin: 0;
}

/* ─── Why cards ───────────────────────────────────────────── */
.ps-why-item {
  height: 100%;
}
.ps-why-text {
  font-size: 14px;
  font-weight: 500;
  color: rgba(220, 220, 240, 0.9);
  line-height: 1.5;
  margin: 0;
}

/* ─── Footer ──────────────────────────────────────────────── */
.ps-footer {
  background: #060610;
  border-top: 1px solid rgba(161, 0, 255, 0.08);
  padding: 28px 0;
}
.ps-footer-logo {
  height: 26px;
  filter: brightness(0) invert(1);
  opacity: 0.5;
}
.ps-footer-copy {
  font-size: 13px;
  color: rgba(90, 90, 120, 0.9);
  margin: 0;
}

/* ─── Offer section ───────────────────────────────────────── */
.ps-offer-section {
  border-top: 1px solid rgba(161, 0, 255, 0.12);
}
.ps-offer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
@media (max-width: 600px) {
  .ps-offer-grid { grid-template-columns: 1fr; }
}
.ps-offer-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(161, 0, 255, 0.1);
  border-radius: 14px;
  padding: 16px 18px;
  transition: border-color 0.25s ease;
}
.ps-offer-item:hover {
  border-color: rgba(161, 0, 255, 0.28);
}
.ps-offer-check {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.ps-offer-item-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 3px;
}
.ps-offer-item-desc {
  font-size: 13px;
  color: rgba(160, 160, 184, 0.75);
  line-height: 1.5;
  margin: 0;
}

/* ─── Cotizador (mobile first) ───────────────────────────── */
.qz,
.qz-bar {
  --qz-purple: #a100ff;
  --qz-violet: #c84bff;
  --qz-cyan: #00d4ff;
  --qz-green: #4ade80;
  --qz-line: rgba(161, 0, 255, 0.16);
  --qz-surface: rgba(255, 255, 255, 0.03);
  --qz-muted: rgba(180, 180, 205, 0.72);
}
.qz {
  position: relative;
  overflow: hidden;
  padding: 28px 16px 20px;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(20, 12, 36, 0.92) 0%, rgba(12, 10, 22, 0.96) 100%);
  border: 1px solid var(--qz-line);
  box-shadow: 0 30px 80px -30px rgba(161, 0, 255, 0.35);
}
.qz-glow {
  position: absolute;
  top: -160px;
  left: 50%;
  width: 520px;
  height: 320px;
  transform: translateX(-50%);
  background: radial-gradient(ellipse, rgba(161, 0, 255, 0.22) 0%, transparent 70%);
  pointer-events: none;
}

/* Encabezado */
.qz-head { position: relative; text-align: center; margin-bottom: 24px; }
.qz-kicker {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 100px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--qz-violet);
  background: rgba(161, 0, 255, 0.12);
  border: 1px solid rgba(161, 0, 255, 0.28);
}
.qz-title {
  margin: 14px 0 6px;
  font-size: clamp(1.6rem, 6.5vw, 2.2rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.5px;
  color: #fff;
}
.qz-sub { margin: 0; font-size: 14.5px; color: var(--qz-muted); }

.qz-layout { position: relative; display: grid; gap: 18px; }
.qz-controls { display: grid; gap: 18px; min-width: 0; }

/* Bloques numerados */
.qz-block {
  padding: 18px 14px;
  border-radius: 22px;
  background: var(--qz-surface);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.qz-block-head { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 16px; }
.qz-block-head h4 { margin: 2px 0 2px; font-size: 16.5px; font-weight: 800; color: #fff; }
.qz-block-head p { margin: 0; font-size: 13px; line-height: 1.5; color: var(--qz-muted); }
.qz-step {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, var(--qz-purple), #6d28ff);
  box-shadow: 0 6px 18px -6px rgba(161, 0, 255, 0.7);
}

/* Tarjetas de contenido 2×2 */
.qz-tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.qz-tile {
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}
.qz-tile.is-extra {
  border-color: rgba(161, 0, 255, 0.55);
  background: rgba(161, 0, 255, 0.08);
  box-shadow: 0 10px 30px -14px rgba(161, 0, 255, 0.6);
}
.qz-tile-top { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 10px; }
.qz-tile-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  color: var(--qz-violet);
  background: rgba(161, 0, 255, 0.12);
}
.qz-chip {
  padding: 3px 8px;
  border-radius: 100px;
  font-size: 10.5px;
  font-weight: 700;
  white-space: nowrap;
  color: var(--qz-green);
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.22);
}
.qz-chip--extra { color: #fff; background: rgba(161, 0, 255, 0.35); border-color: rgba(200, 75, 255, 0.5); }
.qz-tile-label { margin: 0; font-size: 15px; font-weight: 800; color: #fff; }
.qz-tile-unit { margin: 1px 0 0; font-size: 12px; color: var(--qz-muted); }
.qz-tile-price { margin: 8px 0 0; font-size: 11px; text-align: center; color: rgba(160, 160, 190, 0.55); }

/* Stepper */
.qz-stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding: 4px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.qz-stepper button {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 11px;
  color: #fff;
  background: rgba(161, 0, 255, 0.22);
  cursor: pointer;
  touch-action: manipulation;
  transition: background 0.2s ease, transform 0.12s ease, opacity 0.2s ease;
}
.qz-stepper button:last-child { background: linear-gradient(135deg, var(--qz-purple), #7b2fff); }
.qz-stepper button:active:not(:disabled) { transform: scale(0.9); }
.qz-stepper button:disabled { opacity: 0.25; cursor: not-allowed; }
.qz-num {
  min-width: 34px;
  text-align: center;
  font-size: 24px;
  font-weight: 900;
  color: #fff;
  font-variant-numeric: tabular-nums;
}
.qz-stepper--inline { margin-top: 0; flex-shrink: 0; gap: 4px; }

/* Opciones con interruptor */
.qz-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px;
  margin-bottom: 10px;
  border-radius: 18px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition: border-color 0.25s ease, background 0.25s ease;
  -webkit-tap-highlight-color: transparent;
}
.qz-option.on { border-color: rgba(161, 0, 255, 0.55); background: rgba(161, 0, 255, 0.08); }
.qz-option-icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 13px;
  color: var(--qz-violet);
  background: rgba(161, 0, 255, 0.12);
  transition: all 0.25s ease;
}
.qz-option.on .qz-option-icon { color: #fff; background: linear-gradient(135deg, var(--qz-purple), #7b2fff); }
.qz-option-icon--tiktok { color: var(--qz-cyan); background: rgba(0, 212, 255, 0.1); }
.qz-option-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.qz-option-text strong { font-size: 14.5px; font-weight: 700; color: #fff; line-height: 1.3; }
.qz-option-text small { font-size: 12.5px; color: var(--qz-muted); margin-top: 2px; }
.qz-option-text em { font-style: normal; font-size: 12.5px; font-weight: 700; color: var(--qz-violet); margin-top: 4px; }
.qz-option-text em.qz-included { color: var(--qz-green); }

.qz-switch {
  appearance: none;
  flex-shrink: 0;
  position: relative;
  width: 48px;
  height: 28px;
  margin: 0;
  border-radius: 100px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.14);
  transition: background 0.25s ease;
}
.qz-switch::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.qz-switch:checked { background: linear-gradient(135deg, var(--qz-purple), #7b2fff); }
.qz-switch:checked::after { transform: translateX(20px); }

.qz-trm {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0 0;
  font-size: 12px;
  color: rgba(0, 212, 255, 0.8);
}

/* Redes */
.qz-networks { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.qz-network {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.qz-sub-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.22);
}

/* Permanencia: control segmentado */
.qz-seg {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 4px;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.07);
}
.qz-seg-pill {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc((100% - 8px) / 3);
  border-radius: 14px;
  background: linear-gradient(135deg, var(--qz-purple), #7b2fff);
  box-shadow: 0 8px 22px -8px rgba(161, 0, 255, 0.8);
  transform: translateX(calc(var(--i) * 100%));
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.qz-seg button {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-height: 56px;
  padding: 8px 4px;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  touch-action: manipulation;
  transition: color 0.25s ease;
}
.qz-seg button strong { font-size: 14px; font-weight: 800; }
.qz-seg button small { font-size: 11px; font-weight: 600; color: var(--qz-muted); }
.qz-seg button small.qz-seg-off { color: var(--qz-green); font-weight: 800; }
.qz-seg button.active { color: #fff; }
.qz-seg button.active small { color: rgba(255, 255, 255, 0.85); }
.qz-duration-desc { margin: 12px 2px 0; font-size: 13px; line-height: 1.6; color: rgba(220, 220, 235, 0.85); }
.qz-duration-save { display: block; margin-top: 2px; font-weight: 800; color: var(--qz-green); }
.qz-warning {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-top: 12px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(251, 191, 36, 0.07);
  border: 1px solid rgba(251, 191, 36, 0.3);
}
.qz-warning .v-icon { flex-shrink: 0; margin-top: 1px; }
.qz-warning p { margin: 0; font-size: 12.5px; line-height: 1.6; color: rgba(253, 230, 170, 0.9); }
.qz-warning strong { color: #fbbf24; }

/* Resumen */
.qz-summary {
  position: relative;
  padding: 26px 18px 20px;
  border-radius: 24px;
  text-align: center;
  background:
    radial-gradient(ellipse at top, rgba(161, 0, 255, 0.25) 0%, transparent 65%),
    rgba(161, 0, 255, 0.06);
  border: 1px solid rgba(161, 0, 255, 0.35);
}
.qz-sum-label {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--qz-muted);
}
.qz-sum-total {
  font-size: clamp(2.6rem, 12vw, 3.4rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -1.5px;
  font-variant-numeric: tabular-nums;
}
.qz-sum-period { margin: 6px 0 0; font-size: 13.5px; color: var(--qz-muted); }
.qz-save-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--qz-green);
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.28);
}
.qz-lines {
  list-style: none;
  margin: 18px 0 0;
  padding: 14px 0 0;
  border-top: 1px dashed rgba(161, 0, 255, 0.3);
}
.qz-lines li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 5px 0;
  font-size: 13.5px;
  text-align: left;
  color: rgba(215, 215, 230, 0.85);
}
.qz-lines li span:last-child { white-space: nowrap; font-weight: 700; color: #fff; font-variant-numeric: tabular-nums; }
.qz-lines li.qz-line-discount,
.qz-lines li.qz-line-discount span:last-child { color: var(--qz-green); }
.qz-cta { margin-top: 18px; height: 58px !important; font-size: 16px !important; }
.qz-sum-hint { margin: 10px 0 0; font-size: 12px; color: var(--qz-muted); }
.qz-excluded {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.qz-excluded p {
  width: 100%;
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(160, 160, 184, 0.55);
}
.qz-excluded span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 12px;
  color: rgba(248, 113, 113, 0.9);
  background: rgba(248, 113, 113, 0.07);
  border: 1px solid rgba(248, 113, 113, 0.18);
}

/* Rebote del total */
.bump { animation: qzBump 0.35s ease; }
@keyframes qzBump {
  0% { transform: scale(1); }
  40% { transform: scale(1.06); }
  100% { transform: scale(1); }
}

/* Barra fija (móvil) */
.qz-bar {
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 10px 10px 18px;
  border-radius: 22px;
  background: rgba(18, 12, 32, 0.88);
  border: 1px solid rgba(161, 0, 255, 0.45);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 18px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
}
.qz-bar-total {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.qz-bar-total small { font-size: 11px; color: var(--qz-muted); display: inline-flex; align-items: center; gap: 2px; }
.qz-bar-total strong {
  display: inline-block;
  font-size: 22px;
  font-weight: 900;
  line-height: 1.15;
  color: #fff;
  font-variant-numeric: tabular-nums;
}
.qz-bar-total span { font-size: 11px; color: var(--qz-muted); }
.qz-bar-cta {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 50px;
  padding: 0 18px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(135deg, var(--qz-purple), #7b2fff);
  box-shadow: 0 10px 24px -8px rgba(161, 0, 255, 0.8);
}
.qz-bar-enter-active,
.qz-bar-leave-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease; }
.qz-bar-enter-from,
.qz-bar-leave-to { transform: translateY(120%); opacity: 0; }

.qz-expand-enter-active,
.qz-expand-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.qz-expand-enter-from,
.qz-expand-leave-to { opacity: 0; transform: translateY(-6px); }

/* Foco visible */
.qz-stepper button:focus-visible,
.qz-switch:focus-visible,
.qz-seg button:focus-visible,
.qz-bar-total:focus-visible,
.qz-bar-cta:focus-visible { outline: 2px solid var(--qz-violet); outline-offset: 2px; }

/* Pantallas muy pequeñas */
@media (max-width: 360px) {
  .qz { padding: 24px 12px 16px; }
  .qz-block { padding: 16px 10px; }
  .qz-tiles { gap: 8px; }
  .qz-tile { padding: 10px; }
  .qz-stepper button { width: 36px; height: 36px; }
  .qz-num { font-size: 21px; }
}

/* Tablet y escritorio */
@media (min-width: 600px) {
  .qz { padding: 40px 28px 28px; }
  .qz-block { padding: 22px 20px; }
  .qz-tiles { gap: 12px; }
  .qz-tile { padding: 16px; }
}
@media (min-width: 960px) {
  .qz-layout { grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 22px; align-items: start; }
  .qz-summary { position: sticky; top: 92px; }
  .qz-sum-total { font-size: clamp(2.1rem, 3vw, 2.7rem); letter-spacing: -1px; }
  .qz-bar { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .qz *,
  .qz-bar { transition: none !important; animation: none !important; }
}

/* ─── Vuetify overrides ───────────────────────────────────── */
:deep(.v-main),
:deep(.v-main__wrap) {
  background-color: #09090f !important;
}
:deep(.v-btn) {
  text-transform: none !important;
}

@media (max-width: 600px) {
  .ps-step-row { grid-template-columns: 52px 1fr; gap: 12px; }
  .ps-step-num { width: 38px; height: 38px; font-size: 13px; }
  .ps-stats { grid-template-columns: repeat(3, 1fr); }
}
</style>
