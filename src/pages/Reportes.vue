<script setup>
import { ref, computed, onMounted } from 'vue'
import logo from '../assets/logo-conectux.png'

// ── Slug helper (debe coincidir con el usado en tools/reportes/publicar.mjs) ──
const slugify = (s) => s
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')

// ── Clientes activos ───────────────────────────────────────────────────
// Lista editable: nombre + categoría + icono. No contiene IDs de cuenta
// publicitaria ni datos sensibles — eso vive solo en tools/reportes/.
const clientesRaw = [
  { nombre: 'Hotel Alcaraván', categoria: 'Hotelería', icon: 'mdi-bed-outline' },
  { nombre: 'Hotel Central Plaza', categoria: 'Hotelería', icon: 'mdi-bed-outline' },
  { nombre: 'Sixtina Plaza Hotel', categoria: 'Hotelería', icon: 'mdi-bed-outline' },
  { nombre: 'Hotel Bolivariana Plaza', categoria: 'Hotelería', icon: 'mdi-bed-outline' },
  { nombre: 'Aceros Monsalve', categoria: 'Industrial', icon: 'mdi-factory' },
  { nombre: 'Carrocerías Platinum', categoria: 'Industrial', icon: 'mdi-factory' },
  { nombre: 'Fluxatec Ingeniería', categoria: 'Industrial', icon: 'mdi-factory' },
  { nombre: 'Gerpar SA', categoria: 'Industrial', icon: 'mdi-factory' },
  { nombre: 'Healthy Pets', categoria: 'Mascotas', icon: 'mdi-paw' },
  { nombre: 'Gatología', categoria: 'Mascotas', icon: 'mdi-paw' },
  { nombre: 'Nico Mascotas', categoria: 'Mascotas', icon: 'mdi-paw' },
  { nombre: 'Dr. Wilmar Escobar', categoria: 'Salud', icon: 'mdi-medical-bag' },
  { nombre: 'Deivin Slim Fit', categoria: 'Salud y bienestar', icon: 'mdi-dumbbell' },
  { nombre: 'Maricela', categoria: 'Belleza', icon: 'mdi-flower-outline' },
  { nombre: 'Modam Tienda', categoria: 'Retail / Moda', icon: 'mdi-hanger' },
  { nombre: 'Mariapez.co', categoria: 'Retail', icon: 'mdi-store-outline' },
  { nombre: 'Colmieles', categoria: 'Alimentos', icon: 'mdi-food-apple-outline' },
  { nombre: 'Aguas San Vicente', categoria: 'Alimentos', icon: 'mdi-cup-water' },
  { nombre: 'AMPM Eventos', categoria: 'Eventos', icon: 'mdi-party-popper' },
  { nombre: 'Jader The Teacher', categoria: 'Educación', icon: 'mdi-school-outline' },
  { nombre: 'Hey Escuchalo', categoria: 'Medios', icon: 'mdi-podcast' },
  { nombre: 'NextHire', categoria: 'Reclutamiento', icon: 'mdi-account-tie-outline' },
]

const clientes = clientesRaw.map((c) => ({ ...c, slug: slugify(c.nombre) }))

// ── Manifest de reportes publicados + solicitudes pendientes ───────────
const reportesPorSlug = ref({})
const solicitudesPorSlug = ref({})
const cargando = ref(true)
const errorCarga = ref(false)

const cargarEstado = async () => {
  try {
    const [resManifest, resSolicitudes] = await Promise.all([
      fetch('/api/reportes-manifest', { cache: 'no-store' }),
      fetch('/api/reportes-solicitudes', { cache: 'no-store' }),
    ])
    if (!resManifest.ok) throw new Error('No se pudo leer el manifest')

    const items = await resManifest.json()
    const map = {}
    for (const item of items) {
      if (!map[item.slug] || item.publicado_en > map[item.slug].publicado_en) {
        map[item.slug] = item
      }
    }
    reportesPorSlug.value = map

    if (resSolicitudes.ok) {
      const solicitudes = await resSolicitudes.json()
      const mapS = {}
      for (const s of solicitudes) {
        if (s.estado === 'pendiente') mapS[s.slug] = s
      }
      solicitudesPorSlug.value = mapS
    }
    errorCarga.value = false
  } catch (e) {
    errorCarga.value = true
  } finally {
    cargando.value = false
  }
}

onMounted(cargarEstado)

const clientesConEstado = computed(() =>
  clientes.map((c) => ({
    ...c,
    reporte: reportesPorSlug.value[c.slug] || null,
    solicitud: solicitudesPorSlug.value[c.slug] || null,
  }))
)

// ── Diálogo "Generar reporte" ───────────────────────────────────────────
const dialogAbierto = ref(false)
const clienteActivo = ref(null)
const desde = ref('')
const hasta = ref('')
const enviando = ref(false)
const errorEnvio = ref('')

const abrirDialogo = (cliente) => {
  clienteActivo.value = cliente
  const hoy = new Date()
  const primerDiaMesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)
  const ultimoDiaMesPasado = new Date(hoy.getFullYear(), hoy.getMonth(), 0)
  desde.value = primerDiaMesPasado.toISOString().slice(0, 10)
  hasta.value = ultimoDiaMesPasado.toISOString().slice(0, 10)
  errorEnvio.value = ''
  dialogAbierto.value = true
}

const confirmarSolicitud = async () => {
  if (!clienteActivo.value || !desde.value || !hasta.value) return
  if (desde.value > hasta.value) {
    errorEnvio.value = 'La fecha "desde" no puede ser posterior a "hasta".'
    return
  }
  enviando.value = true
  errorEnvio.value = ''
  try {
    const res = await fetch('/api/reportes-solicitar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente: clienteActivo.value.nombre,
        slug: clienteActivo.value.slug,
        desde: desde.value,
        hasta: hasta.value,
      }),
    })
    if (!res.ok) throw new Error('No se pudo enviar la solicitud')
    dialogAbierto.value = false
    await cargarEstado()
  } catch (e) {
    errorEnvio.value = 'No se pudo enviar la solicitud. Intenta de nuevo.'
  } finally {
    enviando.value = false
  }
}

const formatoFecha = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
</script>

<template>
  <div class="reportes-page">
    <div class="rp-glow rp-glow-1"></div>
    <div class="rp-glow rp-glow-2"></div>

    <header class="rp-header">
      <img :src="logo" alt="Conectux" class="rp-logo" />
      <div class="rp-header-text">
        <h1>Reportes de gestión</h1>
        <p>Pide el reporte del período que quieras — se genera y publica cuando lo procesemos, no están pregenerados.</p>
      </div>
    </header>

    <div v-if="errorCarga" class="rp-notice">
      No se pudo cargar el estado de los reportes en este momento. Vuelve a intentarlo más tarde.
    </div>

    <section class="rp-grid">
      <article v-for="c in clientesConEstado" :key="c.slug" class="rp-card glass-card">
        <div class="rp-card-icon"><v-icon :icon="c.icon" size="26" /></div>
        <div class="rp-card-category">{{ c.categoria }}</div>
        <h3 class="rp-card-title">{{ c.nombre }}</h3>

        <div v-if="c.reporte" class="rp-card-period">
          Último: {{ c.reporte.periodo }}
        </div>
        <div v-else-if="!c.solicitud" class="rp-card-period rp-card-period--muted">
          {{ cargando ? 'Cargando…' : 'Sin reporte aún' }}
        </div>

        <div v-if="c.solicitud" class="rp-card-btn rp-card-btn--pending">
          <v-icon icon="mdi-clock-outline" size="16" class="mr-1" />
          Solicitado ({{ formatoFecha(c.solicitud.desde) }} – {{ formatoFecha(c.solicitud.hasta) }})
        </div>
        <template v-else>
          <a
            v-if="c.reporte"
            :href="`/api/reportes-descargar?pathname=${encodeURIComponent(c.reporte.pathname)}`"
            target="_blank" rel="noopener" class="rp-card-btn rp-card-btn--ready"
          >
            <v-icon icon="mdi-download" size="18" class="mr-1" /> Descargar PDF
          </a>
          <button class="rp-card-btn rp-card-btn--generar" @click="abrirDialogo(c)">
            <v-icon icon="mdi-refresh" size="16" class="mr-1" v-if="c.reporte" />
            <v-icon icon="mdi-plus" size="16" class="mr-1" v-else />
            {{ c.reporte ? 'Generar otro período' : 'Generar reporte' }}
          </button>
        </template>
      </article>
    </section>

    <v-dialog v-model="dialogAbierto" max-width="420">
      <v-card class="rp-dialog">
        <v-card-title class="rp-dialog-title">Generar reporte</v-card-title>
        <v-card-subtitle>{{ clienteActivo?.nombre }}</v-card-subtitle>
        <v-card-text>
          <p class="rp-dialog-text">Elige el rango de fechas que quieres que cubra el reporte.</p>
          <div class="rp-dialog-dates">
            <label>
              Desde
              <input type="date" v-model="desde" :max="hasta || undefined" />
            </label>
            <label>
              Hasta
              <input type="date" v-model="hasta" :min="desde || undefined" />
            </label>
          </div>
          <p v-if="errorEnvio" class="rp-dialog-error">{{ errorEnvio }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="rp-dialog-cancel" @click="dialogAbierto = false" :disabled="enviando">Cancelar</button>
          <button class="rp-card-btn rp-card-btn--ready" @click="confirmarSolicitud" :disabled="enviando">
            {{ enviando ? 'Enviando…' : 'Solicitar' }}
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.reportes-page {
  min-height: 100vh;
  background: var(--dark-bg);
  padding: 56px 24px 80px;
  position: relative;
  overflow: hidden;
}

.rp-glow {
  position: absolute;
  width: 600px; height: 600px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
.rp-glow-1 { top: -200px; left: -150px; background: radial-gradient(circle, rgba(161, 0, 255, 0.18) 0%, transparent 65%); }
.rp-glow-2 { bottom: -250px; right: -150px; background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 65%); }

.rp-header {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto 48px;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.rp-logo { width: 150px; }
.rp-header-text h1 { font-size: 28px; margin: 0 0 4px; font-weight: 800; }
.rp-header-text p { margin: 0; color: var(--text-secondary); font-size: 14px; max-width: 520px; }

.rp-notice {
  position: relative; z-index: 1;
  max-width: 1100px; margin: 0 auto 24px;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: #fca5a5;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
}

.rp-grid {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 18px;
}

.rp-card {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rp-card-icon {
  width: 46px; height: 46px;
  border-radius: 12px;
  background: rgba(161, 0, 255, 0.12);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary-light);
  margin-bottom: 6px;
}
.rp-card-category {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text-muted);
}
.rp-card-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px;
  color: var(--text-primary);
}
.rp-card-period {
  font-size: 12px;
  color: var(--text-secondary);
}
.rp-card-period--muted { color: var(--text-muted); font-style: italic; }

.rp-card-btn {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s ease;
}
.rp-card-btn--ready {
  background: var(--gradient);
  color: #fff;
}
.rp-card-btn--ready:hover { filter: brightness(1.1); }
.rp-card-btn--ready:disabled { opacity: 0.6; cursor: default; }
.rp-card-btn--pending {
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed var(--border);
  color: var(--text-muted);
  cursor: default;
  font-size: 11.5px;
  text-align: center;
}
.rp-card-btn--generar {
  background: rgba(161, 0, 255, 0.12);
  border: 1px solid var(--border);
  color: var(--primary-light);
  margin-top: 4px;
}
.rp-card-btn--generar:hover { background: rgba(161, 0, 255, 0.2); }

.rp-dialog { background: var(--dark-card) !important; }
.rp-dialog-title { color: #fff; }
.rp-dialog-text { color: var(--text-secondary); font-size: 13px; margin-bottom: 12px; }
.rp-dialog-dates { display: flex; gap: 12px; }
.rp-dialog-dates label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}
.rp-dialog-dates input[type="date"] {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
  color: #fff;
  color-scheme: dark;
  font-family: inherit;
}
.rp-dialog-error { color: #fca5a5; font-size: 12px; margin-top: 10px; }
.rp-dialog-cancel {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 10px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
}

@media (max-width: 480px) {
  .rp-grid { grid-template-columns: 1fr 1fr; }
  .rp-header { gap: 14px; }
  .rp-logo { width: 120px; }
}
</style>
