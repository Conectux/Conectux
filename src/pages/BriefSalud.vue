<script setup>
import logo from '../assets/logo-conectux.png'

const highlights = [
  { icon: 'mdi-bullseye-arrow', text: 'Estrategia más precisa' },
  { icon: 'mdi-video-outline', text: 'Contenido más efectivo' },
  { icon: 'mdi-trending-up', text: 'Resultados más rápidos' },
]

const steps = [
  { number: '01', label: 'Tu consulta y especialidad' },
  { number: '02', label: 'Tus pacientes ideales' },
  { number: '03', label: 'Situación digital actual' },
  { number: '04', label: 'Objetivos y metas' },
  { number: '05', label: 'Comunicación y ventas' },
]
</script>

<template>
  <v-app>
    <div class="bf-page">

      <!-- ─── HERO ──────────────────────────────────────────────── -->
      <section class="bf-hero">
        <div class="bf-blob bf-blob-1" />
        <div class="bf-blob bf-blob-2" />
        <div class="bf-grid" />

        <div class="bf-hero-inner">

          <!-- Logo -->
          <div class="bf-logo-wrap">
            <img :src="logo" alt="Conectux" class="bf-logo" />
          </div>

          <!-- Badge -->
          <div class="section-badge mx-auto mb-6">
            <v-icon size="15">mdi-file-document-edit-outline</v-icon>
            Brief Inicial · Sector Salud
          </div>

          <!-- Título -->
          <h1 class="bf-title">
            Cuéntanos todo<br />
            <span class="gradient-text">sobre tu consulta</span>
          </h1>

          <!-- Intro -->
          <p class="bf-intro mx-auto mt-6">
            Antes de iniciar tu estrategia digital, necesitamos conocer a fondo tu servicio,
            tus pacientes, tus objetivos y la forma en que actualmente atiendes, comunicas
            y vendes tu consulta, clínica o centro médico.
          </p>
          <p class="bf-intro bf-intro-strong mx-auto mt-4">
            Este brief nos ayudará a crear una estrategia más precisa, ética y efectiva
            para atraer pacientes reales, mejorar tu posicionamiento y construir una
            comunicación alineada con tu especialidad.
          </p>

          <!-- Highlights -->
          <div class="bf-highlights mt-8">
            <div v-for="h in highlights" :key="h.text" class="bf-highlight-chip">
              <v-icon size="15" color="#a100ff">{{ h.icon }}</v-icon>
              {{ h.text }}
            </div>
          </div>

          <!-- Aviso de duración -->
          <div class="bf-time-notice mt-8 mx-auto">
            <v-icon size="20" color="#c84bff">mdi-clock-outline</v-icon>
            <div>
              <p class="bf-time-title">Este formulario es detallado — y eso es intencional</p>
              <p class="bf-time-sub">
                Toma entre <strong>15 y 20 minutos</strong>. Cada pregunta tiene un propósito
                estratégico. Entre más detallada sea tu respuesta, mejor será el trabajo que hagamos juntos.
              </p>
            </div>
          </div>

          <!-- Secciones del brief -->
          <div class="bf-sections mt-8 mx-auto">
            <p class="bf-sections-label mb-4">El brief cubre 5 áreas clave:</p>
            <div class="bf-sections-row">
              <div v-for="s in steps" :key="s.number" class="bf-section-chip">
                <span class="bf-section-num">{{ s.number }}</span>
                <span class="bf-section-label">{{ s.label }}</span>
              </div>
            </div>
          </div>

          <!-- Flecha hacia abajo -->
          <div class="bf-scroll-hint mt-10">
            <v-icon color="rgba(161,0,255,0.5)" size="28">mdi-chevron-double-down</v-icon>
            <p>Completa el formulario a continuación</p>
          </div>

        </div>
      </section>

      <!-- ─── FORMULARIO ─────────────────────────────────────────── -->
      <section class="bf-form-section">
        <div class="bf-form-wrap">
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/mSwZmFfQsSYxBVth6rEY"
            style="width:100%;height:6209px;border:none;display:block;"
            id="inline-mSwZmFfQsSYxBVth6rEY"
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Brief Inicial – Sector Salud"
            data-height="6209"
            data-layout-iframe-id="inline-mSwZmFfQsSYxBVth6rEY"
            data-form-id="mSwZmFfQsSYxBVth6rEY"
            title="Brief Inicial – Sector Salud"
          />
        </div>
      </section>

      <!-- ─── FOOTER ─────────────────────────────────────────────── -->
      <footer class="bf-footer">
        <img :src="logo" alt="Conectux" class="bf-footer-logo" />
        <p class="bf-footer-copy">© {{ new Date().getFullYear() }} Conectux LLC · Especialistas en Ventas para el Sector Salud</p>
      </footer>

    </div>
  </v-app>
</template>

<style scoped>
/* ─── Base ───────────────────────────────────────────────────── */
.bf-page {
  background: #09090f;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ─── Hero ───────────────────────────────────────────────────── */
.bf-hero {
  position: relative;
  background: #09090f;
  overflow: hidden;
  padding: 80px 24px 100px;
  display: flex;
  justify-content: center;
}
.bf-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}
.bf-blob-1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(161, 0, 255, 0.2) 0%, transparent 65%);
  top: -250px; left: -200px;
  animation: blobFloat1 11s ease-in-out infinite;
}
.bf-blob-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 65%);
  bottom: -100px; right: -100px;
  animation: blobFloat2 14s ease-in-out infinite;
}
@keyframes blobFloat1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(50px, 70px); }
}
@keyframes blobFloat2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-60px, -50px); }
}
.bf-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(161, 0, 255, 0.07) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
}
.bf-hero-inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  width: 100%;
  text-align: center;
}

/* Logo */
.bf-logo-wrap {
  margin-bottom: 40px;
}
.bf-logo {
  height: 36px;
  filter: brightness(0) invert(1);
}

/* Título */
.bf-title {
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -1.5px;
  margin: 0;
}

/* Intro text */
.bf-intro {
  font-size: 1rem;
  color: rgba(160, 160, 184, 0.85);
  line-height: 1.8;
  max-width: 620px;
  margin: 0 auto;
}
.bf-intro-strong {
  color: rgba(200, 200, 220, 0.9);
  font-weight: 500;
}

/* Highlight chips */
.bf-highlights {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
.bf-highlight-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(200, 160, 255, 0.9);
  background: rgba(161, 0, 255, 0.1);
  border: 1px solid rgba(161, 0, 255, 0.25);
  border-radius: 100px;
  padding: 7px 16px;
}

/* Time notice */
.bf-time-notice {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  max-width: 580px;
  background: rgba(161, 0, 255, 0.07);
  border: 1px solid rgba(161, 0, 255, 0.2);
  border-radius: 16px;
  padding: 18px 22px;
  text-align: left;
}
.bf-time-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px;
}
.bf-time-sub {
  font-size: 13px;
  color: rgba(160, 160, 184, 0.8);
  line-height: 1.6;
  margin: 0;
}
.bf-time-sub strong {
  color: #c84bff;
  font-weight: 700;
}

/* Sections preview */
.bf-sections {
  max-width: 580px;
  text-align: left;
}
.bf-sections-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(160, 160, 184, 0.5);
  margin: 0;
}
.bf-sections-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.bf-section-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(161, 0, 255, 0.15);
  border-radius: 10px;
  padding: 8px 14px;
}
.bf-section-num {
  font-size: 11px;
  font-weight: 800;
  color: #a100ff;
  letter-spacing: 0.5px;
}
.bf-section-label {
  font-size: 13px;
  color: rgba(220, 220, 240, 0.85);
  font-weight: 500;
}

/* Scroll hint */
.bf-scroll-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: bounce 2.5s ease-in-out infinite;
}
.bf-scroll-hint p {
  font-size: 12px;
  color: rgba(161, 0, 255, 0.5);
  margin: 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 600;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

/* ─── Form section ───────────────────────────────────────────── */
.bf-form-section {
  background: #0d0d1e;
  border-top: 1px solid rgba(161, 0, 255, 0.1);
  padding: 60px 24px;
}
.bf-form-wrap {
  max-width: 860px;
  margin: 0 auto;
  border-radius: 20px;
  border: 1px solid rgba(161, 0, 255, 0.15);
  box-shadow: 0 8px 60px rgba(161, 0, 255, 0.08);
  padding: 40px;
  background: rgba(255, 255, 255, 0.01);
}

/* ─── Footer ─────────────────────────────────────────────────── */
.bf-footer {
  background: #060610;
  border-top: 1px solid rgba(161, 0, 255, 0.08);
  padding: 28px 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 100%;
}
.bf-footer-logo {
  height: 26px;
  filter: brightness(0) invert(1);
  opacity: 0.45;
}
.bf-footer-copy {
  font-size: 13px;
  color: rgba(90, 90, 120, 0.9);
  margin: 0;
}

/* ─── Vuetify overrides ──────────────────────────────────────── */
:deep(.v-application__wrap) {
  background: #09090f !important;
  min-height: unset !important;
}
</style>
