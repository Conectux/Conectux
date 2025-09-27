<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// Genera la ruta absoluta del logo N (logo-01.webp ... logo-19.webp)
const logoUrl = (n: number) =>
  new URL(
    `../assets/logos/logo-${String(n).padStart(2, "0")}.webp`,
    import.meta.url
  ).href;

// Array de 19 marcas (evita 19 imports manuales)
const brands = Array.from({ length: 19 }, (_, i) => {
  const idx = i + 1;
  return { name: `Marca ${idx}`, logo: logoUrl(idx) };
});
</script>

<template>
  <v-container fluid class="brands-section pa-10 bg-grey-lighten-4">
    <!-- Títulos -->
    <v-row justify="center" class="mb-12">
      <v-col cols="12" class="text-center">
        <h2 class="text-h3 font-weight-bold mb-3">
          <span class="text-color">+30</span> empresas atendidas en Colombia,
          LATAM y Estados Unidos
        </h2>
        <p class="text-h5 text-grey-darken-1 text-color">
          Más de 7 años generando resultados
        </p>
      </v-col>
    </v-row>

    <!-- Slider de logos -->
    <v-row>
      <v-col cols="12">
        <swiper
          :modules="[Autoplay]"
          :loop="true"
          :slides-per-view="6"
          :space-between="32"
          :autoplay="{
            delay: 1500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }"
          :speed="600"
          :loop-additional-slides="19"
          :breakpoints="{
            320: { slidesPerView: 2, spaceBetween: 12 },
            480: { slidesPerView: 3, spaceBetween: 16 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            1024: { slidesPerView: 6, spaceBetween: 28 },
            1280: { slidesPerView: 7, spaceBetween: 32 },
          }"
        >
          <swiper-slide v-for="brand in brands" :key="brand.name">
            <v-card
              class="brand-card d-flex align-center justify-center"
              container
              flat
            >
              <v-img :src="brand.logo" :alt="brand.name" min-width="200px" />
            </v-card>
          </swiper-slide>
        </swiper>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.brand-card {
  height: 120px;
  transition: all 0.3s ease;
  background: transparent !important;
}
.brand-card:hover {
  transform: scale(1.05);
}
.text-color {
  color: #a100ff !important;
}
</style>
