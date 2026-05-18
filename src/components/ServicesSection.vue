<script setup>
import { ref, onMounted } from 'vue'
import { useReveal } from '../composables/useReveal'

const container = ref(null)
const { init } = useReveal()
onMounted(() => init(container.value))

const services = [
  {
    icon: 'mdi-account-tie',
    title: 'Outsourcing Comercial',
    description:
      'Ponemos a tu disposición un equipo de asesores especializados en salud, listos para abrir mercado y cerrar ventas desde el primer mes.',
    tags: ['Representantes médicos', 'Fuerza de ventas', 'B2B Salud'],
    color: '#a100ff',
  },
  {
    icon: 'mdi-target-account',
    title: 'Generación de Leads Calificados',
    description:
      'Identificamos y pre-calificamos prospectos del sector salud: laboratorios, clínicas, distribuidores y hospitales con necesidades reales.',
    tags: ['Prospección activa', 'Base de datos salud', 'Lead scoring'],
    color: '#c84bff',
  },
  {
    icon: 'mdi-hospital-box',
    title: 'Marketing Digital para Salud',
    description:
      'Campañas de pauta y contenido diseñadas para audiencias del sector salud, generando autoridad de marca y consultas calificadas.',
    tags: ['Meta Ads', 'Google Ads', 'Contenido médico'],
    color: '#a100ff',
  },
  {
    icon: 'mdi-robot',
    title: 'IA para el Proceso de Ventas',
    description:
      'Automatizamos y potenciamos tu ciclo comercial con inteligencia artificial, reduciendo tiempos y aumentando conversiones en cada etapa.',
    tags: ['Automatización', 'Chatbots IA', 'Seguimiento inteligente'],
    color: '#00d4ff',
  },
  {
    icon: 'mdi-chart-timeline-variant',
    title: 'CRM & Automatización',
    description:
      'Implementamos tu CRM para que ningún lead se pierda. Pipeline claro, seguimientos automáticos y reportes en tiempo real.',
    tags: ['Pipeline', 'Reportes', 'Seguimiento automático'],
    color: '#c84bff',
  },
  {
    icon: 'mdi-school',
    title: 'Capacitación Comercial',
    description:
      'Entrenamos a tu equipo en técnicas de venta especializadas para el sector salud: médicos, compradores hospitalarios y decisores.',
    tags: ['Ventas médicas', 'Técnicas de cierre', 'Formación in-house'],
    color: '#a100ff',
  },
]
</script>

<template>
  <section ref="container" class="services-section">
    <div class="blob-services" />
    <v-container>
      <v-row justify="center" class="mb-14">
        <v-col cols="12" md="8" class="text-center">
          <div class="reveal section-badge">
            <v-icon size="16">mdi-briefcase-outline</v-icon>
            Lo que hacemos
          </div>
          <h2 class="reveal d1 section-title">
            Servicios diseñados para el<br />
            <span class="gradient-text">Sector Salud</span>
          </h2>
          <p class="reveal d2 section-subtitle">
            No somos una agencia genérica. Cada servicio está construido con conocimiento
            profundo del sector y un sistema comercial que lleva más de 6 años generando resultados.
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="(s, i) in services"
          :key="i"
          cols="12"
          sm="6"
          lg="4"
          class="reveal"
          :class="`d${(i % 3) + 1}`"
        >
          <div class="service-card glass-card pa-7 h-100">
            <div class="service-icon-wrap">
              <v-icon size="28" :color="s.color">{{ s.icon }}</v-icon>
            </div>
            <h3 class="service-title mt-5 mb-3">{{ s.title }}</h3>
            <p class="service-desc mb-5">{{ s.description }}</p>
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="tag in s.tags"
                :key="tag"
                class="service-tag"
              >{{ tag }}</span>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mt-14">
        <v-col cols="12" class="text-center reveal">
          <p class="cta-sub mb-6">¿Necesitas una solución a medida para tu empresa del sector salud?</p>
          <v-btn
            class="cta-btn"
            size="large"
            href="https://wa.me/573147101116"
            target="_blank"
          >
            <v-icon start>mdi-whatsapp</v-icon>
            Hablar con un especialista
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.services-section {
  position: relative;
  background: #0d0d1e;
  padding: 100px 0;
  overflow: hidden;
}
.blob-services {
  position: absolute;
  top: 50%;
  right: -200px;
  transform: translateY(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(161, 0, 255, 0.07) 0%, transparent 65%);
  border-radius: 50%;
  filter: blur(60px);
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

.service-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(161, 0, 255, 0.1);
  border: 1px solid rgba(161, 0, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
.service-card:hover .service-icon-wrap {
  background: rgba(161, 0, 255, 0.2);
  transform: scale(1.08) rotate(3deg);
}

.service-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
}
.service-desc {
  font-size: 15px;
  color: rgba(160, 160, 184, 0.85);
  line-height: 1.75;
}
.service-tag {
  font-size: 12px;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: 100px;
  background: rgba(161, 0, 255, 0.1);
  border: 1px solid rgba(161, 0, 255, 0.2);
  color: rgba(200, 160, 255, 0.9);
  transition: all 0.2s ease;
}
.service-card:hover .service-tag {
  background: rgba(161, 0, 255, 0.18);
  border-color: rgba(161, 0, 255, 0.35);
}

.cta-sub {
  font-size: 1rem;
  color: rgba(160, 160, 184, 0.8);
}
</style>
