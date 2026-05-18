<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useReveal } from '../composables/useReveal'
import LangSwitcher from '../components/LangSwitcher.vue'
import logo from '../assets/logo-conectux.png'

// ── Nav ──────────────────────────────────────────────
const drawer = ref(false)
const menuItems = [
  { title: 'Inicio',       icon: 'mdi-home',             target: 'hero' },
  { title: 'Servicios',    icon: 'mdi-briefcase',        target: 'services' },
  { title: 'Nuestro Sistema', icon: 'mdi-cog-outline',   target: 'methodology' },
  { title: 'Casos de éxito', icon: 'mdi-account-group',  target: 'testimonials' },
  { title: 'Nosotros',     icon: 'mdi-information-outline', target: 'history' },
]
const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  drawer.value = false
}

// ── Hero counters ─────────────────────────────────────
const heroCounters = ref([
  { label: 'Años de experiencia',      value: 0, target: 6,   suffix: '+', prefix: '' },
  { label: 'Empresas impulsadas',      value: 0, target: 100, suffix: '+', prefix: '' },
  { label: 'ROI promedio documentado', value: 0, target: 300, suffix: '%', prefix: '+' },
])

const animateCounter = (c) => {
  const duration = 2200
  const start = Date.now()
  const tick = () => {
    const elapsed = Date.now() - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    c.value = Math.round(eased * c.target)
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// ── Stat cards ────────────────────────────────────────
const stats = ref([
  { value: 0, target: 6,   suffix: '+',  label: 'Años de trayectoria',        icon: 'mdi-calendar-star',       color: '#a100ff' },
  { value: 0, target: 100, suffix: '+',  label: 'Empresas impulsadas',         icon: 'mdi-domain',              color: '#c84bff' },
  { value: 0, target: 12,  suffix: '+',  label: 'Industrias atendidas',        icon: 'mdi-shape-outline',       color: '#00d4ff' },
  { value: 0, target: 300, suffix: '%',  label: 'ROI promedio documentado',    icon: 'mdi-trending-up',         color: '#a100ff' },
])

// ── Services ──────────────────────────────────────────
const services = [
  {
    icon: 'mdi-account-tie',
    title: 'Outsourcing Comercial',
    description: 'Ponemos a tu disposición un equipo de asesores de alto nivel, listos para abrir mercado y cerrar ventas desde el primer mes, adaptados a tu industria y contexto.',
    tags: ['Fuerza de ventas', 'B2B & B2C', 'Resultados desde mes 1'],
    color: '#a100ff',
  },
  {
    icon: 'mdi-target-account',
    title: 'Generación de Leads Calificados',
    description: 'Identificamos y pre-calificamos prospectos con necesidades reales, adaptando nuestra metodología a las particularidades de cada sector y tipo de cliente.',
    tags: ['Prospección activa', 'Base de datos segmentada', 'Lead scoring'],
    color: '#c84bff',
  },
  {
    icon: 'mdi-bullhorn-outline',
    title: 'Marketing Digital Estratégico',
    description: 'Campañas de pauta y contenido diseñadas para tu audiencia objetivo, generando autoridad de marca y consultas calificadas en el canal correcto.',
    tags: ['Meta Ads', 'Google Ads', 'Contenido especializado'],
    color: '#a100ff',
  },
  {
    icon: 'mdi-robot',
    title: 'IA para el Proceso de Ventas',
    description: 'Automatizamos y potenciamos tu ciclo comercial con inteligencia artificial, reduciendo tiempos y aumentando conversiones en cada etapa del embudo.',
    tags: ['Automatización', 'Chatbots IA', 'Seguimiento inteligente'],
    color: '#00d4ff',
  },
  {
    icon: 'mdi-chart-timeline-variant',
    title: 'CRM & Automatización',
    description: 'Implementamos tu CRM para que ningún lead se pierda. Pipeline claro, seguimientos automáticos y reportes en tiempo real adaptados a tu proceso de venta.',
    tags: ['Pipeline', 'Reportes', 'Seguimiento automático'],
    color: '#c84bff',
  },
  {
    icon: 'mdi-school',
    title: 'Capacitación Comercial',
    description: 'Entrenamos a tu equipo en técnicas de venta especializadas: manejo de objeciones, negociación, técnicas de cierre y comunicación de valor diferenciado.',
    tags: ['Técnicas de cierre', 'Negociación', 'Formación in-house'],
    color: '#a100ff',
  },
]

// ── AI features ───────────────────────────────────────
const aiFeatures = [
  {
    icon: 'mdi-account-search',
    title: 'Prospección inteligente',
    desc: 'La IA identifica y califica automáticamente los mejores prospectos basándose en patrones de compra y perfil ideal de cliente para tu sector.',
  },
  {
    icon: 'mdi-email-fast',
    title: 'Seguimiento automatizado',
    desc: 'Secuencias de contacto personalizadas que se disparan en el momento preciso, manteniendo tu pipeline siempre activo sin esfuerzo manual.',
  },
  {
    icon: 'mdi-chart-bell-curve-cumulative',
    title: 'Análisis predictivo',
    desc: 'Predecimos qué prospectos tienen más probabilidad de cerrar y en qué momento, optimizando el tiempo y energía de tu equipo comercial.',
  },
  {
    icon: 'mdi-chat-processing',
    title: 'Chatbots especializados',
    desc: 'Asistentes virtuales entrenados con el lenguaje y lógica de tu industria, que pre-califican leads 24/7 antes de pasarlos a tu equipo.',
  },
  {
    icon: 'mdi-gauge',
    title: 'Dashboards en tiempo real',
    desc: 'Visibilidad total de tu proceso comercial: métricas, conversiones y ROI actualizados en tiempo real para tomar decisiones rápidas y basadas en datos.',
  },
  {
    icon: 'mdi-robot-happy',
    title: 'Optimización continua',
    desc: 'La IA aprende de cada interacción y mejora continuamente los mensajes, tiempos y canales más efectivos para tu negocio y audiencia.',
  },
]

// ── Methodology ───────────────────────────────────────
const steps = [
  {
    number: '01',
    icon: 'mdi-magnify',
    title: 'Diagnóstico Comercial',
    description: 'Analizamos en profundidad tu situación actual: equipo de ventas, mercado objetivo, competencia, propuesta de valor y procesos comerciales. Identificamos brechas y oportunidades específicas de tu negocio.',
    outcomes: ['Mapa de oportunidades', 'Análisis de competencia', 'Perfil del cliente ideal'],
  },
  {
    number: '02',
    icon: 'mdi-map-outline',
    title: 'Estrategia a la Medida',
    description: 'Diseñamos un plan comercial específico para tu empresa y sector: canales de venta, mensajes clave, propuesta de valor diferenciada y el mix de herramientas IA que maximizará tus resultados.',
    outcomes: ['Plan comercial 90 días', 'Scripts de ventas', 'Embudo personalizado'],
  },
  {
    number: '03',
    icon: 'mdi-rocket-launch',
    title: 'Ejecución con Equipo Experto',
    description: 'Implementamos el plan con un equipo de alto nivel. Activamos la IA, ejecutamos las campañas y acompañamos cada cierre de negocio con supervisión continua y reportes semanales.',
    outcomes: ['Equipo activo desde semana 1', 'IA integrada', 'Reportes semanales'],
  },
  {
    number: '04',
    icon: 'mdi-trending-up',
    title: 'Optimización y Escala',
    description: 'Medimos cada métrica, aprendemos de los datos y escalamos lo que funciona. Nuestro ciclo de mejora continua garantiza que los resultados crezcan mes a mes con tu negocio.',
    outcomes: ['KPIs en tiempo real', 'Ajustes mensuales', 'Plan de escalabilidad'],
  },
]

// ── Testimonials ──────────────────────────────────────
const testimonials = [
  {
    name: 'María Fernández',
    role: 'CEO',
    company: 'TechCorp Solutions',
    sector: 'Tecnología B2B',
    avatar: 'MF',
    stars: 5,
    result: '+220% en cierres B2B',
    comment: 'Conectux entendió rápidamente nuestro modelo de negocio y diseñó una estrategia comercial que duplicó nuestros cierres en menos de 6 meses. Su enfoque sistemático y el uso de IA marcaron una diferencia enorme en nuestra tasa de conversión.',
  },
  {
    name: 'Roberto Salinas',
    role: 'Director Comercial',
    company: 'Constructora Alfa',
    sector: 'Construcción & Infraestructura',
    avatar: 'RS',
    stars: 5,
    result: '3 contratos institucionales nuevos',
    comment: 'Necesitábamos penetrar el mercado institucional con nuestros proyectos de obra. Conectux nos armó una fuerza comercial especializada en licitaciones y negocios B2G. En 4 meses cerramos 3 contratos que solos no hubiéramos podido conseguir.',
  },
  {
    name: 'Laura Vásquez',
    role: 'Gerente de Ventas',
    company: 'FoodTech Colombia',
    sector: 'Industria Alimentaria',
    avatar: 'LV',
    stars: 5,
    result: '+150% distribuidores activos',
    comment: 'Crecimos nuestra red de distribuidores un 150% en un año. Conectux nos ayudó a identificar los canales correctos, estandarizar el discurso de ventas y automatizar el seguimiento con IA. Hoy nuestro equipo comercial es completamente diferente.',
  },
  {
    name: 'Diego Morales',
    role: 'CEO',
    company: 'EduTech LATAM',
    sector: 'Educación en línea',
    avatar: 'DM',
    stars: 5,
    result: '$1.5M USD en contratos B2B',
    comment: 'Como plataforma educativa queríamos vender a empresas, no solo a personas. Conectux diseñó toda nuestra estrategia de ventas B2B corporativo. En menos de un año cerramos más de 1.5 millones de dólares en contratos con grandes empresas de LATAM.',
  },
  {
    name: 'Carolina López',
    role: 'COO',
    company: 'LogiPrime',
    sector: 'Logística & Transporte',
    avatar: 'CL',
    stars: 5,
    result: '2x revenue en primer año',
    comment: 'Duplicamos nuestros ingresos en el primer año de trabajo con Conectux. Transformaron completamente nuestra operación comercial: prospección, seguimiento, cierre y posventa. El sistema de IA nos permite saber exactamente dónde está cada oportunidad en tiempo real.',
  },
]

// ── Industries served ─────────────────────────────────
const industries = [
  { icon: 'mdi-medical-bag',         label: 'Salud' },
  { icon: 'mdi-laptop',              label: 'Tecnología' },
  { icon: 'mdi-domain',              label: 'Construcción' },
  { icon: 'mdi-food-apple',          label: 'Alimentos' },
  { icon: 'mdi-school',              label: 'Educación' },
  { icon: 'mdi-store',               label: 'Retail' },
  { icon: 'mdi-truck-outline',       label: 'Logística' },
  { icon: 'mdi-bank-outline',        label: 'Finanzas' },
  { icon: 'mdi-hotel',               label: 'Hotelería' },
  { icon: 'mdi-factory',             label: 'Manufactura' },
  { icon: 'mdi-leaf',                label: 'Agro' },
  { icon: 'mdi-car-outline',         label: 'Automotriz' },
]

// ── History milestones ────────────────────────────────
const milestones = [
  {
    year: '2018',
    icon: 'mdi-flag-outline',
    title: 'El comienzo',
    desc: 'Conectux nació en Medellín con una idea clara: ayudar a las empresas a vender mejor. Empezamos pequeños, aprendiendo de cada sector, de cada cliente y de cada ciclo de venta.',
    color: '#a100ff',
  },
  {
    year: '2019',
    icon: 'mdi-briefcase-outline',
    title: 'Primeros clientes, primeras industrias',
    desc: 'Trabajamos con empresas de retail, tecnología, servicios y alimentos. En cada proyecto aprendimos algo nuevo sobre procesos comerciales, comunicación efectiva y generación de resultados.',
    color: '#c84bff',
  },
  {
    year: '2021',
    icon: 'mdi-lightbulb-outline',
    title: 'Un sistema que funciona en cualquier industria',
    desc: 'Después de cientos de ciclos de venta en múltiples sectores, consolidamos una metodología probada que se adapta a cualquier industria, tamaño de empresa y mercado objetivo.',
    color: '#a100ff',
  },
  {
    year: '2022',
    icon: 'mdi-earth',
    title: 'Conectux LLC',
    desc: 'Formalizamos nuestra estructura como Conectux LLC con la mirada puesta en Colombia, LATAM y el mercado de habla hispana en Estados Unidos.',
    color: '#c84bff',
  },
  {
    year: '2024',
    icon: 'mdi-robot',
    title: 'Inteligencia Artificial integrada',
    desc: 'Incorporamos IA en nuestros procesos: automatización de seguimientos, análisis predictivo de prospectos y asistentes virtuales entrenados para el lenguaje comercial de cada industria.',
    color: '#00d4ff',
  },
  {
    year: '2025',
    icon: 'mdi-chart-line',
    title: 'Portafolio multi-sector',
    desc: 'Hoy acompañamos a más de 100 empresas de 12+ industrias. Nuestra propuesta es clara: llevamos ventas reales a cualquier empresa que quiera crecer con método, tecnología y un equipo de alto nivel.',
    color: '#a100ff',
  },
]

const values = [
  { icon: 'mdi-shield-check', title: 'Adaptabilidad', desc: 'Entendemos tu sector y diseñamos todo desde cero para tu negocio.' },
  { icon: 'mdi-chart-line',   title: 'Resultados',    desc: 'Medimos todo. Si no hay resultados, no hay excusas.' },
  { icon: 'mdi-robot-happy',  title: 'Innovación',    desc: 'IA y tecnología al servicio de las ventas, en cualquier industria.' },
  { icon: 'mdi-handshake',    title: 'Alianza',       desc: 'No somos proveedores, somos parte de tu equipo comercial.' },
]

// ── Lifecycle ─────────────────────────────────────────
const heroRef   = ref(null)
const statsRef  = ref(null)
const servicesRef = ref(null)
const aiRef     = ref(null)
const methodRef = ref(null)
const testRef   = ref(null)
const industRef = ref(null)
const histRef   = ref(null)

const { init: initStats }  = useReveal()
const { init: initServs }  = useReveal()
const { init: initAI }     = useReveal()
const { init: initMeth }   = useReveal()
const { init: initTest }   = useReveal()
const { init: initIndust }  = useReveal()
const { init: initHist }   = useReveal()

const animateStats = (stat) => {
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
  initStats(statsRef.value)
  initServs(servicesRef.value)
  initAI(aiRef.value)
  initMeth(methodRef.value)
  initTest(testRef.value)
  initIndust(industRef.value)
  initHist(histRef.value)

  // Hero counters
  const heroObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => heroCounters.value.forEach(animateCounter), 400)
        heroObs.disconnect()
      }
    },
    { threshold: 0.3 }
  )
  if (heroRef.value) heroObs.observe(heroRef.value)

  // Stats counters
  const statsObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        stats.value.forEach(animateStats)
        statsObs.disconnect()
      }
    },
    { threshold: 0.4 }
  )
  if (statsRef.value) statsObs.observe(statsRef.value)
})

const swiperModules = [Autoplay, Pagination]
</script>

<template>
  <v-app>
    <!-- ── Mobile Drawer ─────────────────────────── -->
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
            @click="scrollTo(item.target)"
          />
        </v-list>
        <v-btn block class="mt-8 cta-btn" href="https://wa.me/573147101116" target="_blank">
          <v-icon start>mdi-calendar-check</v-icon>
          Agendar llamada
        </v-btn>
      </div>
    </v-navigation-drawer>

    <!-- ── App Bar ────────────────────────────────── -->
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
          @click="scrollTo(item.target)"
        >{{ item.title }}</v-btn>
        <LangSwitcher class="mx-3" />
        <v-btn class="ml-2 login-btn" href="https://app.conectux.com/" target="_blank">
          <v-icon start size="16">mdi-login</v-icon>
          Iniciar sesión
        </v-btn>
        <v-btn class="ml-3 cta-btn" href="https://wa.me/573147101116" target="_blank">
          <v-icon start size="18">mdi-calendar-check</v-icon>
          Agendar llamada
        </v-btn>
      </div>
      <v-btn class="d-md-none" icon variant="text" color="white" @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>

      <!-- ════════════════════════════════════════════ -->
      <!-- HERO                                        -->
      <!-- ════════════════════════════════════════════ -->
      <section id="hero" ref="heroRef" class="hero-section">
        <div class="blob blob-1" />
        <div class="blob blob-2" />
        <div class="blob blob-3" />
        <div class="hero-grid" />

        <v-container class="hero-container">
          <v-row justify="center">
            <v-col cols="12" md="10" lg="8" class="text-center hero-content">

              <div class="section-badge mx-auto">
                <v-icon size="16">mdi-shape-outline</v-icon>
                Estrategia Comercial para Tu Industria
              </div>

              <h1 class="hero-title">
                Hacemos crecer tus ventas<br />
                <span class="gradient-text">en cualquier industria</span><br />
                con resultados reales
              </h1>

              <p class="hero-subtitle mx-auto">
                Más de <strong>6 años</strong> con un sistema comercial comprobado,
                potenciado con <strong>Inteligencia Artificial</strong>. Generamos ventas
                reales para empresas de tecnología, retail, construcción, alimentos,
                educación, logística y más — en Colombia, LATAM y USA.
              </p>

              <div class="hero-ctas d-flex flex-wrap justify-center mt-10">
                <v-btn
                  class="hero-cta-primary ma-2"
                  href="https://wa.me/573147101116"
                  target="_blank"
                  size="large"
                >
                  <v-icon start>mdi-calendar-check</v-icon>
                  Agendar diagnóstico gratuito
                </v-btn>
                <v-btn
                  class="hero-cta-secondary ma-2"
                  size="large"
                  @click="scrollTo('methodology')"
                >
                  Ver nuestro sistema
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </div>

              <div class="hero-counters mt-14 mx-auto">
                <div v-for="(c, i) in heroCounters" :key="i" class="hero-counter">
                  <span class="counter-number">{{ c.prefix }}{{ c.value }}{{ c.suffix }}</span>
                  <span class="counter-label">{{ c.label }}</span>
                </div>
              </div>

            </v-col>
          </v-row>
        </v-container>

        <div class="scroll-indicator" @click="scrollTo('stats')">
          <v-icon color="rgba(255,255,255,0.35)" size="30">mdi-chevron-down</v-icon>
        </div>
      </section>

      <!-- ════════════════════════════════════════════ -->
      <!-- STATS                                       -->
      <!-- ════════════════════════════════════════════ -->
      <section id="stats" ref="statsRef" class="stats-section">
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
                <div class="stat-icon-wrap">
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

      <!-- ════════════════════════════════════════════ -->
      <!-- SERVICES                                    -->
      <!-- ════════════════════════════════════════════ -->
      <section id="services" ref="servicesRef" class="services-section">
        <div class="blob-services" />
        <v-container>
          <v-row justify="center" class="mb-14">
            <v-col cols="12" md="8" class="text-center">
              <div class="reveal section-badge">
                <v-icon size="16">mdi-briefcase-outline</v-icon>
                Lo que hacemos
              </div>
              <h2 class="reveal d1 section-title">
                Servicios diseñados para<br />
                <span class="gradient-text">cualquier industria</span>
              </h2>
              <p class="reveal d2 section-subtitle">
                No somos una agencia genérica: adaptamos cada servicio al lenguaje, los ciclos
                y los compradores de tu sector. El mismo sistema que funciona en salud, funciona
                en tecnología, retail, construcción y más.
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
                  <span v-for="tag in s.tags" :key="tag" class="service-tag">{{ tag }}</span>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row justify="center" class="mt-14">
            <v-col cols="12" class="text-center reveal">
              <p class="cta-sub mb-6">¿Tu industria no aparece en la lista? No importa — si vendes, podemos ayudarte.</p>
              <v-btn class="cta-btn" size="large" href="https://wa.me/573147101116" target="_blank">
                <v-icon start>mdi-whatsapp</v-icon>
                Hablar con un especialista
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ════════════════════════════════════════════ -->
      <!-- AI                                          -->
      <!-- ════════════════════════════════════════════ -->
      <section id="ai" ref="aiRef" class="ai-section">
        <div class="ai-blob-1" />
        <div class="ai-blob-2" />

        <v-container>
          <v-row align="center">
            <v-col cols="12" lg="5" class="pr-lg-10 mb-12 mb-lg-0">
              <div class="reveal-left section-badge">
                <v-icon size="16">mdi-robot-outline</v-icon>
                Inteligencia Artificial
              </div>

              <h2 class="reveal-left d1 section-title">
                Potenciamos tus ventas con<br />
                <span class="gradient-text-ai">Inteligencia Artificial</span>
              </h2>

              <p class="reveal-left d2 section-subtitle mb-8">
                Somos pioneros en la integración de IA dentro del proceso comercial.
                Nuestras herramientas automatizan tareas repetitivas y permiten a tu
                equipo enfocarse en lo que realmente importa: <strong>cerrar negocios.</strong>
              </p>

              <div class="ai-highlight reveal-left d3">
                <v-icon color="#00d4ff" size="20" class="mr-3">mdi-lightning-bolt</v-icon>
                <div>
                  <div class="highlight-title">Resultado promedio con IA</div>
                  <div class="highlight-desc">Reducción del 40% en el ciclo de ventas y +65% en tasa de respuesta de prospectos.</div>
                </div>
              </div>

              <v-btn class="mt-8 cta-btn reveal-left d4" href="https://wa.me/573147101116" target="_blank">
                <v-icon start>mdi-robot</v-icon>
                Ver cómo funciona la IA
              </v-btn>
            </v-col>

            <v-col cols="12" lg="7">
              <v-row>
                <v-col
                  v-for="(f, i) in aiFeatures"
                  :key="i"
                  cols="12"
                  sm="6"
                  class="reveal"
                  :class="`d${(i % 2) + 1}`"
                >
                  <div class="ai-feature-card glass-card pa-6">
                    <div class="d-flex align-start" style="gap: 16px">
                      <div class="ai-icon-wrap">
                        <v-icon size="22" color="#00d4ff">{{ f.icon }}</v-icon>
                      </div>
                      <div>
                        <h4 class="ai-feat-title mb-2">{{ f.title }}</h4>
                        <p class="ai-feat-desc">{{ f.desc }}</p>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ════════════════════════════════════════════ -->
      <!-- METHODOLOGY                                 -->
      <!-- ════════════════════════════════════════════ -->
      <section id="methodology" ref="methodRef" class="methodology-section">
        <div class="meth-blob" />

        <v-container>
          <v-row justify="center" class="mb-16">
            <v-col cols="12" md="8" class="text-center">
              <div class="reveal section-badge">
                <v-icon size="16">mdi-cog-outline</v-icon>
                Sistema Comprobado
              </div>
              <h2 class="reveal d1 section-title">
                Un sistema de ventas<br />
                <span class="gradient-text">adaptado a tu industria</span>
              </h2>
              <p class="reveal d2 section-subtitle">
                No improvisamos. Cada paso de nuestro proceso está respaldado por
                años de trabajo con más de 12 industrias y cientos de ciclos de venta cerrados.
              </p>
            </v-col>
          </v-row>

          <div class="steps-wrapper">
            <div
              v-for="(step, i) in steps"
              :key="i"
              class="step-row reveal"
              :class="`d${i + 1}`"
            >
              <div class="step-number-col">
                <div class="step-number">{{ step.number }}</div>
                <div v-if="i < steps.length - 1" class="step-line" />
              </div>
              <div class="step-card glass-card pa-8">
                <div class="d-flex align-center mb-5" style="gap: 20px">
                  <div class="step-icon-wrap">
                    <v-icon size="26" color="#a100ff">{{ step.icon }}</v-icon>
                  </div>
                  <h3 class="step-title">{{ step.title }}</h3>
                </div>
                <p class="step-desc mb-6">{{ step.description }}</p>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="outcome in step.outcomes" :key="outcome" class="step-outcome">
                    <v-icon size="14" color="#4ade80">mdi-check-circle</v-icon>
                    {{ outcome }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <v-row justify="center" class="mt-16">
            <v-col cols="12" md="8" class="text-center reveal">
              <div class="cta-box glass-card pa-10">
                <h3 class="cta-box-title mb-4">¿Listo para activar el sistema?</h3>
                <p class="cta-box-sub mb-8">
                  Agenda un diagnóstico gratuito de 30 minutos y descubre cómo podemos
                  escalar las ventas de tu empresa, sin importar la industria.
                </p>
                <v-btn class="cta-btn" size="large" href="https://wa.me/573147101116" target="_blank">
                  <v-icon start>mdi-calendar-check</v-icon>
                  Agendar diagnóstico gratuito
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ════════════════════════════════════════════ -->
      <!-- TESTIMONIALS                                -->
      <!-- ════════════════════════════════════════════ -->
      <section id="testimonials" ref="testRef" class="testimonials-section">
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
                Resultados reales en<br />
                <span class="gradient-text">múltiples industrias</span>
              </h2>
              <p class="reveal d2 section-subtitle">
                Estas son las historias de empresas de distintos sectores que confiaron en
                Conectux y transformaron sus números comerciales.
              </p>
            </v-col>
          </v-row>

          <div class="reveal d2">
            <Swiper
              :modules="swiperModules"
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
              <SwiperSlide v-for="(t, i) in testimonials" :key="i">
                <div class="testimonial-card glass-card pa-7">
                  <div class="d-flex mb-4 gap-1">
                    <v-icon v-for="n in t.stars" :key="n" size="16" color="#f59e0b">mdi-star</v-icon>
                  </div>
                  <div class="result-badge mb-5">
                    <v-icon size="14" color="#4ade80">mdi-trending-up</v-icon>
                    {{ t.result }}
                  </div>
                  <v-icon color="rgba(161,0,255,0.4)" size="32" class="mb-2">mdi-format-quote-open</v-icon>
                  <p class="test-comment mb-6">{{ t.comment }}</p>
                  <div class="d-flex align-center mt-auto" style="gap: 16px">
                    <div class="test-avatar">{{ t.avatar }}</div>
                    <div>
                      <div class="test-name">{{ t.name }}</div>
                      <div class="test-role">{{ t.role }}</div>
                      <div class="test-company">{{ t.company }}</div>
                      <div class="test-sector">{{ t.sector }}</div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </v-container>
      </section>

      <!-- ════════════════════════════════════════════ -->
      <!-- INDUSTRIES GRID                             -->
      <!-- ════════════════════════════════════════════ -->
      <section id="industries" ref="industRef" class="industries-section">
        <div class="indust-glow" />
        <v-container>
          <v-row justify="center" class="mb-14">
            <v-col cols="12" md="9" lg="8" class="text-center">
              <div class="reveal section-badge">
                <v-icon size="16">mdi-shape-outline</v-icon>
                Portafolio multi-sector
              </div>

              <h2 class="reveal d1 indust-title">
                Más de 12 industrias<br />
                <span class="gradient-text">confían en nuestro sistema</span>
              </h2>

              <p class="reveal d2 indust-text">
                Comenzamos aprendiendo de cada sector, y hoy ese aprendizaje es nuestra
                mayor ventaja. Retail, tecnología, construcción, alimentos, logística —
                nuestro sistema comercial se adapta a las reglas de juego de cada industria.
              </p>
              <p class="reveal d3 indust-text indust-text--highlight">
                No importa si vendes un producto tangible, un servicio, una solución
                tecnológica o una experiencia. Si tienes clientes potenciales, nosotros
                construimos el puente entre ellos y tu empresa.
              </p>
            </v-col>
          </v-row>

          <v-row justify="center" class="mb-10">
            <v-col
              v-for="(ind, i) in industries"
              :key="i"
              cols="6"
              sm="4"
              md="3"
              lg="2"
              class="reveal pa-2"
              :class="`d${(i % 4) + 1}`"
            >
              <div class="industry-card glass-card pa-5 text-center">
                <v-icon size="32" color="#a100ff" class="mb-3">{{ ind.icon }}</v-icon>
                <div class="industry-label">{{ ind.label }}</div>
              </div>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="12" class="text-center reveal d4">
              <div class="trust-line">
                <span class="trust-dot" />
                <span class="trust-text">Más de 6 años construyendo resultados reales en múltiples industrias</span>
                <span class="trust-dot" />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ════════════════════════════════════════════ -->
      <!-- HISTORY                                     -->
      <!-- ════════════════════════════════════════════ -->
      <section id="history" ref="histRef" class="history-section">
        <div class="hist-blob-1" />
        <div class="hist-blob-2" />

        <v-container>
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
                No llegamos a donde estamos por casualidad. Llegamos después de años de
                trabajo, aprendizaje en múltiples industrias y la convicción de que con
                el método correcto, cualquier empresa puede vender más.
              </p>
            </v-col>
          </v-row>

          <div class="timeline">
            <div
              v-for="(m, i) in milestones"
              :key="i"
              class="timeline-item reveal"
              :class="[`d${(i % 3) + 1}`, { 'timeline-right': i % 2 !== 0 }]"
            >
              <div class="timeline-year" :style="{ background: m.color }">{{ m.year }}</div>
              <div class="timeline-card glass-card pa-7">
                <div class="d-flex align-center mb-4" style="gap: 20px">
                  <div class="timeline-icon">
                    <v-icon size="22" :color="m.color">{{ m.icon }}</v-icon>
                  </div>
                  <h3 class="timeline-title">{{ m.title }}</h3>
                </div>
                <p class="timeline-desc">{{ m.desc }}</p>
              </div>
            </div>
          </div>

          <v-row justify="center" style="margin-top: 96px">
            <v-col cols="12" class="text-center reveal mb-10">
              <h3 class="values-title">Lo que nos define</h3>
            </v-col>
            <v-col
              v-for="(v, i) in values"
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

      <!-- ── Footer ─────────────────────────────────── -->
      <footer class="site-footer">
        <div class="footer-glow" />
        <v-container class="py-16">
          <v-row>
            <v-col cols="12" md="4" class="mb-10 mb-md-0">
              <v-img :src="logo" alt="Conectux" max-width="170" contain class="mb-6 logo-white" />
              <p class="footer-desc mb-6">
                Estrategia comercial y ventas para cualquier industria. Más de 6 años generando
                resultados reales con metodología comprobada e inteligencia artificial.
              </p>
              <div class="d-flex gap-3">
                <a v-for="s in ['mdi-facebook', 'mdi-instagram', 'mdi-linkedin']" :key="s" href="#" class="social-icon">
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
                @click="scrollTo(item.target)"
              >{{ item.title }}</div>
            </v-col>

            <v-col cols="6" md="2" class="mb-8 mb-md-0">
              <h4 class="footer-title mb-5">Servicios</h4>
              <div
                v-for="s in ['Outsourcing Comercial', 'Generación de Leads', 'Marketing Digital', 'IA para Ventas', 'CRM & Automatización']"
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
                +57 314 710 1116
              </div>
              <div class="d-flex align-center mb-7 footer-desc" style="gap:10px">
                <v-icon size="16" color="#a100ff">mdi-map-marker-outline</v-icon>
                Colombia · LATAM · USA
              </div>
              <v-btn class="cta-btn" href="https://wa.me/573147101116" target="_blank" size="small">
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
              <p class="footer-copy">Estrategia Comercial para Cualquier Industria</p>
            </v-col>
          </v-row>
        </v-container>
      </footer>

      <!-- ── WhatsApp FAB ───────────────────────────── -->
      <v-btn
        icon
        color="#25D366"
        size="x-large"
        class="whatsapp-button"
        href="https://wa.me/573147101116"
        target="_blank"
      >
        <v-tooltip activator="parent" location="start">Chatea con nosotros</v-tooltip>
        <v-icon size="x-large" color="white">mdi-whatsapp</v-icon>
      </v-btn>

      <!-- Motor de Google Translate (oculto) -->
      <div id="google_translate_element" style="position:absolute;top:-9999px;left:-9999px;" />
    </v-main>
  </v-app>
</template>

<style>
/* ─── App Bar ──────────────────────────────────────── */
.app-bar {
  backdrop-filter: blur(20px) !important;
  background: rgba(9, 9, 15, 0.8) !important;
  border-bottom: 1px solid rgba(161, 0, 255, 0.1) !important;
  transition: all 0.3s ease !important;
}
.logo-white { filter: brightness(0) invert(1); }

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
.nav-btn:hover { color: #ffffff !important; }
.nav-btn:hover::after { width: 80%; }

.mobile-drawer {
  background: #0d0d1e !important;
  border-right: 1px solid rgba(161, 0, 255, 0.15) !important;
}
.mobile-drawer .nav-item { color: rgba(255, 255, 255, 0.8) !important; transition: all 0.25s ease !important; }
.mobile-drawer .nav-item:hover { background: rgba(161, 0, 255, 0.1) !important; color: #fff !important; }

.login-btn {
  background: transparent !important;
  color: rgba(255, 255, 255, 0.75) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  border-radius: 100px !important;
  padding: 0 20px !important;
  height: 40px !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  text-transform: none !important;
  transition: all 0.25s ease !important;
}
.login-btn:hover {
  color: #fff !important;
  border-color: rgba(161, 0, 255, 0.5) !important;
  background: rgba(161, 0, 255, 0.08) !important;
}

.v-main, .v-main__wrap { background-color: #09090f !important; overflow-x: hidden; }
.v-btn { text-transform: none !important; }

/* ─── WhatsApp ─────────────────────────────────────── */
.whatsapp-button {
  position: fixed !important;
  bottom: 24px !important;
  right: 24px !important;
  z-index: 999 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.35) !important;
}
.whatsapp-button:hover { transform: scale(1.1) !important; box-shadow: 0 6px 28px rgba(37, 211, 102, 0.5) !important; }

/* ─── Google Translate — suprime el banner superior ── */
.goog-te-banner-frame,
#goog-gt-tt,
.goog-te-balloon-frame {
  display: none !important;
}
body {
  top: 0 !important;
}
</style>

<style scoped>
/* ═══════════════════════════════════════════════════ */
/* HERO                                               */
/* ═══════════════════════════════════════════════════ */
.hero-section {
  position: relative;
  min-height: 100vh;
  background: #09090f;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.blob { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
.blob-1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(161,0,255,0.22) 0%, transparent 65%); top: -200px; left: -200px; animation: blobFloat1 10s ease-in-out infinite; }
.blob-2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 65%); bottom: -150px; right: -100px; animation: blobFloat2 13s ease-in-out infinite; }
.blob-3 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(161,0,255,0.16) 0%, transparent 65%); top: 30%; right: 10%; animation: blobFloat3 9s ease-in-out infinite; }
@keyframes blobFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(60px,80px) scale(1.05)} }
@keyframes blobFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-80px,-60px) scale(1.08)} }
@keyframes blobFloat3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,40px) scale(0.95)} }

.hero-grid { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(161,0,255,0.08) 1px, transparent 1px); background-size: 40px 40px; z-index: 0; }
.hero-container { position: relative; z-index: 1; padding-top: 120px; padding-bottom: 100px; }
.hero-content { display: flex; flex-direction: column; align-items: center; }

.hero-title { font-size: clamp(2.8rem, 6vw, 5.2rem); font-weight: 900; line-height: 1.08; color: #fff; margin: 24px 0 28px; letter-spacing: -2px; }
.hero-subtitle { font-size: 1.2rem; color: rgba(160,160,184,0.9); line-height: 1.8; max-width: 680px; }
.hero-subtitle strong { color: #fff; font-weight: 700; }

.hero-cta-primary { background: linear-gradient(135deg, #a100ff, #7b00cc) !important; color: #fff !important; border-radius: 100px !important; padding: 0 32px !important; height: 56px !important; font-weight: 700 !important; font-size: 16px !important; text-transform: none !important; box-shadow: 0 4px 28px rgba(161,0,255,0.45) !important; transition: all 0.3s ease !important; }
.hero-cta-primary:hover { transform: translateY(-3px) !important; box-shadow: 0 10px 36px rgba(161,0,255,0.6) !important; }

.hero-cta-secondary { background: rgba(255,255,255,0.06) !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.2) !important; border-radius: 100px !important; padding: 0 32px !important; height: 56px !important; font-weight: 600 !important; font-size: 16px !important; text-transform: none !important; backdrop-filter: blur(8px) !important; transition: all 0.3s ease !important; }
.hero-cta-secondary:hover { background: rgba(161,0,255,0.15) !important; border-color: rgba(161,0,255,0.45) !important; transform: translateY(-3px) !important; }

.hero-counters { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; max-width: 620px; width: 100%; border-top: 1px solid rgba(161,0,255,0.14); padding-top: 32px; }
.hero-counter { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 0 20px; border-right: 1px solid rgba(161,0,255,0.1); }
.hero-counter:last-child { border-right: none; }
.counter-number { font-size: 2.4rem; font-weight: 900; background: linear-gradient(135deg, #c84bff, #a100ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
.counter-label { font-size: 13px; color: rgba(160,160,184,0.75); line-height: 1.4; text-align: center; }

.scroll-indicator { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); cursor: pointer; animation: bounce 2.5s ease-in-out infinite; z-index: 1; }
@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(10px)} }

/* ═══════════════════════════════════════════════════ */
/* STATS                                              */
/* ═══════════════════════════════════════════════════ */
.stats-section { position: relative; background: linear-gradient(180deg, #09090f 0%, #0d0d20 50%, #09090f 100%); padding: 80px 0; overflow: hidden; }
.stats-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 800px; height: 300px; background: radial-gradient(ellipse, rgba(161,0,255,0.1) 0%, transparent 70%); pointer-events: none; }
.stat-card { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 36px 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(161,0,255,0.12); border-radius: 20px; transition: all 0.35s ease; }
.stat-card:hover { background: rgba(161,0,255,0.06); border-color: rgba(161,0,255,0.3); transform: translateY(-6px); box-shadow: 0 12px 40px rgba(161,0,255,0.15); }
.stat-icon-wrap { width: 52px; height: 52px; border-radius: 14px; background: rgba(161,0,255,0.1); border: 1px solid rgba(161,0,255,0.2); display: flex; align-items: center; justify-content: center; }
.stat-number { font-size: 2.6rem; font-weight: 900; line-height: 1; letter-spacing: -1px; }
.stat-label { font-size: 15px; color: rgba(160,160,184,0.85); text-align: center; line-height: 1.5; }

/* ═══════════════════════════════════════════════════ */
/* SERVICES                                           */
/* ═══════════════════════════════════════════════════ */
.services-section { position: relative; background: #0d0d1e; padding: 100px 0; overflow: hidden; }
.blob-services { position: absolute; top: 50%; right: -200px; transform: translateY(-50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(161,0,255,0.07) 0%, transparent 65%); border-radius: 50%; filter: blur(60px); pointer-events: none; }
.section-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 900; color: #fff; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 16px; }
.section-subtitle { font-size: 1rem; color: rgba(160,160,184,0.85); line-height: 1.75; }
.service-icon-wrap { width: 56px; height: 56px; border-radius: 16px; background: rgba(161,0,255,0.1); border: 1px solid rgba(161,0,255,0.2); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
.service-card:hover .service-icon-wrap { background: rgba(161,0,255,0.2); transform: scale(1.08) rotate(3deg); }
.service-title { font-size: 1.2rem; font-weight: 700; color: #fff; }
.service-desc { font-size: 15px; color: rgba(160,160,184,0.85); line-height: 1.75; }
.service-tag { font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: 100px; background: rgba(161,0,255,0.1); border: 1px solid rgba(161,0,255,0.2); color: rgba(200,160,255,0.9); transition: all 0.2s ease; }
.service-card:hover .service-tag { background: rgba(161,0,255,0.18); border-color: rgba(161,0,255,0.35); }
.cta-sub { font-size: 1rem; color: rgba(160,160,184,0.8); }

/* ═══════════════════════════════════════════════════ */
/* AI                                                 */
/* ═══════════════════════════════════════════════════ */
.ai-section { position: relative; background: #09090f; padding: 100px 0; overflow: hidden; }
.ai-blob-1 { position: absolute; width: 500px; height: 500px; background: radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 65%); border-radius: 50%; filter: blur(70px); top: -100px; right: -100px; pointer-events: none; animation: aiBlob1 12s ease-in-out infinite; }
.ai-blob-2 { position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(161,0,255,0.1) 0%, transparent 65%); border-radius: 50%; filter: blur(60px); bottom: -80px; left: -80px; pointer-events: none; animation: aiBlob2 10s ease-in-out infinite; }
@keyframes aiBlob1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-60px,80px)} }
@keyframes aiBlob2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,-50px)} }
.ai-highlight { display: flex; align-items: flex-start; background: rgba(0,212,255,0.07); border: 1px solid rgba(0,212,255,0.2); border-radius: 16px; padding: 20px; }
.highlight-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 6px; }
.highlight-desc { font-size: 14px; color: rgba(160,160,184,0.85); line-height: 1.6; }
.ai-feature-card { height: 100%; }
.ai-feature-card:hover { border-color: rgba(0,212,255,0.3) !important; box-shadow: 0 8px 30px rgba(0,212,255,0.1) !important; }
.ai-icon-wrap { min-width: 44px; height: 44px; border-radius: 12px; background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.18); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
.ai-feature-card:hover .ai-icon-wrap { background: rgba(0,212,255,0.15); transform: scale(1.08); }
.ai-feat-title { font-size: 15px; font-weight: 700; color: #fff; }
.ai-feat-desc { font-size: 14px; color: rgba(160,160,184,0.8); line-height: 1.65; margin: 0; }

/* ═══════════════════════════════════════════════════ */
/* METHODOLOGY                                        */
/* ═══════════════════════════════════════════════════ */
.methodology-section { position: relative; background: #0d0d1e; padding: 100px 0; overflow: hidden; }
.meth-blob { position: absolute; width: 700px; height: 700px; background: radial-gradient(circle, rgba(161,0,255,0.06) 0%, transparent 65%); border-radius: 50%; filter: blur(80px); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; }
.steps-wrapper { display: flex; flex-direction: column; gap: 0; max-width: 860px; margin: 0 auto; }
.step-row { display: grid; grid-template-columns: 80px 1fr; gap: 24px; align-items: flex-start; }
.step-number-col { display: flex; flex-direction: column; align-items: center; padding-top: 28px; }
.step-number { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #a100ff, #7b00cc); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; color: #fff; flex-shrink: 0; box-shadow: 0 4px 20px rgba(161,0,255,0.35); }
.step-line { width: 2px; flex: 1; min-height: 40px; background: linear-gradient(180deg, rgba(161,0,255,0.4), rgba(161,0,255,0.05)); margin-top: 8px; margin-bottom: 8px; }
.step-card { margin-bottom: 20px; }
.step-icon-wrap { width: 48px; height: 48px; border-radius: 14px; background: rgba(161,0,255,0.1); border: 1px solid rgba(161,0,255,0.22); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.3s ease; }
.step-card:hover .step-icon-wrap { background: rgba(161,0,255,0.2); transform: scale(1.08); }
.step-title { font-size: 1.2rem; font-weight: 700; color: #fff; }
.step-desc { font-size: 15px; color: rgba(160,160,184,0.85); line-height: 1.75; }
.step-outcome { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: rgba(200,240,200,0.9); background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2); border-radius: 100px; padding: 5px 12px; }
.cta-box-title { font-size: 1.6rem; font-weight: 800; color: #fff; }
.cta-box-sub { font-size: 1rem; color: rgba(160,160,184,0.8); line-height: 1.7; }
@media (max-width: 600px) { .step-row { grid-template-columns: 48px 1fr; gap: 12px; } .step-number { width: 40px; height: 40px; font-size: 13px; } }

/* ═══════════════════════════════════════════════════ */
/* TESTIMONIALS                                       */
/* ═══════════════════════════════════════════════════ */
.testimonials-section { position: relative; background: #09090f; padding: 100px 0 120px; overflow: hidden; }
.test-blob-1 { position: absolute; width: 500px; height: 500px; background: radial-gradient(circle, rgba(161,0,255,0.08) 0%, transparent 65%); border-radius: 50%; filter: blur(60px); top: -100px; left: -100px; pointer-events: none; }
.test-blob-2 { position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 65%); border-radius: 50%; filter: blur(60px); bottom: 0; right: -80px; pointer-events: none; }
.testimonials-swiper { padding-bottom: 52px !important; }
:deep(.swiper-pagination-bullet) { background: rgba(161,0,255,0.4) !important; opacity: 1 !important; }
:deep(.swiper-pagination-bullet-active) { background: #a100ff !important; width: 24px !important; border-radius: 4px !important; }
.testimonial-card { height: 100%; display: flex; flex-direction: column; }
.result-badge { display: inline-flex; align-items: center; gap: 7px; background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2); border-radius: 100px; padding: 6px 14px; font-size: 13px; font-weight: 700; color: #4ade80; }
.test-comment { font-size: 15px; color: rgba(200,200,220,0.88); line-height: 1.8; font-style: italic; flex: 1; }
.test-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #a100ff, #7b00cc); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #fff; flex-shrink: 0; }
.test-name { font-size: 15px; font-weight: 700; color: #fff; }
.test-role { font-size: 13px; color: rgba(160,160,184,0.8); margin-top: 2px; }
.test-company { font-size: 13px; color: #c84bff; font-weight: 600; margin-top: 2px; }
.test-sector { font-size: 12px; color: rgba(160,160,184,0.6); margin-top: 1px; }

/* ═══════════════════════════════════════════════════ */
/* INDUSTRIES                                         */
/* ═══════════════════════════════════════════════════ */
.industries-section { position: relative; background: #0d0d1e; padding: 100px 0; overflow: hidden; }
.indust-glow { position: absolute; bottom: -100px; left: 50%; transform: translateX(-50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(161,0,255,0.07) 0%, transparent 70%); pointer-events: none; }
.indust-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 900; color: #fff; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 28px; }
.indust-text { font-size: 1.05rem; color: rgba(160,160,184,0.85); line-height: 1.85; margin-bottom: 18px; }
.indust-text--highlight { color: rgba(200,200,220,0.95); font-style: italic; border-left: 3px solid rgba(161,0,255,0.5); padding-left: 20px; text-align: left; margin-top: 8px; }
.industry-card { transition: all 0.3s ease; cursor: default; }
.industry-label { font-size: 13px; font-weight: 600; color: rgba(200,200,220,0.85); }
.trust-line { display: inline-flex; align-items: center; gap: 12px; color: rgba(160,160,184,0.6); }
.trust-text { font-size: 14px; }
.trust-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(161,0,255,0.6); display: inline-block; }

/* ═══════════════════════════════════════════════════ */
/* HISTORY                                            */
/* ═══════════════════════════════════════════════════ */
.history-section { position: relative; background: #09090f; padding: 100px 0 120px; overflow: hidden; }
.hist-blob-1 { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(161,0,255,0.07) 0%, transparent 65%); border-radius: 50%; filter: blur(70px); top: 0; right: -150px; pointer-events: none; }
.hist-blob-2 { position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 65%); border-radius: 50%; filter: blur(60px); bottom: 100px; left: -100px; pointer-events: none; }
.timeline { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; max-width: 1060px; margin: 0 auto; position: relative; }
.timeline::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: linear-gradient(180deg, transparent, rgba(161,0,255,0.3) 15%, rgba(161,0,255,0.3) 85%, transparent); transform: translateX(-50%); }
.timeline-item { grid-column: 1; padding-right: 28px; position: relative; }
.timeline-right { grid-column: 2; padding-right: 0; padding-left: 28px; margin-top: 60px; }
.timeline-year { display: inline-flex; align-items: center; justify-content: center; padding: 5px 16px; border-radius: 100px; font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 14px; letter-spacing: 0.5px; }
.timeline-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(161,0,255,0.1); border: 1px solid rgba(161,0,255,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.3s ease; }
.timeline-card:hover .timeline-icon { background: rgba(161,0,255,0.2); transform: scale(1.08); }
.timeline-title { font-size: 1.05rem; font-weight: 700; color: #fff; line-height: 1.4; }
.timeline-desc { font-size: 15px; color: rgba(160,160,184,0.85); line-height: 1.75; margin: 0; }
.values-title { font-size: 1.6rem; font-weight: 800; color: #fff; }
.value-icon-wrap { width: 52px; height: 52px; border-radius: 14px; background: rgba(161,0,255,0.1); border: 1px solid rgba(161,0,255,0.2); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
.value-card:hover .value-icon-wrap { background: rgba(161,0,255,0.2); transform: scale(1.08); }
.value-title { font-size: 1.05rem; font-weight: 700; color: #fff; }
.value-desc { font-size: 14px; color: rgba(160,160,184,0.82); line-height: 1.65; margin: 0; }
@media (max-width: 768px) {
  .timeline { grid-template-columns: 1fr; }
  .timeline::before { display: none; }
  .timeline-item, .timeline-right { grid-column: 1; padding: 0; margin-top: 0; }
}

/* ═══════════════════════════════════════════════════ */
/* FOOTER                                             */
/* ═══════════════════════════════════════════════════ */
.site-footer { position: relative; background: #060610; border-top: 1px solid rgba(161,0,255,0.1); overflow: hidden; }
.footer-glow { position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 600px; height: 400px; background: radial-gradient(ellipse, rgba(161,0,255,0.06) 0%, transparent 70%); pointer-events: none; }
.footer-title { color: #fff; font-size: 13px !important; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.footer-desc { color: rgba(160,160,184,0.85); font-size: 14.5px !important; line-height: 1.75 !important; }
.footer-link { color: rgba(160,160,184,0.75); font-size: 14.5px !important; cursor: pointer; transition: all 0.25s ease; }
.footer-link:hover { color: #c84bff; padding-left: 4px; }
.footer-copy { color: rgba(90,90,120,0.9); font-size: 13.5px !important; margin: 0; }
.footer-divider { border: none; border-top: 1px solid rgba(161,0,255,0.1); }
.social-icon { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: rgba(161,0,255,0.1); border: 1px solid rgba(161,0,255,0.2); text-decoration: none; transition: all 0.3s ease; }
.social-icon:hover { background: rgba(161,0,255,0.25); border-color: rgba(161,0,255,0.5); transform: translateY(-3px); }
</style>
