<script setup>
import { ref, onMounted } from 'vue'
import { useReveal } from '../composables/useReveal'

const container = ref(null)
const { init } = useReveal()
onMounted(() => init(container.value))

const milestones = [
  {
    year: '2018',
    icon: 'mdi-flag-outline',
    title: 'El comienzo',
    desc: 'Conectux nació en Medellín con una idea simple: ayudar a las empresas a vender mejor. Empezamos pequeños, con mucha energía y ganas de aprender.',
    color: '#a100ff',
  },
  {
    year: '2019',
    icon: 'mdi-briefcase-outline',
    title: 'Primeros clientes, primeras lecciones',
    desc: 'Trabajamos con empresas de distintos sectores — retail, tecnología, servicios — y en cada proyecto aprendimos algo valioso sobre procesos comerciales, comunicación y resultados.',
    color: '#c84bff',
  },
  {
    year: '2021',
    icon: 'mdi-lightbulb-outline',
    title: 'Un giro que lo cambió todo',
    desc: 'Después de varios años acompañando diferentes industrias, descubrimos que el sector salud era donde más podíamos aportar. La complejidad del mundo médico nos desafió — y nos enamoró.',
    color: '#a100ff',
  },
  {
    year: '2022',
    icon: 'mdi-earth',
    title: 'Conectux LLC',
    desc: 'Formalizamos nuestra estructura como Conectux LLC con la mirada puesta en el mercado de habla hispana en Estados Unidos y en seguir creciendo de manera responsable.',
    color: '#c84bff',
  },
  {
    year: '2024',
    icon: 'mdi-robot',
    title: 'Inteligencia Artificial al servicio de la salud',
    desc: 'Empezamos a integrar herramientas de IA en nuestros procesos: automatización de seguimientos, análisis de prospectos y asistentes virtuales pensados para el lenguaje del sector médico.',
    color: '#00d4ff',
  },
  {
    year: '2025',
    icon: 'mdi-heart-pulse',
    title: 'Enfocados en lo que importa',
    desc: 'Hoy dedicamos toda nuestra energía al sector salud. Estamos construyendo algo en lo que creemos: que con las herramientas correctas, más personas pueden acceder a una atención médica de calidad.',
    color: '#a100ff',
  },
]
</script>

<template>
  <section ref="container" class="history-section">
    <div class="hist-blob-1" />
    <div class="hist-blob-2" />

    <v-container>
      <!-- Header -->
      <v-row justify="center" class="mb-16">
        <v-col cols="12" md="8" class="text-center">
          <div class="reveal section-badge">
            <v-icon size="16">mdi-clock-outline</v-icon>
            Nuestra historia
          </div>
          <h2 class="reveal d1 section-title">
            Un camino construido<br />
            <span class="gradient-text">con propósito</span>
          </h2>
          <p class="reveal d2 section-subtitle">
            No llegamos al sector salud por casualidad. Llegamos después de años de
            trabajo, aprendizaje y la convicción de que aquí es donde podemos
            generar el mayor impacto.
          </p>
        </v-col>
      </v-row>

      <!-- Timeline -->
      <div class="timeline">
        <div
          v-for="(m, i) in milestones"
          :key="i"
          class="timeline-item reveal"
          :class="[`d${(i % 3) + 1}`, { 'timeline-right': i % 2 !== 0 }]"
        >
          <!-- Year pill -->
          <div class="timeline-year" :style="{ background: m.color }">{{ m.year }}</div>

          <!-- Card -->
          <div class="timeline-card glass-card pa-7">
            <div class="d-flex align-center mb-4" style="gap: 20px">
              <div class="timeline-icon" :style="{ '--tc': m.color }">
                <v-icon size="22" :color="m.color">{{ m.icon }}</v-icon>
              </div>
              <h3 class="timeline-title">{{ m.title }}</h3>
            </div>
            <p class="timeline-desc">{{ m.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Values row -->
      <v-row justify="center" style="margin-top: 96px">
        <v-col cols="12" class="text-center reveal mb-10">
          <h3 class="values-title">Lo que nos define</h3>
        </v-col>
        <v-col
          v-for="(v, i) in [
            { icon: 'mdi-shield-check', title: 'Especialización', desc: 'Solo trabajamos con el sector salud. Esto nos hace irreemplazables.' },
            { icon: 'mdi-chart-line', title: 'Resultados', desc: 'Medimos todo. Si no hay resultados, no hay excusas.' },
            { icon: 'mdi-robot-happy', title: 'Innovación', desc: 'IA y tecnología al servicio de las ventas médicas.' },
            { icon: 'mdi-handshake', title: 'Alianza', desc: 'No somos proveedores, somos parte de tu equipo comercial.' },
          ]"
          :key="i"
          cols="6"
          md="3"
          class="reveal"
          :class="`d${i + 1}`"
        >
          <div class="value-card glass-card pa-6 text-center h-100">
            <div class="value-icon-wrap mx-auto mb-4">
              <v-icon size="26" color="#a100ff">{{ v.icon }}</v-icon>
            </div>
            <h4 class="value-title mb-2">{{ v.title }}</h4>
            <p class="value-desc">{{ v.desc }}</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.history-section {
  position: relative;
  background: #09090f;
  padding: 100px 0 120px;
  overflow: hidden;
}
.hist-blob-1 {
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(161, 0, 255, 0.07) 0%, transparent 65%);
  border-radius: 50%;
  filter: blur(70px);
  top: 0;
  right: -150px;
  pointer-events: none;
}
.hist-blob-2 {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 65%);
  border-radius: 50%;
  filter: blur(60px);
  bottom: 100px;
  left: -100px;
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

/* Timeline */
.timeline {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  max-width: 1060px;
  margin: 0 auto;
  position: relative;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(161, 0, 255, 0.3) 15%, rgba(161, 0, 255, 0.3) 85%, transparent);
  transform: translateX(-50%);
}

.timeline-item {
  grid-column: 1;
  padding-right: 28px;
  position: relative;
}
.timeline-right {
  grid-column: 2;
  padding-right: 0;
  padding-left: 28px;
  margin-top: 60px;
}

.timeline-year {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 16px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 14px;
  letter-spacing: 0.5px;
}

.timeline-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(161, 0, 255, 0.1);
  border: 1px solid rgba(161, 0, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}
.timeline-card:hover .timeline-icon {
  background: rgba(161, 0, 255, 0.2);
  transform: scale(1.08);
}

.timeline-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
}
.timeline-desc {
  font-size: 15px;
  color: rgba(160, 160, 184, 0.85);
  line-height: 1.75;
  margin: 0;
}

/* Values */
.values-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
}
.value-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(161, 0, 255, 0.1);
  border: 1px solid rgba(161, 0, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
.value-card:hover .value-icon-wrap {
  background: rgba(161, 0, 255, 0.2);
  transform: scale(1.08);
}
.value-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
}
.value-desc {
  font-size: 14px;
  color: rgba(160, 160, 184, 0.82);
  line-height: 1.65;
  margin: 0;
}

@media (max-width: 768px) {
  .timeline {
    grid-template-columns: 1fr;
  }
  .timeline::before { display: none; }
  .timeline-item,
  .timeline-right {
    grid-column: 1;
    padding: 0;
    margin-top: 0;
  }
}
</style>
