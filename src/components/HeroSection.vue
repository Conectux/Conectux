<script setup>
const scrollToServices = () => {
  const element = document.getElementById("services");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const scrollToContact = () => {
  const element = document.getElementById("contact");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<template>
  <v-container fluid class="hero-section pa-0">
    <div class="hero-overlay"></div>
    <v-row align="center" justify="center" class="hero-content">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="text-h1 font-weight-black mb-6 text-white">
          Estrategia + Contenido + Pauta = Ventas reales para empresas en
          crecimiento
        </h1>
        <p class="text-h5 mb-12 text-white font-weight-light">
          Integramos marketing digital, redes, generación de leads y
          automatización para convertir interés en clientes.
        </p>
        <div class="d-flex justify-center gap-4">
          <v-btn
            color="primary"
            size="x-large"
            :href="'https://wa.me/573242947897'"
            target="_blank"
            class="hero-btn primary-btn mx-2"
          >
            Cotiza tu proyecto
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn
            variant="outlined"
            color="white"
            size="x-large"
            class="hero-btn secondary-btn mx-2"
            @click="scrollToServices"
          >
            Explorar servicios
            <v-icon end>mdi-chevron-down</v-icon>
          </v-btn>
        </div>
        <div class="mt-16">
          <v-scroll-x-transition>
            <v-icon
              color="white"
              size="48"
              class="scroll-icon"
              @click="scrollToServices"
            >
              mdi-chevron-down
            </v-icon>
          </v-scroll-x-transition>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.hero-section {
  min-height: 100vh;
  position: relative;
  background: url("/hero-bg.jpg") center/cover no-repeat;
  display: flex;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(161, 0, 255, 0.4) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-btn {
  min-width: 200px !important;
  height: 56px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  text-transform: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.primary-btn {
  background: linear-gradient(45deg, #a100ff, #7b00ff) !important;
  border-radius: 30px !important;
  box-shadow: 0 4px 15px rgba(161, 0, 255, 0.3) !important;
}

.primary-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(161, 0, 255, 0.4) !important;
}

.secondary-btn {
  border-radius: 30px !important;
  border: 2px solid white !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px) !important;
}

.scroll-icon {
  animation: bounce 2s infinite;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.scroll-icon:hover {
  opacity: 1;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}
</style>
