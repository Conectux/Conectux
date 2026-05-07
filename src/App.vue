<script setup>
import { ref } from 'vue'
import HeroSection from './components/HeroSection.vue'
import StatsSection from './components/StatsSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import AISection from './components/AISection.vue'
import MethodologySection from './components/MethodologySection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import BrandsSection from './components/BrandsSection.vue'
import HistorySection from './components/HistorySection.vue'
import logo from './assets/logo-conectux.png'

const drawer = ref(false)
const menuItems = [
  { title: 'Inicio', icon: 'mdi-home', target: 'hero' },
  { title: 'Servicios', icon: 'mdi-briefcase', target: 'services' },
  { title: 'Nuestro Sistema', icon: 'mdi-cog-outline', target: 'methodology' },
  { title: 'Clientes', icon: 'mdi-account-group', target: 'testimonials' },
  { title: 'Nosotros', icon: 'mdi-information-outline', target: 'history' },
]

const scrollToSection = (target) => {
  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
  drawer.value = false
}
</script>

<template>
  <v-app>
    <!-- Mobile Drawer -->
    <v-navigation-drawer v-model="drawer" temporary location="right" class="mobile-drawer">
      <div class="pa-6">
        <v-img :src="logo" alt="Conectux" max-width="150" contain class="mb-8 logo-white" />
        <v-list class="pa-0">
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :prepend-icon="item.icon"
            :title="item.title"
            class="mb-1 nav-item rounded-lg"
            @click="scrollToSection(item.target)"
          />
        </v-list>
        <v-btn
          block
          class="mt-8 cta-btn"
          href="https://wa.me/573242947897"
          target="_blank"
        >
          <v-icon start>mdi-calendar-check</v-icon>
          Agendar llamada
        </v-btn>
      </div>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar elevation="0" color="transparent" height="80" class="px-4 app-bar">
      <v-app-bar-title>
        <v-img :src="logo" alt="Conectux" max-width="170" contain class="logo-white" />
      </v-app-bar-title>
      <v-spacer />
      <div class="d-none d-md-flex align-center">
        <v-btn
          v-for="item in menuItems"
          :key="item.title"
          variant="text"
          class="nav-btn mx-1"
          @click="scrollToSection(item.target)"
        >{{ item.title }}</v-btn>
        <v-btn
          class="ml-4 cta-btn"
          href="https://wa.me/573242947897"
          target="_blank"
        >
          <v-icon start size="18">mdi-calendar-check</v-icon>
          Agendar llamada
        </v-btn>
      </div>
      <v-btn class="d-md-none" icon variant="text" color="white" @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <div id="hero"><HeroSection /></div>
      <div id="stats"><StatsSection /></div>
      <div id="services"><ServicesSection /></div>
      <div id="ai"><AISection /></div>
      <div id="methodology"><MethodologySection /></div>
      <div id="testimonials"><TestimonialsSection /></div>
      <div id="brands"><BrandsSection /></div>
      <div id="history"><HistorySection /></div>

      <!-- Footer -->
      <footer class="site-footer">
        <div class="footer-glow" />
        <v-container class="py-16">
          <v-row>
            <v-col cols="12" md="4" class="mb-10 mb-md-0">
              <v-img :src="logo" alt="Conectux" max-width="170" contain class="mb-6 logo-white" />
              <p class="footer-desc mb-6">
                Especialistas en ventas para el sector salud. Más de 6 años generando resultados
                reales con metodología comprobada e inteligencia artificial.
              </p>
              <div class="d-flex gap-3">
                <a
                  v-for="s in ['mdi-facebook', 'mdi-instagram', 'mdi-linkedin']"
                  :key="s"
                  href="#"
                  class="social-icon"
                >
                  <v-icon size="18" color="white">{{ s }}</v-icon>
                </a>
              </div>
            </v-col>

            <v-col cols="6" md="2" offset-md="1" class="mb-8 mb-md-0">
              <h4 class="footer-title mb-5">Navegación</h4>
              <div
                v-for="item in menuItems"
                :key="item.title"
                class="footer-link mb-3"
                @click="scrollToSection(item.target)"
              >{{ item.title }}</div>
            </v-col>

            <v-col cols="6" md="2" class="mb-8 mb-md-0">
              <h4 class="footer-title mb-5">Servicios</h4>
              <div
                v-for="s in ['Outsourcing Comercial', 'Generación de Leads', 'Marketing para Salud', 'IA para Ventas', 'CRM & Automatización']"
                :key="s"
                class="footer-link mb-3"
              >{{ s }}</div>
            </v-col>

            <v-col cols="12" md="3">
              <h4 class="footer-title mb-5">Contacto</h4>
              <div class="d-flex align-center mb-4 footer-desc" style="gap:10px">
                <v-icon size="16" color="#a100ff">mdi-email-outline</v-icon>
                conectuxdigital@gmail.com
              </div>
              <div class="d-flex align-center mb-4 footer-desc" style="gap:10px">
                <v-icon size="16" color="#a100ff">mdi-whatsapp</v-icon>
                +57 324 294 7897
              </div>
              <div class="d-flex align-center mb-7 footer-desc" style="gap:10px">
                <v-icon size="16" color="#a100ff">mdi-map-marker-outline</v-icon>
                Colombia · LATAM · USA
              </div>
              <v-btn
                class="cta-btn"
                href="https://wa.me/573242947897"
                target="_blank"
                size="small"
              >
                Hablar con un asesor
              </v-btn>
            </v-col>
          </v-row>

          <div class="footer-divider my-10" />

          <v-row align="center">
            <v-col cols="12" md="6">
              <p class="footer-copy">© {{ new Date().getFullYear() }} Conectux LLC · Todos los derechos reservados.</p>
            </v-col>
            <v-col cols="12" md="6" class="text-md-right">
              <p class="footer-copy">Especialistas en Ventas para el Sector Salud</p>
            </v-col>
          </v-row>
        </v-container>
      </footer>

      <!-- WhatsApp FAB -->
      <v-btn
        icon
        color="#25D366"
        size="x-large"
        class="whatsapp-button"
        href="https://wa.me/573242947897"
        target="_blank"
      >
        <v-tooltip activator="parent" location="start">Chatea con nosotros</v-tooltip>
        <v-icon size="x-large" color="white">mdi-whatsapp</v-icon>
      </v-btn>
    </v-main>
  </v-app>
</template>

<style>
/* ─── App Bar ──────────────────────────────────── */
.app-bar {
  backdrop-filter: blur(20px) !important;
  background: rgba(9, 9, 15, 0.8) !important;
  border-bottom: 1px solid rgba(161, 0, 255, 0.1) !important;
  transition: all 0.3s ease !important;
}

.logo-white {
  filter: brightness(0) invert(1);
}

.nav-btn {
  position: relative;
  color: rgba(255, 255, 255, 0.75) !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  text-transform: none !important;
  letter-spacing: 0.2px !important;
  transition: color 0.3s ease !important;
}
.nav-btn::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #a100ff, #c84bff);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
}
.nav-btn:hover {
  color: #ffffff !important;
}
.nav-btn:hover::after {
  width: 80%;
}

/* ─── Mobile drawer ────────────────────────────── */
.mobile-drawer {
  background: #0d0d1e !important;
  border-right: 1px solid rgba(161, 0, 255, 0.15) !important;
}
.mobile-drawer .nav-item {
  color: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.25s ease !important;
}
.mobile-drawer .nav-item:hover {
  background: rgba(161, 0, 255, 0.1) !important;
  color: #fff !important;
}

/* ─── Footer ───────────────────────────────────── */
.site-footer {
  position: relative;
  background: #060610;
  border-top: 1px solid rgba(161, 0, 255, 0.1);
  overflow: hidden;
}
.footer-glow {
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(161, 0, 255, 0.06) 0%, transparent 70%);
  pointer-events: none;
}
.footer-title {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.footer-desc {
  color: rgba(160, 160, 184, 0.85);
  font-size: 14px;
  line-height: 1.7;
}
.footer-link {
  color: rgba(160, 160, 184, 0.75);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.footer-link:hover {
  color: #c84bff;
  padding-left: 4px;
}
.footer-copy {
  color: rgba(90, 90, 120, 0.9);
  font-size: 13px;
  margin: 0;
}
.footer-divider {
  border: none;
  border-top: 1px solid rgba(161, 0, 255, 0.1);
}
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(161, 0, 255, 0.1);
  border: 1px solid rgba(161, 0, 255, 0.2);
  text-decoration: none;
  transition: all 0.3s ease;
}
.social-icon:hover {
  background: rgba(161, 0, 255, 0.25);
  border-color: rgba(161, 0, 255, 0.5);
  transform: translateY(-3px);
}

/* ─── WhatsApp button ──────────────────────────── */
.whatsapp-button {
  position: fixed !important;
  bottom: 24px !important;
  right: 24px !important;
  z-index: 999 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.35) !important;
}
.whatsapp-button:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 6px 28px rgba(37, 211, 102, 0.5) !important;
}

/* ─── Section wrappers — sin gaps ─────────────── */
#hero, #stats, #services, #ai, #methodology,
#testimonials, #brands, #history {
  display: block;
  margin: 0;
  padding: 0;
  line-height: 0;        /* colapsa cualquier espacio inline */
}
#hero > *, #stats > *, #services > *, #ai > *,
#methodology > *, #testimonials > *, #brands > *,
#history > * {
  line-height: normal;   /* restaura line-height en el hijo directo */
}

/* Evita que v-main inyecte background de tema claro */
.v-main,
.v-main__wrap {
  background-color: #09090f !important;
  overflow-x: hidden;
}

/* ─── Footer textos ────────────────────────────── */
.footer-title {
  font-size: 13px !important;
}
.footer-desc {
  font-size: 14.5px !important;
  line-height: 1.75 !important;
}
.footer-link {
  font-size: 14.5px !important;
}
.footer-copy {
  font-size: 13.5px !important;
}

/* ─── Global Vuetify overrides ─────────────────── */
.v-btn {
  text-transform: none !important;
}
</style>
