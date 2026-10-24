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

// ── Manifest de reportes publicados (vía función serverless, Blob privado) ──
const reportesPorSlug = ref({})
const cargando = ref(true)
const errorCarga = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('/api/reportes-manifest', { cache: 'no-store' })
    if (!res.ok) throw new Error('No se pudo leer el manifest')
    const items = await res.json()
    const map = {}
    for (const item of items) {
      // Se queda el más reciente por cliente (el manifest viene ordenado por fecha de publicación)
      if (!map[item.slug] || item.publicado_en > map[item.slug].publicado_en) {
        map[item.slug] = item
      }
    }
    reportesPorSlug.value = map
  } catch (e) {
    errorCarga.value = true
  } finally {
    cargando.value = false
  }
})

const clientesConReporte = computed(() =>
  clientes.map((c) => ({ ...c, reporte: reportesPorSlug.value[c.slug] || null }))
)
</script>

<template>
  <div class="reportes-page">
    <div class="rp-glow rp-glow-1"></div>
    <div class="rp-glow rp-glow-2"></div>

    <header class="rp-header">
      <img :src="logo" alt="Conectux" class="rp-logo" />
      <div class="rp-header-text">
        <h1>Reportes de gestión</h1>
        <p>Descarga el reporte mensual más reciente de cada cliente.</p>
      </div>
    </header>

    <div v-if="errorCarga" class="rp-notice">
      No se pudieron cargar los reportes publicados en este momento. Vuelve a intentarlo más tarde.
    </div>

    <section class="rp-grid">
      <article v-for="c in clientesConReporte" :key="c.slug" class="rp-card glass-card">
        <div class="rp-card-icon"><v-icon :icon="c.icon" size="26" /></div>
        <div class="rp-card-category">{{ c.categoria }}</div>
        <h3 class="rp-card-title">{{ c.nombre }}</h3>

        <template v-if="c.reporte">
          <div class="rp-card-period">{{ c.reporte.periodo }}</div>
          <a
            :href="`/api/reportes-descargar?pathname=${encodeURIComponent(c.reporte.pathname)}`"
            target="_blank" rel="noopener" class="rp-card-btn rp-card-btn--ready"
          >
            <v-icon icon="mdi-download" size="18" class="mr-1" /> Descargar PDF
          </a>
        </template>
        <template v-else>
          <div class="rp-card-period rp-card-period--muted">{{ cargando ? 'Cargando…' : 'Sin reporte aún' }}</div>
          <div class="rp-card-btn rp-card-btn--pending">Próximamente</div>
        </template>
      </article>
    </section>
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
.rp-header-text p { margin: 0; color: var(--text-secondary); font-size: 14px; }

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
}
.rp-card-icon {
  width: 46px; height: 46px;
  border-radius: 12px;
  background: rgba(161, 0, 255, 0.12);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary-light);
  margin-bottom: 14px;
}
.rp-card-category {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.rp-card-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 14px;
  color: var(--text-primary);
}
.rp-card-period {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 12px;
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
  transition: all 0.25s ease;
}
.rp-card-btn--ready {
  background: var(--gradient);
  color: #fff;
}
.rp-card-btn--ready:hover { filter: brightness(1.1); }
.rp-card-btn--pending {
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed var(--border);
  color: var(--text-muted);
  cursor: default;
}

@media (max-width: 480px) {
  .rp-grid { grid-template-columns: 1fr 1fr; }
  .rp-header { gap: 14px; }
  .rp-logo { width: 120px; }
}
</style>
