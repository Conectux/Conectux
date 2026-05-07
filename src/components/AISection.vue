<script setup>
import { ref, onMounted } from 'vue'
import { useReveal } from '../composables/useReveal'

const container = ref(null)
const { init } = useReveal()
onMounted(() => init(container.value))

const features = [
  {
    icon: 'mdi-account-search',
    title: 'Prospección inteligente',
    desc: 'La IA identifica y califica automáticamente los mejores prospectos del sector salud basándose en patrones de compra y perfil ideal.',
  },
  {
    icon: 'mdi-email-fast',
    title: 'Seguimiento automatizado',
    desc: 'Secuencias de contacto personalizadas que se disparan en el momento preciso, manteniendo tu pipeline siempre activo.',
  },
  {
    icon: 'mdi-chart-bell-curve-cumulative',
    title: 'Análisis predictivo',
    desc: 'Predecimos qué prospectos tienen más probabilidad de cerrar y en qué momento, optimizando el tiempo de tu equipo comercial.',
  },
  {
    icon: 'mdi-chat-processing',
    title: 'Chatbots especializados en salud',
    desc: 'Asistentes virtuales entrenados con terminología médica que pre-califican leads 24/7 antes de pasarlos a tu equipo.',
  },
  {
    icon: 'mdi-gauge',
    title: 'Dashboards en tiempo real',
    desc: 'Visibilidad total de tu proceso comercial: métricas, conversiones y ROI actualizados en tiempo real para tomar decisiones rápidas.',
  },
  {
    icon: 'mdi-robot-happy',
    title: 'Optimización continua',
    desc: 'La IA aprende de cada interacción y mejora continuamente los mensajes, tiempos y canales más efectivos para tu industria.',
  },
]
</script>

<template>
  <section ref="container" class="ai-section">
    <div class="ai-blob-1" />
    <div class="ai-blob-2" />

    <v-container>
      <v-row align="center" :gutter="16">
        <!-- Left: Text -->
        <v-col cols="12" lg="5" class="pr-lg-10 mb-12 mb-lg-0">
          <div class="reveal-left section-badge">
            <v-icon size="16">mdi-robot-outline</v-icon>
            Inteligencia Artificial
          </div>

          <h2 class="reveal-left d1 section-title">
            Potenciamos tus ventas con<br />
            <span class="gradient-text-ai">Inteligencia Artificial</span>
          </h2>

          <p class="reveal-left d2 section-subtitle mb-8">
            Somos pioneros en la integración de IA dentro del proceso de ventas para el
            sector salud. Nuestras herramientas automatizan tareas repetitivas y permiten
            a tu equipo enfocarse en lo que realmente importa: <strong>cerrar negocios.</strong>
          </p>

          <div class="ai-highlight reveal-left d3">
            <v-icon color="#00d4ff" size="20" class="mr-3">mdi-lightning-bolt</v-icon>
            <div>
              <div class="highlight-title">Resultado promedio con IA</div>
              <div class="highlight-desc">Reducción del 40% en el ciclo de ventas y +65% en tasa de respuesta de prospectos.</div>
            </div>
          </div>

          <v-btn
            class="mt-8 cta-btn reveal-left d4"
            href="https://wa.me/573242947897"
            target="_blank"
          >
            <v-icon start>mdi-robot</v-icon>
            Ver cómo funciona la IA
          </v-btn>
        </v-col>

        <!-- Right: Feature grid -->
        <v-col cols="12" lg="7">
          <v-row>
            <v-col
              v-for="(f, i) in features"
              :key="i"
              cols="12"
              sm="6"
              class="reveal"
              :class="`d${(i % 2) + 1}`"
            >
              <div class="ai-feature-card glass-card pa-6">
                <div class="d-flex align-start" style="gap: 16px">
                  <div class="ai-icon-wrap">
                    <v-icon size="22" color="#00d4ff">{{ f.icon }}</v-icon>
                  </div>
                  <div>
                    <h4 class="ai-feat-title mb-2">{{ f.title }}</h4>
                    <p class="ai-feat-desc">{{ f.desc }}</p>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.ai-section {
  position: relative;
  background: #09090f;
  padding: 100px 0;
  overflow: hidden;
}
.ai-blob-1 {
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 65%);
  border-radius: 50%;
  filter: blur(70px);
  top: -100px;
  right: -100px;
  pointer-events: none;
  animation: aiBlob1 12s ease-in-out infinite;
}
.ai-blob-2 {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(161, 0, 255, 0.1) 0%, transparent 65%);
  border-radius: 50%;
  filter: blur(60px);
  bottom: -80px;
  left: -80px;
  pointer-events: none;
  animation: aiBlob2 10s ease-in-out infinite;
}
@keyframes aiBlob1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-60px, 80px); }
}
@keyframes aiBlob2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(60px, -50px); }
}

.section-title {
  font-size: clamp(1.7rem, 3.5vw, 2.6rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.5px;
  margin-bottom: 16px;
}
.section-subtitle {
  font-size: 1rem;
  color: rgba(160, 160, 184, 0.85);
  line-height: 1.75;
}
.section-subtitle strong {
  color: #fff;
  font-weight: 600;
}

.ai-highlight {
  display: flex;
  align-items: flex-start;
  background: rgba(0, 212, 255, 0.07);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
}
.highlight-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}
.highlight-desc {
  font-size: 14px;
  color: rgba(160, 160, 184, 0.85);
  line-height: 1.6;
}

.ai-feature-card {
  height: 100%;
}
.ai-feature-card:hover {
  border-color: rgba(0, 212, 255, 0.3) !important;
  box-shadow: 0 8px 30px rgba(0, 212, 255, 0.1) !important;
}

.ai-icon-wrap {
  min-width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
.ai-feature-card:hover .ai-icon-wrap {
  background: rgba(0, 212, 255, 0.15);
  transform: scale(1.08);
}

.ai-feat-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}
.ai-feat-desc {
  font-size: 14px;
  color: rgba(160, 160, 184, 0.8);
  line-height: 1.65;
  margin: 0;
}
</style>
