<script setup>
import { ref, onMounted } from 'vue'
import { useReveal } from '../composables/useReveal'

const container = ref(null)
const { init } = useReveal()

const stats = ref([
  { value: 0, target: 6, suffix: '+', label: 'Años en el sector salud', icon: 'mdi-calendar-star', color: '#a100ff' },
  { value: 0, target: 50, suffix: '+', label: 'Empresas atendidas', icon: 'mdi-hospital-building', color: '#c84bff' },
  { value: 0, target: 98, suffix: '%', label: 'Tasa de satisfacción', icon: 'mdi-star', color: '#00d4ff' },
  { value: 0, target: 300, suffix: '%', label: 'ROI promedio documentado', icon: 'mdi-trending-up', color: '#a100ff' },
])

const animateCounter = (stat) => {
  const duration = 2000
  const start = Date.now()
  const tick = () => {
    const elapsed = Date.now() - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    stat.value = Math.round(eased * stat.target)
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  init(container.value)

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          stats.value.forEach(animateCounter)
          observer.disconnect()
        }
      })
    },
    { threshold: 0.4 }
  )
  if (container.value) observer.observe(container.value)
})
</script>

<template>
  <section ref="container" class="stats-section">
    <div class="stats-glow" />
    <v-container>
      <v-row justify="center" class="text-center">
        <v-col
          v-for="(stat, i) in stats"
          :key="i"
          cols="6"
          md="3"
          class="reveal pa-3"
          :class="`d${i + 1}`"
        >
          <div class="stat-card">
            <div class="stat-icon-wrap" :style="{ '--c': stat.color }">
              <v-icon size="26" :color="stat.color">{{ stat.icon }}</v-icon>
            </div>
            <div class="stat-number" :style="{ color: stat.color }">
              +{{ stat.value }}{{ stat.suffix }}
            </div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.stats-section {
  position: relative;
  background: linear-gradient(180deg, #09090f 0%, #0d0d20 50%, #09090f 100%);
  padding: 80px 0;
  overflow: hidden;
}
.stats-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(161, 0, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 36px 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(161, 0, 255, 0.12);
  border-radius: 20px;
  transition: all 0.35s ease;
}
.stat-card:hover {
  background: rgba(161, 0, 255, 0.06);
  border-color: rgba(161, 0, 255, 0.3);
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(161, 0, 255, 0.15);
}

.stat-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(161, 0, 255, 0.1);
  border: 1px solid rgba(161, 0, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-number {
  font-size: 2.6rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -1px;
}

.stat-label {
  font-size: 15px;
  color: rgba(160, 160, 184, 0.85);
  text-align: center;
  line-height: 1.5;
}
</style>
