<script setup>
import { ref, onMounted } from 'vue'
import { useReveal } from '../composables/useReveal'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const container = ref(null)
const { init } = useReveal()
onMounted(() => init(container.value))

const modules = [Autoplay, Pagination]

const testimonials = [
  {
    name: 'Carlos Mendoza',
    role: 'Director Comercial',
    company: 'Laboratorio BioPharma Colombia',
    sector: 'Laboratorio farmacéutico',
    avatar: 'CM',
    stars: 5,
    result: '+180% en visitas médicas',
    comment:
      'Conectux transformó por completo nuestra estrategia de ventas. En 4 meses duplicamos el número de visitas médicas efectivas y reducimos el ciclo de venta un 35%. Su equipo entiende el lenguaje del sector salud, algo que otros proveedores simplemente no tienen.',
  },
  {
    name: 'Andrea Ríos',
    role: 'Gerente General',
    company: 'MedEquip Distribuciones',
    sector: 'Distribución de equipos médicos',
    avatar: 'AR',
    stars: 5,
    result: '5 nuevos mercados en 6 meses',
    comment:
      'Necesitábamos entrar a nuevos departamentos del país con nuestra línea de equipos hospitalarios. Conectux diseñó un plan de expansión comercial preciso y ejecutó con un equipo de alto nivel. Hoy estamos en 5 nuevos mercados y con contratos institucionales sólidos.',
  },
  {
    name: 'Dr. Felipe Torres',
    role: 'Director Médico',
    company: 'Clínica Especialistas del Norte',
    sector: 'Clínica privada',
    avatar: 'FT',
    stars: 5,
    result: '3x adquisición de pacientes',
    comment:
      'Triplicamos nuestra captación de pacientes nuevos en menos de 5 meses. Conectux entendió perfectamente la sensibilidad del sector salud y cómo comunicar sin perder la ética médica. Los resultados superaron todas nuestras expectativas.',
  },
  {
    name: 'Valentina Gómez',
    role: 'CEO',
    company: 'HealthTech Solutions',
    sector: 'Tecnología en salud',
    avatar: 'VG',
    stars: 5,
    result: '$2M USD en contratos B2B',
    comment:
      'Como startup de tecnología médica, necesitábamos un socio que supiera vender software a hospitales y aseguradoras. Conectux nos abrió puertas que no hubiéramos podido abrir solos. En un año cerramos más de 2 millones de dólares en contratos B2B.',
  },
  {
    name: 'Jhon Castillo',
    role: 'Gerente de Ventas',
    company: 'MediSalud Distribuciones',
    sector: 'Distribución de insumos médicos',
    avatar: 'JC',
    stars: 5,
    result: '-40% en ciclo de ventas',
    comment:
      'La integración de IA en nuestro proceso de ventas fue un cambio de juego. Ahora nuestro equipo sabe exactamente a quién llamar, cuándo y con qué argumento. El ciclo de venta bajó un 40% y cerramos más negocios con menos esfuerzo.',
  },
]
</script>

<template>
  <section ref="container" class="testimonials-section">
    <div class="test-blob-1" />
    <div class="test-blob-2" />

    <v-container>
      <v-row justify="center" class="mb-14">
        <v-col cols="12" md="8" class="text-center">
          <div class="reveal section-badge">
            <v-icon size="16">mdi-star-outline</v-icon>
            Casos de éxito
          </div>
          <h2 class="reveal d1 section-title">
            Resultados reales en el<br />
            <span class="gradient-text">Sector Salud</span>
          </h2>
          <p class="reveal d2 section-subtitle">
            Estas son las historias de empresas que confiaron en Conectux y transformaron
            sus números comerciales en el sector salud.
          </p>
        </v-col>
      </v-row>

      <div class="reveal d2">
        <Swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="24"
          :autoplay="{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }"
          :pagination="{ clickable: true }"
          :breakpoints="{
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }"
          class="testimonials-swiper"
        >
          <SwiperSlide
            v-for="(t, i) in testimonials"
            :key="i"
          >
            <div class="testimonial-card glass-card pa-7">
              <!-- Stars -->
              <div class="d-flex mb-4 gap-1">
                <v-icon
                  v-for="n in t.stars"
                  :key="n"
                  size="16"
                  color="#f59e0b"
                >mdi-star</v-icon>
              </div>

              <!-- Result badge -->
              <div class="result-badge mb-5">
                <v-icon size="14" color="#4ade80">mdi-trending-up</v-icon>
                {{ t.result }}
              </div>

              <!-- Quote -->
              <v-icon color="rgba(161,0,255,0.4)" size="32" class="mb-2">mdi-format-quote-open</v-icon>
              <p class="test-comment mb-6">{{ t.comment }}</p>

              <!-- Author -->
              <div class="d-flex align-center mt-auto" style="gap: 16px">
                <div class="test-avatar">{{ t.avatar }}</div>
                <div>
                  <div class="test-name">{{ t.name }}</div>
                  <div class="test-role">{{ t.role }}</div>
                  <div class="test-company">{{ t.company }}</div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </v-container>
  </section>
</template>

<style scoped>
.testimonials-section {
  position: relative;
  background: #09090f;
  padding: 100px 0 120px;
  overflow: hidden;
}
.test-blob-1 {
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(161, 0, 255, 0.08) 0%, transparent 65%);
  border-radius: 50%;
  filter: blur(60px);
  top: -100px;
  left: -100px;
  pointer-events: none;
}
.test-blob-2 {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 65%);
  border-radius: 50%;
  filter: blur(60px);
  bottom: 0;
  right: -80px;
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

.testimonials-swiper {
  padding-bottom: 52px !important;
}
:deep(.swiper-pagination-bullet) {
  background: rgba(161, 0, 255, 0.4) !important;
  opacity: 1 !important;
}
:deep(.swiper-pagination-bullet-active) {
  background: #a100ff !important;
  width: 24px !important;
  border-radius: 4px !important;
}

.testimonial-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 100px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 700;
  color: #4ade80;
}

.test-comment {
  font-size: 15px;
  color: rgba(200, 200, 220, 0.88);
  line-height: 1.8;
  font-style: italic;
  flex: 1;
}

.test-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a100ff, #7b00cc);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}
.test-name {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}
.test-role {
  font-size: 13px;
  color: rgba(160, 160, 184, 0.8);
  margin-top: 2px;
}
.test-company {
  font-size: 13px;
  color: #c84bff;
  font-weight: 600;
  margin-top: 2px;
}
</style>
