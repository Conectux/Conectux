<script setup>
import { ref } from 'vue'
import HeroSection from './components/HeroSection.vue'
import BrandsSection from './components/BrandsSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import BenefitsSection from './components/BenefitsSection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import ContactSection from './components/ContactSection.vue'

const drawer = ref(false)
const menuItems = [
  { title: 'Inicio', icon: 'mdi-home', target: 'hero' },
  { title: 'Servicios', icon: 'mdi-briefcase', target: 'services' },
  { title: 'Testimonios', icon: 'mdi-account-group', target: 'testimonials' },
  { title: 'Contacto', icon: 'mdi-email', target: 'contact' }
]

const scrollToSection = (target) => {
  const element = document.getElementById(target)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  drawer.value = false
}
</script>

<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
    >
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          class="mb-2 nav-item"
          @click="scrollToSection(item.target)"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      elevation="0"
      color="transparent"
      height="80"
      class="px-4 app-bar"
    >
      <v-app-bar-title class="font-weight-black">
        <span class="gradient-text">Digital</span>Agency
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div class="d-none d-md-flex align-center">
        <v-btn
          v-for="item in menuItems"
          :key="item.title"
          variant="text"
          class="nav-btn mx-2"
          @click="scrollToSection(item.target)"
        >
          {{ item.title }}
        </v-btn>

        <v-btn
          color="primary"
          class="ml-4 start-btn"
          elevation="0"
          @click="scrollToSection('contact')"
        >
          Empezar proyecto
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>

      <v-btn
        class="d-md-none"
        icon
        @click="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <div id="hero">
        <HeroSection />
      </div>
      <div id="brands">
        <BrandsSection />
      </div>
      <div id="services">
        <ServicesSection />
      </div>
      <div id="benefits">
        <BenefitsSection />
      </div>
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
      
      <v-footer class="bg-secondary py-16">
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <h3 class="text-h5 font-weight-black white--text mb-6">
                <span class="gradient-text">Digital</span>Agency
              </h3>
              <p class="text-body-1 grey--text">
                Transformando ideas en resultados digitales excepcionales. Tu socio estratégico en el mundo digital.
              </p>
              <div class="mt-6">
                <v-btn
                  v-for="icon in ['mdi-facebook', 'mdi-twitter', 'mdi-instagram', 'mdi-linkedin']"
                  :key="icon"
                  :icon="icon"
                  variant="text"
                  color="white"
                  class="mr-4 social-btn"
                ></v-btn>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <h4 class="text-h6 font-weight-bold white--text mb-6">Enlaces rápidos</h4>
              <v-list density="compact" bg-color="transparent" class="pa-0">
                <v-list-item
                  v-for="item in menuItems"
                  :key="item.title"
                  :title="item.title"
                  class="pa-0 white--text footer-link"
                  @click="scrollToSection(item.target)"
                ></v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="4">
              <h4 class="text-h6 font-weight-bold white--text mb-6">Contacto</h4>
              <v-list density="compact" bg-color="transparent" class="pa-0">
                <v-list-item prepend-icon="mdi-email" class="white--text mb-2">
                  info@digitalagency.com
                </v-list-item>
                <v-list-item prepend-icon="mdi-phone" class="white--text mb-2">
                  +34 900 123 456
                </v-list-item>
                <v-list-item prepend-icon="mdi-map-marker" class="white--text">
                  Madrid, España
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          <v-divider class="my-8 border-opacity-25"></v-divider>
          <v-row>
            <v-col cols="12" class="text-center">
              <p class="text-caption grey--text mb-0">
                © {{ new Date().getFullYear() }} DigitalAgency. Todos los derechos reservados.
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>

      <v-btn
        icon="mdi-whatsapp"
        color="#25D366"
        size="x-large"
        class="whatsapp-button"
        href="https://wa.me/34900123456"
        target="_blank"
      >
        <v-tooltip
          activator="parent"
          location="top"
        >
          Chatea con nosotros
        </v-tooltip>
      </v-btn>
    </v-main>
  </v-app>
</template>

<style>
:root {
  --primary-gradient: linear-gradient(45deg, #A100FF, #7B00FF);
  --hover-gradient: linear-gradient(45deg, #8A00FF, #6500FF);
}

.whatsapp-button {
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  z-index: 100 !important;
  transform: scale(1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3) !important;
}

.whatsapp-button:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4) !important;
}

.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-bar {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8) !important;
}

.nav-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.nav-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--primary-gradient);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
}

.nav-btn:hover {
  transform: translateY(-2px);
}

.nav-btn:hover::after {
  width: 100%;
}

.start-btn {
  background: var(--primary-gradient) !important;
  border-radius: 30px !important;
  padding: 0 32px !important;
  height: 48px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px;
  text-transform: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.start-btn:hover {
  background: var(--hover-gradient) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 15px rgba(161, 0, 255, 0.3) !important;
}

.social-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  opacity: 0.8;
}

.social-btn:hover {
  transform: translateY(-3px);
  opacity: 1;
  color: #A100FF !important;
}

.footer-link {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.footer-link:hover {
  color: #A100FF !important;
  transform: translateX(5px);
}

.nav-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.nav-item:hover {
  background: rgba(161, 0, 255, 0.1);
  transform: translateX(5px);
}

.v-btn {
  text-transform: none !important;
}
</style>