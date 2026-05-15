<script setup>
import { ref, onMounted } from 'vue'
import { useReveal } from '../composables/useReveal'
import logo from '../assets/logo-conectux.png'

const page = ref(null)
const { init } = useReveal()
onMounted(() => init(page.value))

const deliverables = [
  {
    number: '01',
    icon: 'mdi-compass-outline',
    title: 'Brief estratégico',
    desc: 'Análisis profundo de tu empresa, valores, público objetivo y posicionamiento. La base que guía cada decisión visual y comunicacional.',
    tags: ['Análisis de marca', 'Audiencia ideal', 'Propuesta de valor'],
  },
  {
    number: '02',
    icon: 'mdi-palette-swatch-outline',
    title: 'Definición visual de la marca',
    desc: 'Construcción del universo visual completo: estilo, carácter gráfico, personalidad y referencias que representan tu identidad.',
    tags: ['Moodboard', 'Estilo gráfico', 'Personalidad visual'],
  },
  {
    number: '03',
    icon: 'mdi-circle-multiple-outline',
    title: 'Paleta de color',
    desc: 'Selección y justificación de colores primarios, secundarios y de acento. Con códigos HEX, RGB y CMYK para uso digital e impreso.',
    tags: ['Color primario', 'Color secundario', 'Códigos HEX · RGB · CMYK'],
  },
  {
    number: '04',
    icon: 'mdi-format-font',
    title: 'Tipografías',
    desc: 'Sistema tipográfico completo con fuentes primarias, secundarias y jerarquías de uso. Para títulos, cuerpos de texto y piezas digitales.',
    tags: ['Tipografía principal', 'Tipografía secundaria', 'Jerarquía visual'],
  },
  {
    number: '05',
    icon: 'mdi-check-decagram-outline',
    title: 'Usos correctos e incorrectos del logo',
    desc: 'Guía clara de cómo usar, escalar y proteger tu logo. Incluye versiones permitidas, fondos, tamaños mínimos y los errores que debes evitar.',
    tags: ['Versiones del logo', 'Área de respeto', 'Errores comunes'],
  },
  {
    number: '06',
    icon: 'mdi-image-multiple-outline',
    title: 'Aplicaciones básicas',
    desc: 'Mockups reales de tu identidad en tarjetas de presentación, membrete, firma de correo, carpeta corporativa y perfil de redes sociales.',
    tags: ['Papelería', 'Firma de correo', 'Redes sociales'],
  },
  {
    number: '07',
    icon: 'mdi-Instagram',
    title: 'Guía de estilo para redes y comunicación',
    desc: 'Tono de voz, vocabulario permitido y prohibido, estilo de comunicación y lineamientos visuales para mantener coherencia en cada canal.',
    tags: ['Tono de voz', 'Estilo editorial', 'Lineamientos digitales'],
  },
]

const problems = [
  {
    icon: 'mdi-shuffle-variant',
    color: '#a100ff',
    title: 'Identidad inconsistente',
    desc: 'Cada diseñador o colaborador interpreta tu marca a su manera. El resultado: una imagen fragmentada que confunde en lugar de convencer.',
  },
  {
    icon: 'mdi-account-question-outline',
    color: '#c84bff',
    title: 'Falta de autoridad visual',
    desc: 'Sin coherencia gráfica, tu marca se ve improvisada. Los clientes perciben eso y lo asocian con falta de profesionalismo.',
  },
  {
    icon: 'mdi-clock-alert-outline',
    color: '#00d4ff',
    title: 'Tiempo perdido en correcciones',
    desc: 'Sin un manual claro, cada pieza nueva requiere aprobaciones, ajustes y reprocesos. El manual elimina ese ciclo costoso.',
  },
]

const whys = [
  { icon: 'mdi-shield-star-outline', text: 'Especialistas en identidad de marca para empresas en crecimiento' },
  { icon: 'mdi-eye-check-outline', text: 'Cada decisión visual tiene una razón estratégica detrás' },
  { icon: 'mdi-file-document-check-outline', text: 'Entregamos un documento real, usable y completo' },
  { icon: 'mdi-handshake-outline', text: 'Revisiones incluidas: tu aprobación en cada etapa' },
  { icon: 'mdi-clock-fast', text: 'Proceso ágil y sin demoras innecesarias' },
  { icon: 'mdi-lightbulb-on-outline', text: 'Más de 6 años construyendo marcas que venden' },
]

</script>

<template>
  <v-app>
    <div ref="page">

      <!-- ─── NAVBAR ───────────────────────────────────────────────── -->
      <header class="pm-navbar">
        <div class="pm-navbar-inner">
          <img :src="logo" alt="Conectux" class="pm-logo" />
        </div>
      </header>

      <!-- ─── HERO ─────────────────────────────────────────────────── -->
      <section class="pm-hero">
        <div class="blob blob-1" />
        <div class="blob blob-2" />
        <div class="blob blob-3" />
        <div class="hero-grid" />

        <v-container class="pm-hero-container">
          <v-row justify="center">
            <v-col cols="12" md="10" lg="8" class="text-center">

              <div class="section-badge mx-auto mb-6 reveal">
                <v-icon size="15">mdi-book-open-page-variant-outline</v-icon>
                Propuesta · Manual de Marca
              </div>

              <h1 class="pm-hero-title reveal d1">
                Así se ve un<br />
                <span class="gradient-text">manual de marca</span><br />
                con Conectux
              </h1>

              <p class="pm-hero-sub mx-auto mt-7 mb-10 reveal d2">
                Tu marca es más que un logo. Es la promesa que haces cada vez que alguien te ve.
                Te entregamos el documento que la define, la protege y la hace
                <strong>crecer con coherencia</strong>.
              </p>

              <div class="pm-hero-chips d-flex flex-wrap justify-center gap-3 reveal d3">
                <span class="pm-chip"><v-icon size="14" color="#4ade80">mdi-check-circle</v-icon> Documento PDF editable</span>
                <span class="pm-chip"><v-icon size="14" color="#4ade80">mdi-check-circle</v-icon> Revisiones incluidas</span>
                <span class="pm-chip"><v-icon size="14" color="#4ade80">mdi-check-circle</v-icon> Entrega en 3 semanas</span>
              </div>

              <div class="pm-hero-scroll reveal d4">
                <v-icon size="20" color="rgba(161,0,255,0.5)">mdi-chevron-double-down</v-icon>
              </div>

            </v-col>
          </v-row>
        </v-container>

      </section>

      <!-- ─── EL PROBLEMA ──────────────────────────────────────────── -->
      <section class="pm-section pm-section-alt">
        <div class="pm-blob-center" />
        <v-container>
          <v-row justify="center" class="mb-14">
            <v-col cols="12" md="8" class="text-center">
              <div class="reveal section-badge mx-auto">
                <v-icon size="15">mdi-alert-circle-outline</v-icon>
                El problema de no tener un manual
              </div>
              <h2 class="reveal d1 pm-section-title mt-2">
                Sin un manual de marca,<br />
                <span class="gradient-text">estás dejando dinero sobre la mesa</span>
              </h2>
              <p class="reveal d2 pm-section-sub">
                Cada vez que alguien usa mal tu logo, elige el color equivocado o habla en un tono diferente,
                tu marca pierde fuerza. Y eso tiene un costo real.
              </p>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col
              v-for="(p, i) in problems"
              :key="i"
              cols="12"
              md="4"
              class="reveal"
              :class="`d${i + 1}`"
            >
              <div class="pm-problem-card glass-card pa-8 h-100 text-center">
                <div class="pm-problem-icon mx-auto mb-5" :style="`border-color: ${p.color}33; background: ${p.color}15`">
                  <v-icon size="30" :color="p.color">{{ p.icon }}</v-icon>
                </div>
                <h3 class="pm-card-title mb-3">{{ p.title }}</h3>
                <p class="pm-card-desc">{{ p.desc }}</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ─── QUÉ ES ─────────────────────────────────────────────── -->
      <section class="pm-section">
        <v-container>
          <v-row align="center" style="gap: 0">
            <v-col cols="12" md="5" class="mb-12 mb-md-0 pr-md-10">
              <div class="reveal section-badge">
                <v-icon size="15">mdi-information-outline</v-icon>
                ¿Qué es un manual de marca?
              </div>
              <h2 class="reveal d1 pm-section-title mt-4">
                El documento que hace que<br />
                <span class="gradient-text">tu marca hable</span><br />
                siempre con una sola voz
              </h2>
              <p class="reveal d2 pm-section-sub mt-5" style="margin-left:0; text-align:left">
                Un manual de marca (o brand guidelines) es la guía maestra que define
                cómo se ve, suena y siente tu empresa en todos los puntos de contacto.
              </p>
              <p class="reveal d3 pm-section-sub mt-4" style="margin-left:0; text-align:left">
                Desde cómo usar tu logo hasta qué palabras usar en redes sociales.
                <strong style="color:#fff">Es el activo más valioso de tu identidad.</strong>
              </p>
            </v-col>

            <v-col cols="12" md="7">
              <div class="pm-bv-card glass-card reveal d2">

                <!-- Header -->
                <div class="pm-bv-header">
                  <div class="pm-bv-header-icon">
                    <v-icon size="26" color="#fff">mdi-book-open-variant</v-icon>
                  </div>
                  <div>
                    <p class="pm-bv-title">Manual de Marca Conectux</p>
                    <p class="pm-bv-sub">Documento estratégico · Identidad visual completa</p>
                  </div>
                  <div class="pm-bv-badge">Completo</div>
                </div>

                <!-- Módulos -->
                <div class="pm-bv-modules">
                  <div class="pm-bv-module">
                    <div class="pm-bv-mod-icon"><v-icon size="18" color="#a100ff">mdi-compass-outline</v-icon></div>
                    <div class="pm-bv-mod-body">
                      <div class="pm-bv-mod-top">
                        <span class="pm-bv-mod-name">Brief estratégico</span>
                        <span class="pm-bv-mod-pct">100%</span>
                      </div>
                      <div class="pm-bv-bar"><div class="pm-bv-fill" /></div>
                    </div>
                  </div>
                  <div class="pm-bv-module">
                    <div class="pm-bv-mod-icon"><v-icon size="18" color="#c84bff">mdi-palette-swatch-outline</v-icon></div>
                    <div class="pm-bv-mod-body">
                      <div class="pm-bv-mod-top">
                        <span class="pm-bv-mod-name">Identidad visual</span>
                        <span class="pm-bv-mod-pct">100%</span>
                      </div>
                      <div class="pm-bv-bar"><div class="pm-bv-fill" /></div>
                    </div>
                  </div>
                  <div class="pm-bv-module">
                    <div class="pm-bv-mod-icon"><v-icon size="18" color="#a100ff">mdi-circle-multiple-outline</v-icon></div>
                    <div class="pm-bv-mod-body">
                      <div class="pm-bv-mod-top">
                        <span class="pm-bv-mod-name">Sistema de color</span>
                        <span class="pm-bv-mod-pct">100%</span>
                      </div>
                      <div class="pm-bv-bar"><div class="pm-bv-fill" /></div>
                    </div>
                  </div>
                  <div class="pm-bv-module">
                    <div class="pm-bv-mod-icon"><v-icon size="18" color="#c84bff">mdi-format-font</v-icon></div>
                    <div class="pm-bv-mod-body">
                      <div class="pm-bv-mod-top">
                        <span class="pm-bv-mod-name">Tipografías</span>
                        <span class="pm-bv-mod-pct">100%</span>
                      </div>
                      <div class="pm-bv-bar"><div class="pm-bv-fill" /></div>
                    </div>
                  </div>
                  <div class="pm-bv-module">
                    <div class="pm-bv-mod-icon"><v-icon size="18" color="#00d4ff">mdi-check-decagram-outline</v-icon></div>
                    <div class="pm-bv-mod-body">
                      <div class="pm-bv-mod-top">
                        <span class="pm-bv-mod-name">Usos del logo</span>
                        <span class="pm-bv-mod-pct">100%</span>
                      </div>
                      <div class="pm-bv-bar"><div class="pm-bv-fill" style="background: linear-gradient(90deg,#00d4ff,#a100ff)" /></div>
                    </div>
                  </div>
                  <div class="pm-bv-module">
                    <div class="pm-bv-mod-icon"><v-icon size="18" color="#a100ff">mdi-image-multiple-outline</v-icon></div>
                    <div class="pm-bv-mod-body">
                      <div class="pm-bv-mod-top">
                        <span class="pm-bv-mod-name">Aplicaciones</span>
                        <span class="pm-bv-mod-pct">100%</span>
                      </div>
                      <div class="pm-bv-bar"><div class="pm-bv-fill" /></div>
                    </div>
                  </div>
                  <div class="pm-bv-module">
                    <div class="pm-bv-mod-icon"><v-icon size="18" color="#c84bff">mdi-bullhorn-outline</v-icon></div>
                    <div class="pm-bv-mod-body">
                      <div class="pm-bv-mod-top">
                        <span class="pm-bv-mod-name">Guía de comunicación</span>
                        <span class="pm-bv-mod-pct">100%</span>
                      </div>
                      <div class="pm-bv-bar"><div class="pm-bv-fill" /></div>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="pm-bv-footer">
                  <div class="d-flex align-center gap-2">
                    <v-icon size="16" color="#4ade80">mdi-check-circle</v-icon>
                    <span class="pm-bv-complete">7 módulos · Identidad completa y protegida</span>
                  </div>
                  <span class="pm-bv-pages">~40 páginas</span>
                </div>

              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ─── QUÉ INCLUYE ──────────────────────────────────────────── -->
      <section class="pm-section pm-section-alt">
        <div class="pm-blob-center" />
        <v-container>
          <v-row justify="center" class="mb-16">
            <v-col cols="12" md="8" class="text-center">
              <div class="reveal section-badge mx-auto">
                <v-icon size="15">mdi-format-list-checks</v-icon>
                Qué incluye
              </div>
              <h2 class="reveal d1 pm-section-title mt-2">
                Todo lo que necesita<br />
                <span class="gradient-text">una identidad sólida</span>
              </h2>
              <p class="reveal d2 pm-section-sub">
                7 módulos diseñados para que tu marca sea coherente, profesional y lista
                para crecer en cualquier canal.
              </p>
            </v-col>
          </v-row>

          <div class="pm-steps-wrapper">
            <div
              v-for="(item, i) in deliverables"
              :key="i"
              class="pm-step-row reveal"
              :class="`d${(i % 4) + 1}`"
            >
              <div class="pm-step-num-col">
                <div class="pm-step-num">{{ item.number }}</div>
                <div v-if="i < deliverables.length - 1" class="pm-step-line" />
              </div>
              <div class="pm-step-card glass-card pa-7 mb-5">
                <div class="d-flex align-center mb-4" style="gap:16px">
                  <div class="pm-step-icon">
                    <v-icon size="24" color="#a100ff">{{ item.icon }}</v-icon>
                  </div>
                  <h3 class="pm-step-title">{{ item.title }}</h3>
                </div>
                <p class="pm-card-desc mb-5">{{ item.desc }}</p>
                <div class="d-flex flex-wrap" style="gap:8px">
                  <span v-for="tag in item.tags" :key="tag" class="pm-tag">
                    <v-icon size="13" color="#4ade80">mdi-check-circle</v-icon>
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </v-container>
      </section>

      <!-- ─── POR QUÉ CONECTUX ─────────────────────────────────────── -->
      <section class="pm-section">
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="5" class="mb-12 mb-md-0 pr-md-10">
              <div class="reveal section-badge">
                <v-icon size="15">mdi-lightning-bolt-outline</v-icon>
                Nuestro diferencial
              </div>
              <h2 class="reveal d1 pm-section-title mt-4">
                No solo diseñamos.<br />
                <span class="gradient-text">Construimos marcas</span><br />
                que duran.
              </h2>
              <p class="reveal d2 pm-section-sub mt-5" style="margin-left:0; text-align:left">
                En Conectux cada proyecto de identidad parte de la estrategia, no de la estética.
                Tu manual no es un PDF bonito. Es una <strong style="color:#fff">herramienta de crecimiento</strong>.
              </p>
            </v-col>

            <v-col cols="12" md="7">
              <div class="pm-why-card glass-card reveal d2">

                <!-- Header -->
                <div class="pm-why-header">
                  <div class="pm-why-header-icon">
                    <v-icon size="24" color="#fff">mdi-lightning-bolt</v-icon>
                  </div>
                  <div>
                    <p class="pm-why-header-title">Por qué elegir Conectux</p>
                    <p class="pm-why-header-sub">Lo que nos diferencia de una agencia genérica</p>
                  </div>
                </div>

                <!-- Items -->
                <div class="pm-why-list">
                  <div
                    v-for="(w, i) in whys"
                    :key="i"
                    class="pm-why-row"
                  >
                    <div class="pm-why-row-icon">
                      <v-icon size="20" color="#a100ff">{{ w.icon }}</v-icon>
                    </div>
                    <p class="pm-why-row-text">{{ w.text }}</p>
                    <v-icon size="16" color="rgba(74,222,128,0.7)" class="pm-why-check">mdi-check-circle</v-icon>
                  </div>
                </div>

                <!-- Footer -->
                <div class="pm-why-footer">
                  <v-icon size="15" color="rgba(161,0,255,0.6)">mdi-star-four-points</v-icon>
                  <span>Más de 6 años construyendo marcas que venden</span>
                </div>

              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ─── INVERSIÓN ────────────────────────────────────────────── -->
      <section class="pm-section pm-section-alt pm-offer-section">
        <div class="pm-blob-center" />
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="10" lg="7">

              <div class="text-center mb-12 reveal">
                <div class="section-badge mx-auto mb-5">
                  <v-icon size="15">mdi-currency-usd</v-icon>
                  La inversión
                </div>
                <h2 class="pm-section-title">
                  Un manual profesional<br />
                  <span class="gradient-text">que se paga solo</span>
                </h2>
                <p class="pm-section-sub mt-3">
                  Tener una marca coherente genera más confianza, reduce errores costosos y
                  aumenta la percepción de valor de tus servicios o productos.
                </p>
              </div>

              <!-- Pricing card -->
              <div class="pm-price-card glass-card reveal d1 text-center">
                <div class="pm-price-glow" />

                <p class="pm-price-label mb-2">Valor del proyecto completo</p>
                <div class="pm-price-now gradient-text">$1.800.000</div>
                <p class="pm-price-period">COP · IVA no incluido</p>

                <div class="pm-price-divider my-8" />

                <p class="pm-payment-title mb-6">Forma de pago</p>
                <div class="pm-payment-steps">
                  <div class="pm-payment-step">
                    <div class="pm-payment-num">50%</div>
                    <div class="pm-payment-info">
                      <p class="pm-payment-step-title">Para iniciar</p>
                      <p class="pm-payment-step-desc">$900.000 COP al confirmar el proyecto</p>
                    </div>
                  </div>
                  <div class="pm-payment-connector">
                    <div class="pm-payment-line" />
                    <v-icon size="18" color="rgba(161,0,255,0.4)">mdi-arrow-down</v-icon>
                  </div>
                  <div class="pm-payment-step">
                    <div class="pm-payment-num">50%</div>
                    <div class="pm-payment-info">
                      <p class="pm-payment-step-title">Al entregar</p>
                      <p class="pm-payment-step-desc">$900.000 COP al entregar el manual final</p>
                    </div>
                  </div>
                </div>

                <div class="pm-price-divider my-8" />

                <!-- Incluye -->
                <p class="pm-payment-title mb-5">Todo esto en un solo proyecto</p>
                <div class="pm-includes-grid">
                  <div v-for="(item, i) in deliverables" :key="i" class="pm-include-row">
                    <v-icon size="16" color="#4ade80">mdi-check-circle</v-icon>
                    <span>{{ item.title }}</span>
                  </div>
                </div>

                <div class="pm-price-divider my-8" />

                <div class="pm-timeline-row">
                  <v-icon size="20" color="#a100ff">mdi-calendar-clock</v-icon>
                  <span>Tiempo estimado de entrega: <strong>3 semanas</strong> desde el inicio del proyecto</span>
                </div>

              </div>

            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ─── PROCESO ───────────────────────────────────────────────── -->
      <section class="pm-section">
        <v-container>
          <v-row justify="center" class="mb-14">
            <v-col cols="12" md="8" class="text-center">
              <div class="reveal section-badge mx-auto">
                <v-icon size="15">mdi-cog-outline</v-icon>
                Cómo trabajamos
              </div>
              <h2 class="reveal d1 pm-section-title mt-2">
                Un proceso claro,<br />
                <span class="gradient-text">sin sorpresas</span>
              </h2>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="12" md="10">
              <div class="pm-process-grid">
                <div class="pm-process-item reveal d1">
                  <div class="pm-process-num">1</div>
                  <div class="pm-process-body glass-card pa-6">
                    <v-icon size="22" color="#a100ff" class="mb-3">mdi-magnify</v-icon>
                    <h3 class="pm-process-title">Brief y diagnóstico</h3>
                    <p class="pm-card-desc">Conversamos a fondo sobre tu empresa, tus metas, tus clientes y tu competencia para entender el contexto real de tu marca.</p>
                  </div>
                </div>
                <div class="pm-process-arrow reveal d1"><v-icon color="rgba(161,0,255,0.3)" size="24">mdi-chevron-right</v-icon></div>
                <div class="pm-process-item reveal d2">
                  <div class="pm-process-num">2</div>
                  <div class="pm-process-body glass-card pa-6">
                    <v-icon size="22" color="#a100ff" class="mb-3">mdi-pencil-ruler</v-icon>
                    <h3 class="pm-process-title">Construcción</h3>
                    <p class="pm-card-desc">Desarrollamos cada módulo del manual: visual, tipografía, color, aplicaciones y comunicación. Con revisión de tu parte en cada entrega.</p>
                  </div>
                </div>
                <div class="pm-process-arrow reveal d2"><v-icon color="rgba(161,0,255,0.3)" size="24">mdi-chevron-right</v-icon></div>
                <div class="pm-process-item reveal d3">
                  <div class="pm-process-num">3</div>
                  <div class="pm-process-body glass-card pa-6">
                    <v-icon size="22" color="#a100ff" class="mb-3">mdi-package-variant-closed-check</v-icon>
                    <h3 class="pm-process-title">Entrega final</h3>
                    <p class="pm-card-desc">Recibes el manual completo en PDF editable, junto con todos los archivos fuente y una sesión de cierre para resolver dudas.</p>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ─── CTA / FEEDBACK ──────────────────────────────────────── -->
      <section class="pm-section pm-cta-section">
        <div class="pm-cta-glow" />
        <div class="hero-grid" style="opacity:0.4" />
        <v-container style="position:relative; z-index:1">
          <v-row justify="center">
            <v-col cols="12" md="8" lg="6" class="text-center">

              <div class="reveal section-badge mx-auto mb-6">
                <v-icon size="15">mdi-star-outline</v-icon>
                Tu opinión importa
              </div>

              <h2 class="reveal d1 pm-section-title mb-4">
                ¿Qué te pareció<br />
                <span class="gradient-text">esta propuesta?</span>
              </h2>
              <p class="reveal d2 pm-section-sub mb-10">
                Nos tomamos el tiempo de preparar esto especialmente para ti.
                Cuéntanos si va con lo que buscas.
              </p>

              <div class="reveal d3">
                <a href="/brief-manuales" class="pm-cta-main-btn">
                  <v-icon size="18" start>mdi-arrow-right-circle</v-icon>
                  Me encantó, quiero avanzar
                </a>
              </div>

            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ─── FOOTER ───────────────────────────────────────────────── -->
      <footer class="pm-footer">
        <v-container>
          <div class="d-flex flex-wrap justify-space-between align-center" style="gap:16px">
            <img :src="logo" alt="Conectux" class="pm-footer-logo" />
            <p class="pm-footer-copy">© {{ new Date().getFullYear() }} Conectux LLC · Identidad y Marketing Digital</p>
          </div>
        </v-container>
      </footer>

    </div>
  </v-app>
</template>

<style scoped>
/* ─── Navbar ──────────────────────────────────────────────────── */
.pm-navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  background: rgba(9, 9, 15, 0.85);
  border-bottom: 1px solid rgba(161, 0, 255, 0.1);
  height: 72px;
  display: flex;
  align-items: center;
}
.pm-navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pm-logo {
  height: 32px;
  width: auto;
  filter: brightness(0) invert(1);
}

/* ─── Hero ────────────────────────────────────────────────────── */
.pm-hero {
  position: relative;
  min-height: 100vh;
  background: #09090f;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}
.blob-1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(161,0,255,0.22) 0%, transparent 65%);
  top: -200px; left: -200px;
  animation: blobFloat1 10s ease-in-out infinite;
}
.blob-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 65%);
  bottom: -150px; right: -100px;
  animation: blobFloat2 13s ease-in-out infinite;
}
.blob-3 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(161,0,255,0.16) 0%, transparent 65%);
  top: 30%; right: 10%;
  animation: blobFloat3 9s ease-in-out infinite;
}
@keyframes blobFloat1 {
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(60px,80px) scale(1.05); }
}
@keyframes blobFloat2 {
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(-80px,-60px) scale(1.08); }
}
@keyframes blobFloat3 {
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(-40px,40px) scale(0.95); }
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(161,0,255,0.08) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
}
.pm-hero-container {
  position: relative;
  z-index: 1;
  padding-top: 140px;
  padding-bottom: 80px;
}
.pm-hero-title {
  font-size: clamp(2.8rem, 5.5vw, 5rem);
  font-weight: 900;
  line-height: 1.06;
  color: #fff;
  letter-spacing: -2px;
}
.pm-hero-sub {
  font-size: 1.15rem;
  color: rgba(160,160,184,0.9);
  line-height: 1.8;
  max-width: 620px;
}
.pm-hero-sub strong { color: #fff; font-weight: 700; }

.pm-hero-chips { gap: 10px; }
.pm-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(74,222,128,0.07);
  border: 1px solid rgba(74,222,128,0.2);
  border-radius: 100px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(200,240,200,0.9);
}
.pm-hero-scroll {
  margin-top: 48px;
  animation: scrollBounce 2s ease-in-out infinite;
}
@keyframes scrollBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}


/* ─── Sections ────────────────────────────────────────────────── */
.pm-section {
  position: relative;
  background: #09090f;
  padding: 100px 0;
  overflow: hidden;
}
.pm-section-alt { background: #0d0d1e; }
.pm-blob-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(161,0,255,0.05) 0%, transparent 65%);
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.pm-section-title {
  font-size: clamp(1.7rem, 3.8vw, 2.7rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.5px;
  margin-bottom: 14px;
}
.pm-section-sub {
  font-size: 1rem;
  color: rgba(160,160,184,0.85);
  line-height: 1.8;
  max-width: 580px;
  margin: 0 auto;
}

/* ─── Cards comunes ───────────────────────────────────────────── */
.pm-card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}
.pm-card-desc {
  font-size: 14.5px;
  color: rgba(160,160,184,0.85);
  line-height: 1.75;
}
.pm-problem-icon {
  width: 60px; height: 60px;
  border-radius: 50%;
  border: 1px solid;
  display: flex; align-items: center; justify-content: center;
}
.pm-problem-card { transition: all 0.35s ease; }

/* ─── Brand visual card ───────────────────────────────────────── */
.pm-bv-card {
  overflow: hidden;
}
.pm-bv-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 32px;
  background: linear-gradient(135deg, rgba(161,0,255,0.12), rgba(0,212,255,0.06));
  border-bottom: 1px solid rgba(161,0,255,0.14);
}
.pm-bv-header-icon {
  width: 52px; height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #a100ff, #7b00cc);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(161,0,255,0.4);
}
.pm-bv-title {
  font-size: 16px; font-weight: 700; color: #fff; margin: 0;
}
.pm-bv-sub {
  font-size: 12px; color: rgba(160,160,184,0.55); margin: 3px 0 0;
}
.pm-bv-badge {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: rgba(74,222,128,0.9);
  background: rgba(74,222,128,0.1);
  border: 1px solid rgba(74,222,128,0.25);
  border-radius: 100px;
  padding: 5px 12px;
}
.pm-bv-modules {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.pm-bv-module {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.pm-bv-mod-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: rgba(161,0,255,0.08);
  border: 1px solid rgba(161,0,255,0.15);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.pm-bv-mod-body { flex: 1; }
.pm-bv-mod-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.pm-bv-mod-name {
  font-size: 13px;
  font-weight: 600;
  color: rgba(220,220,240,0.9);
}
.pm-bv-mod-pct {
  font-size: 12px;
  font-weight: 700;
  color: rgba(161,0,255,0.8);
}
.pm-bv-bar {
  height: 6px;
  background: rgba(161,0,255,0.1);
  border-radius: 100px;
  overflow: hidden;
}
.pm-bv-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #a100ff, #c84bff);
  border-radius: 100px;
  animation: fillBar 1.8s cubic-bezier(0.4,0,0.2,1) forwards;
  transform-origin: left;
}
@keyframes fillBar {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
.pm-bv-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 32px;
  background: rgba(74,222,128,0.04);
  border-top: 1px solid rgba(74,222,128,0.1);
}
.pm-bv-complete {
  font-size: 13px;
  color: rgba(74,222,128,0.85);
  font-weight: 500;
}
.pm-bv-pages {
  font-size: 12px;
  color: rgba(160,160,184,0.4);
  font-weight: 500;
}

/* ─── Steps (deliverables) ────────────────────────────────────── */
.pm-steps-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 820px;
  margin: 0 auto;
}
.pm-step-row {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 20px;
  align-items: flex-start;
}
.pm-step-num-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
}
.pm-step-num {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a100ff, #7b00cc);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(161,0,255,0.35);
}
.pm-step-line {
  width: 2px; flex: 1; min-height: 36px;
  background: linear-gradient(180deg, rgba(161,0,255,0.4), rgba(161,0,255,0.05));
  margin: 8px 0;
}
.pm-step-icon {
  width: 46px; height: 46px;
  border-radius: 13px;
  background: rgba(161,0,255,0.1);
  border: 1px solid rgba(161,0,255,0.22);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}
.pm-step-card:hover .pm-step-icon {
  background: rgba(161,0,255,0.2);
  transform: scale(1.08);
}
.pm-step-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
}
.pm-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(200,240,200,0.9);
  background: rgba(74,222,128,0.08);
  border: 1px solid rgba(74,222,128,0.2);
  border-radius: 100px;
  padding: 4px 11px;
}

/* ─── Why card ────────────────────────────────────────────────── */
.pm-why-card { overflow: hidden; }

.pm-why-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 32px;
  background: linear-gradient(135deg, rgba(161,0,255,0.12), rgba(0,212,255,0.06));
  border-bottom: 1px solid rgba(161,0,255,0.14);
}
.pm-why-header-icon {
  width: 52px; height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #a100ff, #7b00cc);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(161,0,255,0.4);
}
.pm-why-header-title {
  font-size: 16px; font-weight: 700; color: #fff; margin: 0;
}
.pm-why-header-sub {
  font-size: 12px; color: rgba(160,160,184,0.55); margin: 3px 0 0;
}

.pm-why-list {
  padding: 8px 32px;
  display: flex;
  flex-direction: column;
}
.pm-why-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(161,0,255,0.07);
}
.pm-why-row:last-child { border-bottom: none; }
.pm-why-row-icon {
  width: 38px; height: 38px;
  border-radius: 11px;
  background: rgba(161,0,255,0.08);
  border: 1px solid rgba(161,0,255,0.15);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.pm-why-row-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: rgba(220,220,240,0.9);
  line-height: 1.45;
  margin: 0;
}
.pm-why-check { flex-shrink: 0; }

.pm-why-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: rgba(161,0,255,0.04);
  border-top: 1px solid rgba(161,0,255,0.1);
  font-size: 12px;
  font-weight: 500;
  color: rgba(161,0,255,0.65);
}

/* ─── Offer / pricing ─────────────────────────────────────────── */
.pm-offer-section {
  border-top: 1px solid rgba(161,0,255,0.12);
}
.pm-price-card {
  position: relative;
  overflow: hidden;
  padding: 56px 48px;
}
.pm-price-glow {
  position: absolute;
  top: -100px; left: 50%;
  transform: translateX(-50%);
  width: 500px; height: 300px;
  background: radial-gradient(ellipse, rgba(161,0,255,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.pm-price-label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(160,160,184,0.6);
  margin: 0;
}
.pm-price-now {
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -2px;
}
.pm-price-period {
  font-size: 14px;
  color: rgba(160,160,184,0.55);
  margin: 8px 0 0;
}
.pm-price-divider {
  border: none;
  border-top: 1px solid rgba(161,0,255,0.12);
}
.pm-payment-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(160,160,184,0.5);
  margin: 0;
}
.pm-payment-steps {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
.pm-payment-step {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(161,0,255,0.05);
  border: 1px solid rgba(161,0,255,0.14);
  border-radius: 16px;
  padding: 20px 28px;
  width: 100%;
  max-width: 480px;
}
.pm-payment-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 0;
}
.pm-payment-line {
  width: 2px; height: 16px;
  background: rgba(161,0,255,0.3);
}
.pm-payment-num {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #c84bff, #a100ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
  min-width: 64px;
}
.pm-payment-step-title {
  font-size: 15px; font-weight: 700; color: #fff; margin: 0 0 4px;
}
.pm-payment-step-desc {
  font-size: 13px; color: rgba(160,160,184,0.7); margin: 0;
}
.pm-includes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  text-align: left;
}
@media (max-width: 600px) {
  .pm-includes-grid { grid-template-columns: 1fr; }
  .pm-price-card { padding: 36px 20px; }
}
.pm-include-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(220,220,240,0.85);
  font-weight: 500;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(161,0,255,0.08);
  border-radius: 10px;
  padding: 10px 14px;
}
.pm-timeline-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(160,160,184,0.75);
}
.pm-timeline-row strong { color: #fff; }

/* ─── Proceso ─────────────────────────────────────────────────── */
.pm-process-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: start;
  gap: 8px;
}
@media (max-width: 768px) {
  .pm-process-grid {
    grid-template-columns: 1fr;
  }
  .pm-process-arrow { display: none; }
}
.pm-process-item { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.pm-process-num {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a100ff, #7b00cc);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(161,0,255,0.3);
}
.pm-process-body { width: 100%; }
.pm-process-title {
  font-size: 1rem; font-weight: 700; color: #fff; margin: 0 0 8px;
}
.pm-process-arrow {
  display: flex;
  align-items: center;
  padding-top: 52px;
}

/* ─── CTA / Feedback ──────────────────────────────────────────── */
.pm-cta-section {
  background: #09090f;
  overflow: hidden;
}
.pm-cta-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 900px; height: 600px;
  background: radial-gradient(ellipse, rgba(161,0,255,0.1) 0%, transparent 65%);
  filter: blur(60px);
  pointer-events: none;
}
.pm-cta-main-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #a100ff, #7b00cc);
  color: #fff;
  text-decoration: none;
  border-radius: 100px;
  padding: 0 36px;
  height: 56px;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 6px 28px rgba(161,0,255,0.45);
  transition: all 0.3s ease;
  letter-spacing: 0.2px;
}
.pm-cta-main-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 36px rgba(161,0,255,0.6);
}

/* ─── Footer ──────────────────────────────────────────────────── */
.pm-footer {
  background: #060610;
  border-top: 1px solid rgba(161,0,255,0.08);
  padding: 28px 0;
}
.pm-footer-logo {
  height: 26px;
  filter: brightness(0) invert(1);
  opacity: 0.5;
}
.pm-footer-copy {
  font-size: 13px;
  color: rgba(90,90,120,0.9);
  margin: 0;
}

/* ─── Fade-up transition ──────────────────────────────────────── */
.fade-up-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* ─── Vuetify overrides ───────────────────────────────────────── */
:deep(.v-main),
:deep(.v-main__wrap) {
  background-color: #09090f !important;
}
:deep(.v-btn) {
  text-transform: none !important;
}

@media (max-width: 600px) {
  .pm-step-row { grid-template-columns: 52px 1fr; gap: 12px; }
  .pm-step-num { width: 38px; height: 38px; font-size: 13px; }
  .pm-hero-title { letter-spacing: -1px; }
}
</style>
