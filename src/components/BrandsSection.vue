<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { useReveal } from '../composables/useReveal'

const container = ref(null)
const { init } = useReveal()
onMounted(() => init(container.value))

const logoUrl = (n) =>
  new URL(`../assets/logos/logo-${String(n).padStart(2, '0')}.webp`, import.meta.url).href

const brands = Array.from({ length: 19 }, (_, i) => ({
  name: `Cliente ${i + 1}`,
  logo: logoUrl(i + 1),
}))
</script>

<template>
  <section ref="container" class="brands-section">
    <div class="brands-glow" />

    <v-container>
      <v-row justify="center" class="mb-14">
        <v-col cols="12" md="9" lg="8" class="text-center">
          <div class="reveal section-badge">
            <v-icon size="16">mdi-heart-pulse</v-icon>
            Nuestra historia
          </div>

          <h2 class="reveal d1 brands-title">
            Todos los caminos<br />
            <span class="gradient-text">nos llevaron a la salud</span>
          </h2>

          <p class="reveal d2 brands-text">
            Tenemos muchas historias por contar. Durante años trabajamos junto a empresas
            de distintos sectores — retail, tecnología, alimentos, hotelería — y en cada
            una de ellas aprendimos algo nuevo sobre cómo vender, conectar y crecer.
          </p>
          <p class="reveal d3 brands-text">
            Pero todos esos caminos nos guiaron al mismo destino: el mundo médico.
            Hoy somos referentes en ventas para el sector salud porque entendemos que
            detrás de cada producto farmacéutico, cada dispositivo médico y cada clínica,
            hay una persona que necesita atención, alivio o una segunda oportunidad.
          </p>
          <p class="reveal d4 brands-text brands-text--highlight">
            Ahora solo queremos una cosa: mejorar el mundo de la salud, conectando
            pacientes con consultorios, laboratorios con médicos y empresas con las
            personas que más los necesitan — para que todos puedan vivir de manera
            más tranquila, más sana y más plena.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Logo carousel — full width -->
    <div class="reveal d3 carousel-wrapper">
      <Swiper
        :modules="[Autoplay]"
        :loop="true"
        :space-between="28"
        :autoplay="{ delay: 1800, disableOnInteraction: false, pauseOnMouseEnter: true }"
        :speed="700"
        :loop-additional-slides="19"
        :breakpoints="{
          320: { slidesPerView: 2, spaceBetween: 14 },
          480: { slidesPerView: 3, spaceBetween: 18 },
          768: { slidesPerView: 4, spaceBetween: 22 },
          1024: { slidesPerView: 5, spaceBetween: 26 },
          1280: { slidesPerView: 6, spaceBetween: 28 },
        }"
      >
        <SwiperSlide v-for="brand in brands" :key="brand.name">
          <div class="logo-slide">
            <v-img
              :src="brand.logo"
              :alt="brand.name"
              max-height="80"
              contain
              class="logo-img"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Bottom line -->
    <v-container class="mt-10">
      <v-row justify="center">
        <v-col cols="12" class="text-center reveal d4">
          <div class="trust-line">
            <span class="trust-dot" />
            <span class="trust-text">Más de 6 años construyendo resultados reales</span>
            <span class="trust-dot" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.brands-section {
  position: relative;
  background: #0d0d1e;
  padding: 100px 0;
  overflow: hidden;
}
.brands-glow {
  position: absolute;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(161, 0, 255, 0.07) 0%, transparent 70%);
  pointer-events: none;
}

.brands-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.5px;
  margin-bottom: 28px;
}

.brands-text {
  font-size: 1.05rem;
  color: rgba(160, 160, 184, 0.85);
  line-height: 1.85;
  margin-bottom: 18px;
}

.brands-text--highlight {
  color: rgba(200, 200, 220, 0.95);
  font-style: italic;
  border-left: 3px solid rgba(161, 0, 255, 0.5);
  padding-left: 20px;
  text-align: left;
  margin-top: 8px;
}

.carousel-wrapper {
  padding: 10px 24px 40px;
  overflow: hidden;
}

.logo-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110px;
  padding: 20px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  transition: all 0.3s ease;
  filter: grayscale(1) brightness(1.8);
  opacity: 0.55;
  cursor: pointer;
}
.logo-slide:hover {
  filter: grayscale(0) brightness(1.1);
  opacity: 1;
  background: rgba(161, 0, 255, 0.07);
  border-color: rgba(161, 0, 255, 0.25);
  transform: translateY(-4px);
}

.trust-line {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: rgba(160, 160, 184, 0.6);
}
.trust-text {
  font-size: 14px;
}
.trust-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(161, 0, 255, 0.6);
  display: inline-block;
}
</style>
