<script setup>
import { ref, onMounted } from 'vue'
import { useReveal } from '../composables/useReveal'

const container = ref(null)
const { init } = useReveal()
onMounted(() => init(container.value))

const steps = [
  {
    number: '01',
    icon: 'mdi-stethoscope',
    title: 'Diagnóstico Comercial',
    description:
      'Analizamos en profundidad tu situación actual: equipo de ventas, mercado objetivo, competencia, propuesta de valor y procesos comerciales. Identificamos las brechas y oportunidades específicas de tu negocio en el sector salud.',
    outcomes: ['Mapa de oportunidades', 'Análisis de competencia', 'Perfil del cliente ideal'],
  },
  {
    number: '02',
    icon: 'mdi-map-outline',
    title: 'Estrategia a la Medida',
    description:
      'Diseñamos un plan comercial específico para tu empresa: canales de venta, mensajes clave, propuesta de valor diferenciada y el mix de herramientas IA que maximizará tus resultados en el sector salud.',
    outcomes: ['Plan comercial 90 días', 'Scripts de ventas', 'Embudo personalizado'],
  },
  {
    number: '03',
    icon: 'mdi-rocket-launch',
    title: 'Ejecución con Equipo Experto',
    description:
      'Implementamos el plan con un equipo especializado en ventas de salud. Activamos la IA, ejecutamos las campañas y acompañamos cada cierre de negocio con supervisión continua.',
    outcomes: ['Equipo activo desde semana 1', 'IA integrada', 'Reportes semanales'],
  },
  {
    number: '04',
    icon: 'mdi-trending-up',
    title: 'Optimización y Escala',
    description:
      'Medimos cada métrica, aprendemos de los datos y escalamos lo que funciona. Nuestro ciclo de mejora continua garantiza que los resultados crezcan mes a mes con tu negocio.',
    outcomes: ['KPIs en tiempo real', 'Ajustes mensuales', 'Plan de escalabilidad'],
  },
]
</script>

<template>
  <section ref="container" class="methodology-section">
    <div class="meth-blob" />

    <v-container>
      <!-- Header -->
      <v-row justify="center" class="mb-16">
        <v-col cols="12" md="8" class="text-center">
          <div class="reveal section-badge">
            <v-icon size="16">mdi-cog-outline</v-icon>
            Sistema Comprobado
          </div>
          <h2 class="reveal d1 section-title">
            Un sistema de ventas<br />
            <span class="gradient-text">probado por 6 años</span>
          </h2>
          <p class="reveal d2 section-subtitle">
            No improvisamos. Cada paso de nuestro proceso está respaldado por años de
            trabajo con empresas del sector salud y cientos de ciclos de venta cerrados.
          </p>
        </v-col>
      </v-row>

      <!-- Steps -->
      <div class="steps-wrapper">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="step-row reveal"
          :class="[`d${i + 1}`, { 'step-row-reverse': i % 2 !== 0 }]"
        >
          <!-- Number accent -->
          <div class="step-number-col">
            <div class="step-number">{{ step.number }}</div>
            <div v-if="i < steps.length - 1" class="step-line" />
          </div>

          <!-- Card -->
          <div class="step-card glass-card pa-8">
            <div class="d-flex align-center mb-5" style="gap: 20px">
              <div class="step-icon-wrap">
                <v-icon size="26" color="#a100ff">{{ step.icon }}</v-icon>
              </div>
              <h3 class="step-title">{{ step.title }}</h3>
            </div>
            <p class="step-desc mb-6">{{ step.description }}</p>
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="outcome in step.outcomes"
                :key="outcome"
                class="step-outcome"
              >
                <v-icon size="14" color="#4ade80">mdi-check-circle</v-icon>
                {{ outcome }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <v-row justify="center" class="mt-16">
        <v-col cols="12" md="8" class="text-center reveal">
          <div class="cta-box glass-card pa-10">
            <h3 class="cta-box-title mb-4">
              ¿Listo para activar el sistema?
            </h3>
            <p class="cta-box-sub mb-8">
              Agenda un diagnóstico gratuito de 30 minutos y descubre cómo podemos
              escalar las ventas de tu empresa del sector salud.
            </p>
            <v-btn
              class="cta-btn"
              size="large"
              href="https://wa.me/573242947897"
              target="_blank"
            >
              <v-icon start>mdi-calendar-check</v-icon>
              Agendar diagnóstico gratuito
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.methodology-section {
  position: relative;
  background: #0d0d1e;
  padding: 100px 0;
  overflow: hidden;
}
.meth-blob {
  position: absolute;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(161, 0, 255, 0.06) 0%, transparent 65%);
  border-radius: 50%;
  filter: blur(80px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.section-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
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

/* Steps layout */
.steps-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 860px;
  margin: 0 auto;
}

.step-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 0;
}

.step-number-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 28px;
}

.step-number {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a100ff, #7b00cc);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(161, 0, 255, 0.35);
}

.step-line {
  width: 2px;
  flex: 1;
  min-height: 40px;
  background: linear-gradient(180deg, rgba(161, 0, 255, 0.4), rgba(161, 0, 255, 0.05));
  margin-top: 8px;
  margin-bottom: 8px;
}

.step-card {
  margin-bottom: 20px;
}

.step-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(161, 0, 255, 0.1);
  border: 1px solid rgba(161, 0, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}
.step-card:hover .step-icon-wrap {
  background: rgba(161, 0, 255, 0.2);
  transform: scale(1.08);
}

.step-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
}
.step-desc {
  font-size: 15px;
  color: rgba(160, 160, 184, 0.85);
  line-height: 1.75;
}
.step-outcome {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(200, 240, 200, 0.9);
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 100px;
  padding: 5px 12px;
}

/* CTA box */
.cta-box-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
}
.cta-box-sub {
  font-size: 1rem;
  color: rgba(160, 160, 184, 0.8);
  line-height: 1.7;
}

@media (max-width: 600px) {
  .step-row { grid-template-columns: 48px 1fr; gap: 12px; }
  .step-number { width: 40px; height: 40px; font-size: 13px; }
}
</style>
