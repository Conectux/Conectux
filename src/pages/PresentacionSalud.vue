<script setup>
import { ref, onMounted } from 'vue'
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
  { title: 'Creación de contenido', desc: 'Reels, carruseles, historias y piezas gráficas para Instagram y Facebook.' },
  { title: 'Guiones para videos', desc: 'Escritura y dirección de guiones educativos enfocados en tu especialidad.' },
  { title: 'Diseño de piezas gráficas', desc: 'Diseño profesional de todas las piezas visuales del mes.' },
  { title: 'Gestión de campañas Meta Ads', desc: 'Configuración, segmentación y optimización de pauta publicitaria.' },
  { title: 'CRM incluido', desc: 'Plataforma de gestión de leads, seguimiento de pacientes y pipeline de conversión.' },
  { title: 'IA ilimitada', desc: 'Automatizaciones inteligentes para seguimiento, clasificación de leads y reportes.' },
  { title: 'Embudo de atención al paciente', desc: 'Flujo completo desde el primer contacto hasta la cita agendada.' },
  { title: 'Reporte mensual con resultados', desc: 'Métricas de alcance, leads, conversaciones y ROI cada mes.' },
  { title: 'Consultoría estratégica mensual', desc: 'Reunión de revisión y ajuste de estrategia con tu equipo Conectux.' },
]

const excluded = [
  'Presupuesto de pauta (va directo a Meta)',
  'Uso de mensajes de WhatsApp (API)',
]

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
                  <span class="ps-stat-label">Años en el sector salud</span>
                </div>
                <div class="ps-stat">
                  <span class="ps-stat-num gradient-text">50+</span>
                  <span class="ps-stat-label">Profesionales de salud</span>
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

              <!-- Pricing card -->
              <div class="ps-price-card glass-card reveal d2 text-center">
                <div class="ps-price-glow" />
                <p class="ps-price-label mb-2">Inversión mensual</p>
                <div class="ps-price-before mb-1">Antes <span>$5.000.000</span></div>
                <div class="ps-price-now gradient-text">$3.000.000</div>
                <p class="ps-price-period">/ mes · IVA no incluido</p>

                <div class="ps-price-divider my-7" />

                <p class="ps-price-note-title mb-4">No incluye</p>
                <div class="d-flex flex-wrap justify-center" style="gap:10px">
                  <span v-for="ex in excluded" :key="ex" class="ps-exclude-tag">
                    <v-icon size="13" color="#f87171">mdi-close-circle</v-icon>
                    {{ ex }}
                  </span>
                </div>
              </div>

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

/* Pricing card */
.ps-price-card {
  position: relative;
  overflow: hidden;
  padding: 56px 48px;
}
.ps-price-glow {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(161, 0, 255, 0.12) 0%, transparent 70%);
  pointer-events: none;
}
.ps-price-label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(160, 160, 184, 0.6);
  margin: 0;
}
.ps-price-before {
  font-size: 15px;
  color: rgba(160, 160, 184, 0.5);
  margin: 0;
}
.ps-price-before span {
  text-decoration: line-through;
  font-weight: 600;
}
.ps-price-now {
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -2px;
}
.ps-price-period {
  font-size: 14px;
  color: rgba(160, 160, 184, 0.55);
  margin: 8px 0 0;
}
.ps-price-divider {
  border: none;
  border-top: 1px solid rgba(161, 0, 255, 0.12);
}
.ps-price-note-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(160, 160, 184, 0.5);
  margin: 0;
}
.ps-exclude-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(248, 113, 113, 0.85);
  background: rgba(248, 113, 113, 0.07);
  border: 1px solid rgba(248, 113, 113, 0.18);
  border-radius: 100px;
  padding: 5px 13px;
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
