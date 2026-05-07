<script setup>
import { ref, onMounted } from 'vue'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const counters = ref([
  { label: 'Años de experiencia', value: 0, target: 6, suffix: '+', prefix: '' },
  { label: 'Empresas del sector salud', value: 0, target: 50, suffix: '+', prefix: '' },
  { label: 'ROI promedio documentado', value: 0, target: 300, suffix: '%', prefix: '+' },
])

const animateCounter = (counter) => {
  const duration = 2200
  const start = Date.now()
  const tick = () => {
    const elapsed = Date.now() - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    counter.value = Math.round(eased * counter.target)
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => counters.value.forEach(animateCounter), 400)
          observer.disconnect()
        }
      })
    },
    { threshold: 0.3 }
  )
  const section = document.getElementById('hero')
  if (section) observer.observe(section)
})
</script>

<template>
  <section class="hero-section">
    <div class="blob blob-1" />
    <div class="blob blob-2" />
    <div class="blob blob-3" />
    <div class="hero-grid" />

    <v-container class="hero-container">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8" class="text-center hero-content">

          <div class="section-badge mx-auto">
            <v-icon size="16">mdi-medical-bag</v-icon>
            Especialistas en Sector Salud
          </div>

          <h1 class="hero-title">
            Vendemos para el<br />
            <span class="gradient-text">Sector Salud</span><br />
            con resultados reales
          </h1>

          <p class="hero-subtitle mx-auto">
            Más de <strong>6 años</strong> con un sistema comercial comprobado,
            potenciado con <strong>Inteligencia Artificial</strong>. Generamos ventas
            reales para laboratorios, distribuidores médicos, clínicas y empresas de
            salud en Colombia, LATAM y USA.
          </p>

          <div class="hero-ctas d-flex flex-wrap justify-center mt-10">
            <v-btn
              class="hero-cta-primary ma-2"
              href="https://wa.me/573242947897"
              target="_blank"
              size="large"
            >
              <v-icon start>mdi-calendar-check</v-icon>
              Agendar diagnóstico gratuito
            </v-btn>
            <v-btn
              class="hero-cta-secondary ma-2"
              size="large"
              @click="scrollTo('methodology')"
            >
              Ver nuestro sistema
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </div>

          <!-- Counters -->
          <div class="hero-counters mt-14 mx-auto">
            <div v-for="(c, i) in counters" :key="i" class="hero-counter">
              <span class="counter-number">
                {{ c.prefix }}{{ c.value }}{{ c.suffix }}
              </span>
              <span class="counter-label">{{ c.label }}</span>
            </div>
          </div>

        </v-col>
      </v-row>
    </v-container>

    <div class="scroll-indicator" @click="scrollTo('stats')">
      <v-icon color="rgba(255,255,255,0.35)" size="30">mdi-chevron-down</v-icon>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100vh;
  background: #09090f;
  overflow: hidden;
  display: flex;
  align-items: center;
}

/* Blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}
.blob-1 {
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(161, 0, 255, 0.22) 0%, transparent 65%);
  top: -200px;
  left: -200px;
  animation: blobFloat1 10s ease-in-out infinite;
}
.blob-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 65%);
  bottom: -150px;
  right: -100px;
  animation: blobFloat2 13s ease-in-out infinite;
}
.blob-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(161, 0, 255, 0.16) 0%, transparent 65%);
  top: 30%;
  right: 10%;
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

.hero-container {
  position: relative;
  z-index: 1;
  padding-top: 120px;
  padding-bottom: 100px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Badge */
.section-badge {
  display: inline-flex !important;
}

/* Title */
.hero-title {
  font-size: clamp(2.8rem, 6vw, 5.2rem);
  font-weight: 900;
  line-height: 1.08;
  color: #fff;
  margin: 24px 0 28px;
  letter-spacing: -2px;
}

/* Subtitle */
.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(160, 160, 184, 0.9);
  line-height: 1.8;
  max-width: 680px;
}
.hero-subtitle strong {
  color: #fff;
  font-weight: 700;
}

/* CTA buttons */
.hero-cta-primary {
  background: linear-gradient(135deg, #a100ff, #7b00cc) !important;
  color: #fff !important;
  border-radius: 100px !important;
  padding: 0 32px !important;
  height: 56px !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  text-transform: none !important;
  box-shadow: 0 4px 28px rgba(161, 0, 255, 0.45) !important;
  transition: all 0.3s ease !important;
}
.hero-cta-primary:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 10px 36px rgba(161, 0, 255, 0.6) !important;
}

.hero-cta-secondary {
  background: rgba(255, 255, 255, 0.06) !important;
  color: #fff !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 100px !important;
  padding: 0 32px !important;
  height: 56px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  text-transform: none !important;
  backdrop-filter: blur(8px) !important;
  transition: all 0.3s ease !important;
}
.hero-cta-secondary:hover {
  background: rgba(161, 0, 255, 0.15) !important;
  border-color: rgba(161, 0, 255, 0.45) !important;
  transform: translateY(-3px) !important;
}

/* Counters */
.hero-counters {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  max-width: 620px;
  width: 100%;
  border-top: 1px solid rgba(161, 0, 255, 0.14);
  padding-top: 32px;
}
@media (max-width: 600px) {
  .hero-counters {
    grid-template-columns: repeat(3, 1fr);
  }
}

.hero-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  border-right: 1px solid rgba(161, 0, 255, 0.1);
}
.hero-counter:last-child {
  border-right: none;
}

.counter-number {
  font-size: 2.4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #c84bff, #a100ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.counter-label {
  font-size: 13px;
  color: rgba(160, 160, 184, 0.75);
  line-height: 1.4;
  text-align: center;
}

/* Scroll indicator */
.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  animation: bounce 2.5s ease-in-out infinite;
  z-index: 1;
}
@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(10px); }
}
</style>
