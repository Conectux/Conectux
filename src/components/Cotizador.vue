<script setup>
// Cotizador de marketing para salud. Se usa en /presentacion-salud y /cotizador.
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  // Muestra la barra "Arma tu plan / Cotizar mi proyecto" cuando el cotizador no está en pantalla
  promoBar: { type: Boolean, default: false },
})

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
// 'price' dentro del cotizador (solo móvil), 'go' en el resto de la página
const barMode = computed(() => {
  if (summaryVisible.value) return null
  if (quoterVisible.value) return 'price'
  return props.promoBar ? 'go' : null
})
const isCustomized = computed(() => total.value !== PRICING.base)
const goToQuoter = () =>
  document.getElementById('cotizador')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
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
</script>

<template>
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

<!-- Barra fija: "Cotizar mi proyecto" en toda la página; precio + WhatsApp dentro del cotizador -->
<transition name="qz-bar" mode="out-in">
  <div v-if="barMode === 'price'" key="price" class="qz-bar qz-bar--price">
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
  <div v-else-if="barMode === 'go'" key="go" class="qz-bar qz-bar--go">
    <button type="button" class="qz-bar-total" @click="goToQuoter">
      <strong class="qz-bar-title">Arma tu plan</strong>
    </button>
    <button type="button" class="qz-bar-cta" @click="goToQuoter">
      <v-icon size="18">mdi-calculator-variant-outline</v-icon>
      {{ isCustomized ? 'Ver mi cotización' : 'Cotizar mi proyecto' }}
    </button>
  </div>
</transition>
</template>

<style scoped>
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
  scroll-margin-top: 84px;
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
.qz-bar-total .qz-bar-title { font-size: 18px; }
.qz-bar-total .qz-bar-title + span { font-size: 12px; margin-top: 2px; }
.qz-bar-cta {
  flex-shrink: 0;
  border: 0;
  cursor: pointer;
  font-family: inherit;
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
  .qz-bar--price { display: none; }
  .qz-bar { left: 0; right: 0; max-width: 560px; margin: 0 auto; bottom: 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .qz *,
  .qz-bar { transition: none !important; animation: none !important; }
}
</style>
