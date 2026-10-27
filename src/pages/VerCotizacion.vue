<script setup>
import { ref, onMounted } from 'vue'
import logo from '../assets/logo-conectux.png'

const slug = new URLSearchParams(location.search).get('slug') || ''

const cargando = ref(true)
const error = ref('')
const cot = ref(null)

onMounted(async () => {
  if (!slug) {
    error.value = 'Este link no es válido — falta la cotización.'
    cargando.value = false
    return
  }
  try {
    const res = await fetch(`/api/cotizaciones?slug=${encodeURIComponent(slug)}`)
    if (!res.ok) {
      error.value = 'No se encontró esta cotización.'
      return
    }
    cot.value = await res.json()
  } catch {
    error.value = 'No se pudo cargar la cotización. Intenta de nuevo.'
  } finally {
    cargando.value = false
  }
})
</script>

<template>
  <div class="vc-page">
    <div v-if="cargando" class="vc-estado">Cargando cotización…</div>
    <div v-else-if="error" class="vc-estado vc-estado--error">{{ error }}</div>

    <template v-else>
      <div class="vc-glow vc-glow-1"></div>
      <div class="vc-glow vc-glow-2"></div>

      <nav class="vc-nav">
        <img :src="logo" alt="Conectux" class="vc-nav-logo" />
        <a :href="`/api/cotizaciones?accion=pdf&slug=${slug}`" target="_blank" rel="noopener" class="vc-nav-btn">
          <v-icon icon="mdi-download" size="16" class="mr-1" /> Descargar PDF
        </a>
      </nav>

      <!-- HERO -->
      <header class="vc-hero">
        <div class="vc-badge" v-if="cot.periodo">Propuesta Comercial · {{ cot.periodo }}</div>
        <h1 class="vc-hero-title"><span class="gradient-text">{{ cot.heroTitulo || cot.cliente }}</span></h1>
        <p v-if="cot.heroSubtitulo" class="vc-hero-sub">{{ cot.heroSubtitulo }}</p>
      </header>

      <!-- PILARES -->
      <section v-if="cot.pilares?.length" class="vc-section">
        <div class="vc-section-header">
          <h2>{{ cot.pilaresTitulo }}</h2>
          <p v-if="cot.pilaresSubtitulo">{{ cot.pilaresSubtitulo }}</p>
        </div>
        <div class="vc-pilares-grid">
          <div v-for="p in cot.pilares" :key="p.numero" class="vc-pilar glass-card">
            <div class="vc-pilar-num">{{ p.numero }}</div>
            <h3>{{ p.titulo }}</h3>
            <p>{{ p.descripcion }}</p>
          </div>
        </div>
      </section>

      <!-- PLANES -->
      <section v-if="cot.planes?.length" class="vc-section vc-section--alt">
        <div class="vc-section-header">
          <h2>{{ cot.planesTitulo }}</h2>
          <p v-if="cot.planesSubtitulo">{{ cot.planesSubtitulo }}</p>
          <span v-if="cot.planesBadge" class="vc-badge-especial">{{ cot.planesBadge }}</span>
        </div>
        <div class="vc-planes-grid" :class="`vc-planes-grid--${Math.min(cot.planes.length, 3)}`">
          <div v-for="plan in cot.planes" :key="plan.nombre" class="vc-plan glass-card" :class="{ 'vc-plan--cyan': plan.acento === 'cyan' }">
            <div class="vc-plan-avatar">{{ plan.avatar }}</div>
            <h3>{{ plan.nombre }}</h3>
            <p class="vc-plan-tipo">{{ plan.tipo }}</p>
            <ul class="vc-plan-items">
              <li v-for="(item, i) in plan.items" :key="i"><v-icon icon="mdi-check" size="14" /> {{ item }}</li>
            </ul>
            <div class="vc-plan-precio">
              <div v-if="plan.precioAntes" class="vc-precio-antes">{{ plan.precioAntes }}</div>
              <div class="vc-precio-label">{{ plan.precioLabel }}</div>
              <div class="vc-precio-monto">{{ plan.precioMostrado }}</div>
              <div class="vc-precio-periodo">{{ plan.periodo }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- RESUMEN -->
      <section v-if="cot.resumenFilas?.length" class="vc-section">
        <div class="vc-section-header"><h2>Resumen económico</h2></div>
        <div class="vc-resumen glass-card">
          <table class="vc-tabla">
            <thead>
              <tr><th>Servicio</th><th>Antes</th><th>Precio</th></tr>
            </thead>
            <tbody>
              <tr v-for="(f, i) in cot.resumenFilas" :key="i">
                <td class="vc-td-nombre">{{ f.servicio }}</td>
                <td class="vc-td-antes">{{ f.antes }}</td>
                <td class="vc-td-precio">{{ f.precio }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="cot.resumenTotal" class="vc-total">
            <span class="vc-total-label">Total</span>
            <div>
              <span v-if="cot.resumenTotal.antes" class="vc-total-antes">{{ cot.resumenTotal.antes }}</span>
              <span class="vc-total-monto">{{ cot.resumenTotal.monto }}</span>
              <span class="vc-total-periodo">{{ cot.resumenTotal.periodo }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- CIERRE -->
      <section v-if="cot.cierreTitulo || cot.cierreTexto" class="vc-section">
        <div class="vc-cierre glass-card">
          <h2>{{ cot.cierreTitulo }}</h2>
          <p>{{ cot.cierreTexto }}</p>
        </div>
      </section>

      <!-- EXCLUSIONES -->
      <section v-if="cot.exclusiones?.length" class="vc-section vc-section--sin-top">
        <div class="vc-nota">
          <v-icon icon="mdi-alert-outline" size="20" color="#e8d870" />
          <div>
            <div class="vc-nota-titulo">Esta cotización no incluye</div>
            <ul>
              <li v-for="(ex, i) in cot.exclusiones" :key="i">{{ ex }}</li>
            </ul>
          </div>
        </div>
      </section>

      <footer class="vc-footer">
        <img :src="logo" alt="Conectux" class="vc-footer-logo" />
        <p>Propuesta confidencial · {{ cot.cliente }} · conectux.com</p>
      </footer>
    </template>
  </div>
</template>

<style scoped>
.vc-page { min-height: 100vh; background: var(--dark-bg); position: relative; overflow: hidden; }
.vc-estado { color: var(--text-secondary); font-size: 14px; text-align: center; padding: 120px 20px; }
.vc-estado--error { color: #fca5a5; }

.vc-glow { position: absolute; width: 650px; height: 650px; border-radius: 50%; pointer-events: none; z-index: 0; }
.vc-glow-1 { top: -220px; left: -180px; background: radial-gradient(circle, rgba(161, 0, 255, 0.18) 0%, transparent 65%); }
.vc-glow-2 { top: 400px; right: -200px; background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 65%); }

.vc-nav {
  position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between;
  padding: 20px 32px; max-width: 1100px; margin: 0 auto;
}
.vc-nav-logo { width: 130px; }
.vc-nav-btn {
  display: inline-flex; align-items: center; background: var(--gradient); color: #fff; text-decoration: none;
  border-radius: 100px; padding: 10px 20px; font-size: 13px; font-weight: 700; box-shadow: 0 4px 18px rgba(161,0,255,0.4);
}

.vc-hero { position: relative; z-index: 1; max-width: 760px; margin: 60px auto 20px; text-align: center; padding: 0 24px; }
.vc-badge {
  display: inline-flex; background: rgba(161,0,255,0.1); border: 1px solid rgba(161,0,255,0.25); border-radius: 100px;
  padding: 6px 16px; font-size: 12px; font-weight: 700; color: var(--primary-light); letter-spacing: 0.06em;
  text-transform: uppercase; margin-bottom: 24px;
}
.vc-hero-title { font-size: clamp(1.9rem, 4.5vw, 3rem); font-weight: 900; line-height: 1.15; letter-spacing: -1px; margin-bottom: 18px; }
.vc-hero-sub { font-size: 1rem; color: var(--text-secondary); line-height: 1.7; }

.vc-section { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 56px 24px; }
.vc-section--alt { background: rgba(255,255,255,0.015); }
.vc-section--sin-top { padding-top: 0; }
.vc-section-header { margin-bottom: 36px; text-align: center; }
.vc-section-header h2 { font-size: clamp(1.4rem, 2.8vw, 1.9rem); font-weight: 900; margin-bottom: 10px; letter-spacing: -0.5px; }
.vc-section-header p { font-size: 14px; color: var(--text-secondary); max-width: 560px; margin: 0 auto; line-height: 1.7; }
.vc-badge-especial {
  display: inline-flex; margin-top: 14px; background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.3);
  border-radius: 100px; padding: 5px 14px; font-size: 11px; font-weight: 700; color: #4ade80; letter-spacing: 0.04em; text-transform: uppercase;
}

.vc-pilares-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; }
.vc-pilar { padding: 26px 24px; }
.vc-pilar-num {
  width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 900; background: rgba(161,0,255,0.12); border: 1px solid var(--border); color: var(--primary-light);
  margin-bottom: 14px;
}
.vc-pilar h3 { font-size: 1rem; font-weight: 800; margin-bottom: 8px; }
.vc-pilar p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }

.vc-planes-grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
.vc-planes-grid--1 { max-width: 420px; margin: 0 auto; }
.vc-planes-grid--2 { max-width: 760px; margin: 0 auto; grid-template-columns: repeat(2, 1fr); }
@media (max-width: 760px) { .vc-planes-grid--2 { grid-template-columns: 1fr; } }

.vc-plan { padding: 28px 24px; display: flex; flex-direction: column; }
.vc-plan--cyan { border-color: rgba(0, 212, 255, 0.3); }
.vc-plan-avatar {
  width: 44px; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 900; background: rgba(161,0,255,0.12); border: 1px solid var(--border); color: var(--primary-light);
  margin-bottom: 16px;
}
.vc-plan--cyan .vc-plan-avatar { background: rgba(0,212,255,0.1); border-color: rgba(0,212,255,0.3); color: #00d4ff; }
.vc-plan h3 { font-size: 1.1rem; font-weight: 900; margin-bottom: 4px; }
.vc-plan-tipo { font-size: 12.5px; color: var(--text-muted); margin-bottom: 18px; }
.vc-plan-items { list-style: none; display: flex; flex-direction: column; gap: 9px; flex: 1; margin-bottom: 20px; }
.vc-plan-items li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); }
.vc-plan-items li .v-icon { color: var(--primary-light); flex-shrink: 0; }
.vc-plan-precio { padding-top: 18px; border-top: 1px solid var(--border); }
.vc-precio-antes { font-size: 13px; font-weight: 700; color: var(--text-muted); text-decoration: line-through; margin-bottom: 4px; }
.vc-precio-label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 2px; }
.vc-precio-monto { font-size: 1.7rem; font-weight: 900; letter-spacing: -0.5px; color: var(--primary-light); }
.vc-precio-periodo { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }

.vc-resumen { overflow: hidden; }
.vc-tabla { width: 100%; border-collapse: collapse; }
.vc-tabla thead th {
  background: rgba(161,0,255,0.06); padding: 12px 20px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--text-muted); text-align: left; border-bottom: 1px solid var(--border);
}
.vc-tabla thead th:not(:first-child), .vc-tabla td:not(.vc-td-nombre) { text-align: right; }
.vc-tabla tbody tr { border-bottom: 1px solid rgba(255,255,255,0.05); }
.vc-tabla tbody tr:last-child { border-bottom: none; }
.vc-tabla td { padding: 14px 20px; font-size: 13.5px; }
.vc-td-nombre { font-weight: 700; }
.vc-td-antes { color: var(--text-muted); text-decoration: line-through; font-size: 12.5px; white-space: nowrap; }
.vc-td-precio { font-weight: 900; color: var(--primary-light); white-space: nowrap; }
.vc-total {
  background: linear-gradient(90deg, rgba(161,0,255,0.08), rgba(0,212,255,0.04)); border-top: 1px solid var(--border);
  padding: 20px 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
}
.vc-total-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
.vc-total-antes { font-size: 1rem; font-weight: 700; color: var(--text-muted); text-decoration: line-through; margin-right: 10px; }
.vc-total-monto { font-size: 1.8rem; font-weight: 900; letter-spacing: -0.5px; color: var(--primary-light); }
.vc-total-periodo { font-size: 12.5px; color: var(--text-muted); margin-left: 6px; }

.vc-cierre { padding: 48px 32px; text-align: center; }
.vc-cierre h2 { font-size: 1.4rem; font-weight: 900; margin-bottom: 12px; }
.vc-cierre p { font-size: 14px; color: var(--text-secondary); max-width: 520px; margin: 0 auto; line-height: 1.7; }

.vc-nota {
  display: flex; gap: 12px; align-items: flex-start; background: rgba(255,200,0,0.05); border: 1px solid rgba(255,200,0,0.15);
  border-radius: 12px; padding: 18px 20px;
}
.vc-nota-titulo { font-size: 13px; font-weight: 700; color: #e8d870; margin-bottom: 8px; }
.vc-nota ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.vc-nota li { font-size: 12.5px; color: rgba(200,184,96,0.9); line-height: 1.6; padding-left: 14px; position: relative; }
.vc-nota li::before { content: '–'; position: absolute; left: 0; }

.vc-footer {
  position: relative; z-index: 1; background: #060610; border-top: 1px solid var(--border); padding: 28px 32px;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
}
.vc-footer-logo { width: 100px; }
.vc-footer p { font-size: 12.5px; color: var(--text-muted); }

@media (max-width: 600px) {
  .vc-nav, .vc-section, .vc-footer { padding-left: 20px; padding-right: 20px; }
}
</style>
