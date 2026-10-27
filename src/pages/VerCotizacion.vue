<script setup>
import { ref, onMounted } from 'vue'
import logo from '../assets/logo-conectux.png'

const slugDeRuta = location.pathname.match(/\/cotizacion\/([^/]+)/)?.[1]
const slug = slugDeRuta ? decodeURIComponent(slugDeRuta) : (new URLSearchParams(location.search).get('slug') || '')

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
      <nav class="vc-nav">
        <img :src="logo" alt="Conectux" class="vc-nav-logo" />
        <a :href="`/api/cotizaciones?accion=pdf&slug=${slug}`" target="_blank" rel="noopener" class="vc-nav-btn">
          <v-icon icon="mdi-download" size="16" class="mr-1" /> Descargar PDF
        </a>
      </nav>

      <!-- HERO -->
      <header class="vc-hero">
        <div class="vc-dot-grid"></div>
        <div class="vc-blob vc-blob-1"></div>
        <div class="vc-blob vc-blob-2"></div>
        <div class="vc-hero-inner">
          <div class="vc-badge" v-if="cot.periodo"><span class="vc-badge-dot"></span>Propuesta Comercial · {{ cot.periodo }}</div>
          <h1 class="vc-hero-title"><span class="gradient-text">{{ cot.heroTitulo || cot.cliente }}</span></h1>
          <p v-if="cot.heroSubtitulo" class="vc-hero-sub">{{ cot.heroSubtitulo }}</p>
          <div v-if="cot.planesBadge" class="vc-badge-especial">
            <v-icon icon="mdi-star-four-points" size="15" /> {{ cot.planesBadge }}
          </div>
        </div>
      </header>

      <!-- PILARES -->
      <section v-if="cot.pilares?.length" class="vc-section">
        <div class="vc-section-header">
          <div class="vc-eyebrow">Enfoque</div>
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
          <div class="vc-eyebrow">Propuesta</div>
          <h2>{{ cot.planesTitulo }}</h2>
          <p v-if="cot.planesSubtitulo">{{ cot.planesSubtitulo }}</p>
        </div>
        <div class="vc-planes-grid" :class="`vc-planes-grid--${Math.min(cot.planes.length, 3)}`">
          <div v-for="plan in cot.planes" :key="plan.nombre" class="vc-plan glass-card" :class="{ 'vc-plan--cyan': plan.acento === 'cyan' }">
            <div class="vc-plan-top-bar"></div>
            <div class="vc-plan-avatar">{{ plan.avatar }}</div>
            <h3>{{ plan.nombre }}</h3>
            <p v-if="plan.tipo" class="vc-plan-tipo">{{ plan.tipo }}</p>
            <ul class="vc-plan-items">
              <li v-for="(item, i) in plan.items" :key="i">
                <span class="vc-check"><v-icon icon="mdi-check-bold" size="11" /></span>
                {{ item }}
              </li>
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
        <div class="vc-section-header">
          <div class="vc-eyebrow">Inversión</div>
          <h2>Resumen económico</h2>
        </div>
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
          <div class="vc-cierre-blob"></div>
          <div class="vc-cierre-inner">
            <v-icon icon="mdi-rocket-launch-outline" size="30" color="#c84bff" class="mb-3" />
            <h2>{{ cot.cierreTitulo }}</h2>
            <p>{{ cot.cierreTexto }}</p>
            <a :href="`/api/cotizaciones?accion=pdf&slug=${slug}`" target="_blank" rel="noopener" class="vc-cierre-btn">
              <v-icon icon="mdi-download" size="17" class="mr-2" /> Descargar propuesta en PDF
            </a>
          </div>
        </div>
      </section>

      <!-- EXCLUSIONES -->
      <section v-if="cot.exclusiones?.length" class="vc-section vc-section--sin-top">
        <div class="vc-nota">
          <div class="vc-nota-icono"><v-icon icon="mdi-alert-outline" size="20" /></div>
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
        <p>Propuesta confidencial <span class="vc-footer-dot">·</span> {{ cot.cliente }} <span class="vc-footer-dot">·</span> conectux.com</p>
      </footer>
    </template>
  </div>
</template>

<style scoped>
.vc-page { min-height: 100vh; background: var(--dark-bg); position: relative; overflow-x: hidden; }
.vc-estado { color: var(--text-secondary); font-size: 14px; text-align: center; padding: 120px 20px; }
.vc-estado--error { color: #fca5a5; }

/* ── Navbar ── */
.vc-nav {
  position: sticky; top: 0; z-index: 20; display: flex; align-items: center; justify-content: space-between;
  padding: 16px 32px; backdrop-filter: blur(16px); background: rgba(9, 9, 15, 0.75); border-bottom: 1px solid var(--border);
}
.vc-nav-logo { width: 120px; }
.vc-nav-btn {
  display: inline-flex; align-items: center; background: var(--gradient); color: #fff; text-decoration: none;
  border-radius: 100px; padding: 10px 20px; font-size: 13px; font-weight: 700; box-shadow: 0 4px 18px rgba(161,0,255,0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.vc-nav-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(161,0,255,0.55); }

/* ── Hero ── */
.vc-hero { position: relative; padding: 90px 24px 70px; text-align: center; overflow: hidden; }
.vc-dot-grid {
  position: absolute; inset: 0; z-index: 0;
  background-image: radial-gradient(circle, rgba(161,0,255,0.1) 1px, transparent 1px); background-size: 36px 36px;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 20%, black 40%, transparent 100%);
}
.vc-blob { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; z-index: 0; }
.vc-blob-1 { width: 560px; height: 560px; top: -220px; left: -160px; background: radial-gradient(circle, rgba(161,0,255,0.22) 0%, transparent 65%); animation: vc-float-1 11s ease-in-out infinite; }
.vc-blob-2 { width: 420px; height: 420px; bottom: -180px; right: -120px; background: radial-gradient(circle, rgba(0,212,255,0.14) 0%, transparent 65%); animation: vc-float-2 13s ease-in-out infinite; }
@keyframes vc-float-1 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px, 50px) scale(1.06); } }
@keyframes vc-float-2 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-40px, -40px) scale(1.08); } }

.vc-hero-inner { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
.vc-badge {
  display: inline-flex; align-items: center; gap: 8px; background: rgba(161,0,255,0.1); border: 1px solid rgba(161,0,255,0.3);
  border-radius: 100px; padding: 7px 18px; font-size: 12px; font-weight: 700; color: var(--primary-light); letter-spacing: 0.08em;
  text-transform: uppercase; margin-bottom: 28px;
}
.vc-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary-light); box-shadow: 0 0 10px var(--primary-light); }
.vc-hero-title { font-size: clamp(2.2rem, 5.5vw, 3.8rem); font-weight: 900; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 22px; }
.vc-hero-sub { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.75; max-width: 620px; margin: 0 auto; }
.vc-badge-especial {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 28px; background: rgba(74,222,128,0.12);
  border: 1px solid rgba(74,222,128,0.35); border-radius: 100px; padding: 9px 20px; font-size: 13px; font-weight: 800;
  color: #4ade80; letter-spacing: 0.02em; animation: vc-pulso 2.4s ease-in-out infinite;
}
@keyframes vc-pulso {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.25); }
  50% { box-shadow: 0 0 0 9px rgba(74,222,128,0); }
}

/* ── Sections ── */
.vc-section { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 64px 24px; }
.vc-section--alt { background: rgba(255,255,255,0.02); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.vc-section--sin-top { padding-top: 0; }
.vc-section-header { margin-bottom: 42px; text-align: center; }
.vc-eyebrow { font-size: 11.5px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--primary-light); margin-bottom: 10px; }
.vc-section-header h2 { font-size: clamp(1.6rem, 3.2vw, 2.2rem); font-weight: 900; margin-bottom: 12px; letter-spacing: -0.8px; }
.vc-section-header p { font-size: 14.5px; color: var(--text-secondary); max-width: 580px; margin: 0 auto; line-height: 1.75; }

/* ── Pilares ── */
.vc-pilares-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
.vc-pilar { padding: 30px 26px; transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
.vc-pilar:hover { transform: translateY(-5px); border-color: rgba(161,0,255,0.4); box-shadow: 0 16px 40px rgba(161,0,255,0.15); }
.vc-pilar-num {
  font-size: 1.8rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 16px;
  background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.vc-pilar h3 { font-size: 1.05rem; font-weight: 800; margin-bottom: 10px; letter-spacing: -0.2px; }
.vc-pilar p { font-size: 13.5px; color: var(--text-secondary); line-height: 1.7; }

/* ── Planes ── */
.vc-planes-grid { display: grid; gap: 22px; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); }
.vc-planes-grid--1 { max-width: 440px; margin: 0 auto; }
.vc-planes-grid--2 { max-width: 800px; margin: 0 auto; grid-template-columns: repeat(2, 1fr); }
@media (max-width: 760px) { .vc-planes-grid--2 { grid-template-columns: 1fr; } }

.vc-plan {
  position: relative; padding: 32px 26px; display: flex; flex-direction: column; overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}
.vc-plan:hover { transform: translateY(-6px); border-color: rgba(161,0,255,0.4); box-shadow: 0 20px 48px rgba(161,0,255,0.18); }
.vc-plan-top-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--gradient); }
.vc-plan--cyan { border-color: rgba(0, 212, 255, 0.3); }
.vc-plan--cyan .vc-plan-top-bar { background: linear-gradient(90deg, #00d4ff, var(--primary-light)); }
.vc-plan-avatar {
  width: 50px; height: 50px; border-radius: 15px; display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 900; background: rgba(161,0,255,0.12); border: 1px solid var(--border); color: var(--primary-light);
  margin-bottom: 18px;
}
.vc-plan--cyan .vc-plan-avatar { background: rgba(0,212,255,0.1); border-color: rgba(0,212,255,0.3); color: #00d4ff; }
.vc-plan h3 { font-size: 1.25rem; font-weight: 900; margin-bottom: 4px; letter-spacing: -0.3px; }
.vc-plan-tipo { font-size: 12.5px; color: var(--text-muted); margin-bottom: 20px; }
.vc-plan-items { list-style: none; display: flex; flex-direction: column; gap: 11px; flex: 1; margin-bottom: 24px; }
.vc-plan-items li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: var(--text-secondary); line-height: 1.5; }
.vc-check {
  width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(161,0,255,0.14); border: 1px solid rgba(161,0,255,0.3); color: var(--primary-light);
}
.vc-plan--cyan .vc-check { background: rgba(0,212,255,0.12); border-color: rgba(0,212,255,0.3); color: #00d4ff; }
.vc-plan-precio { padding-top: 20px; border-top: 1px solid var(--border); }
.vc-precio-antes { font-size: 14px; font-weight: 700; color: var(--text-muted); text-decoration: line-through; margin-bottom: 4px; }
.vc-precio-label { font-size: 11px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; }
.vc-precio-monto { font-size: 2.1rem; font-weight: 900; letter-spacing: -1px; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.vc-precio-periodo { font-size: 12px; color: var(--text-muted); margin-top: 3px; }

/* ── Resumen ── */
.vc-resumen { overflow: hidden; }
.vc-tabla { width: 100%; border-collapse: collapse; }
.vc-tabla thead th {
  background: rgba(161,0,255,0.07); padding: 14px 24px; font-size: 11px; font-weight: 800; letter-spacing: 0.09em;
  text-transform: uppercase; color: var(--text-muted); text-align: left; border-bottom: 1px solid var(--border);
}
.vc-tabla thead th:not(:first-child), .vc-tabla td:not(.vc-td-nombre) { text-align: right; }
.vc-tabla tbody tr { border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s ease; }
.vc-tabla tbody tr:hover { background: rgba(161,0,255,0.03); }
.vc-tabla tbody tr:last-child { border-bottom: none; }
.vc-tabla td { padding: 16px 24px; font-size: 14px; }
.vc-td-nombre { font-weight: 700; }
.vc-td-antes { color: var(--text-muted); text-decoration: line-through; font-size: 12.5px; white-space: nowrap; }
.vc-td-precio { font-weight: 900; font-size: 15px; color: var(--primary-light); white-space: nowrap; }
.vc-total {
  background: linear-gradient(90deg, rgba(161,0,255,0.1), rgba(0,212,255,0.05)); border-top: 1px solid rgba(161,0,255,0.2);
  padding: 24px 26px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
}
.vc-total-label { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
.vc-total-antes { font-size: 1.1rem; font-weight: 700; color: var(--text-muted); text-decoration: line-through; margin-right: 12px; }
.vc-total-monto { font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.vc-total-periodo { font-size: 13px; color: var(--text-muted); margin-left: 8px; }

/* ── Cierre ── */
.vc-cierre { position: relative; padding: 64px 32px; text-align: center; overflow: hidden; }
.vc-cierre-blob {
  position: absolute; width: 450px; height: 350px; top: -120px; left: 50%; transform: translateX(-50%);
  background: radial-gradient(circle, rgba(161,0,255,0.14) 0%, transparent 70%); filter: blur(60px); pointer-events: none;
}
.vc-cierre-inner { position: relative; z-index: 1; }
.vc-cierre h2 { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; margin-bottom: 14px; letter-spacing: -0.5px; }
.vc-cierre p { font-size: 15px; color: var(--text-secondary); max-width: 540px; margin: 0 auto 28px; line-height: 1.8; }
.vc-cierre-btn {
  display: inline-flex; align-items: center; background: var(--gradient); color: #fff; text-decoration: none;
  border-radius: 100px; padding: 14px 28px; font-size: 14px; font-weight: 700; box-shadow: 0 8px 28px rgba(161,0,255,0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.vc-cierre-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(161,0,255,0.55); }

/* ── Exclusiones ── */
.vc-nota {
  display: flex; gap: 16px; align-items: flex-start; background: rgba(255,200,0,0.05); border: 1px solid rgba(255,200,0,0.18);
  border-radius: 16px; padding: 24px 26px;
}
.vc-nota-icono {
  width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(255,200,0,0.12); color: #e8d870;
}
.vc-nota-titulo { font-size: 14px; font-weight: 800; color: #e8d870; margin-bottom: 10px; }
.vc-nota ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.vc-nota li { font-size: 13px; color: rgba(210,195,110,0.95); line-height: 1.7; padding-left: 16px; position: relative; }
.vc-nota li::before { content: '–'; position: absolute; left: 0; }

/* ── Footer ── */
.vc-footer {
  position: relative; z-index: 1; background: #060610; border-top: 1px solid var(--border); padding: 32px;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;
}
.vc-footer-logo { width: 100px; }
.vc-footer p { font-size: 12.5px; color: var(--text-muted); }
.vc-footer-dot { color: var(--primary-light); margin: 0 2px; }

@media (max-width: 600px) {
  .vc-nav, .vc-hero, .vc-section, .vc-footer { padding-left: 20px; padding-right: 20px; }
}
</style>
