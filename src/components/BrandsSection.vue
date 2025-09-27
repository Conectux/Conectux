<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const brands = [
  { name: "Google", logo: "mdi-google" },
  { name: "Microsoft", logo: "mdi-microsoft" },
  { name: "Amazon", logo: "mdi-amazon" },
  { name: "Apple", logo: "mdi-apple" },
  { name: "Facebook", logo: "mdi-facebook" },
  { name: "Twitter", logo: "mdi-twitter" },
  { name: "Instagram", logo: "mdi-instagram" },
  { name: "LinkedIn", logo: "mdi-linkedin" },
];
</script>

<template>
  <v-container fluid class="brands-section py-16 bg-grey-lighten-4">
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
    <v-row>
      <v-col cols="12">
        <swiper
          :modules="[Autoplay]"
          :slides-per-view="5"
          :space-between="30"
          :autoplay="{
            delay: 2500,
            disableOnInteraction: false,
          }"
          :loop="true"
          :breakpoints="{
            '320': { slidesPerView: 2, spaceBetween: 20 },
            '480': { slidesPerView: 3, spaceBetween: 30 },
            '640': { slidesPerView: 4, spaceBetween: 40 },
            '1024': { slidesPerView: 5, spaceBetween: 50 },
          }"
        >
          <swiper-slide v-for="brand in brands" :key="brand.name">
            <v-card
              class="brand-card d-flex align-center justify-center pa-8"
              flat
            >
              <v-icon
                :icon="brand.logo"
                size="64"
                class="text-grey-darken-1"
              ></v-icon>
            </v-card>
          </swiper-slide>
        </swiper>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.brand-card {
  height: 150px;
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
