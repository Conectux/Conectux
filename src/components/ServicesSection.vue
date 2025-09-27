<script setup lang="ts">
const services = [
  {
    icon: "mdi-trending-up",
    title: "Marketing Digital",
    description:
      "Estrategias personalizadas para aumentar tu presencia online y generar leads cualificados.",
    features: ["SEO", "SEM", "Social Media", "Content Marketing"],
  },
  {
    icon: "mdi-video",
    title: "Contenido & UGC",
    description:
      "Contenido auténtico y creativo que conecta marcas con personas reales.",
    features: [
      "Reels & TikToks",
      "Fotografía de producto",
      "Videos UGC",
      "Storytelling para marcas",
    ],
  },
  {
    icon: "mdi-bullhorn",
    title: "Publicidad Digital",
    description:
      "Campañas publicitarias optimizadas para maximizar tu inversión.",
    features: ["Google Ads", "Meta Ads", "TikTok Ads", "Display Marketing"],
  },
  {
    icon: "mdi-chart-line",
    title: "Analítica Digital",
    description:
      "Análisis profundo de datos para tomar decisiones informadas y optimizar resultados.",
    features: ["Google Analytics", "Data Studio", "KPIs", "ROI Tracking"],
  },
  {
    icon: "mdi-palette",
    title: "Diseño Creativo",
    description:
      "Diseños únicos que capturan la esencia de tu marca y conectan con tu audiencia.",
    features: ["Branding", "UI/UX", "Motion Graphics", "Social Media Design"],
  },
];
</script>

<template>
  <v-container class="services-section py-16">
    <v-row justify="center" class="mb-16">
      <v-col cols="12" md="8" class="text-center">
        <h2 class="text-h3 font-weight-black mb-4">
          De la idea a los resultados
        </h2>
        <p class="text-subtitle-1 text-grey-darken-1">
          Conectamos marketing, contenido y ventas para llevar tu marca más
          lejos
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="service in services"
        :key="service.title"
        cols="12"
        md="6"
        lg="3"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 8 : 0"
            class="service-card h-100"
            height="100%"
          >
            <div class="service-card-content">
              <div
                class="service-icon-wrapper"
                :class="{ 'icon-hover': isHovering }"
              >
                <v-icon :color="isHovering ? 'white' : 'primary'" size="32">
                  {{ service.icon }}
                </v-icon>
              </div>
              <v-card-title class="text-h5 font-weight-bold mb-2 pt-4">
                {{ service.title }}
              </v-card-title>
              <v-card-text>
                <p class="mb-6">{{ service.description }}</p>
                <div class="features-grid">
                  <v-chip
                    v-for="feature in service.features"
                    :key="feature"
                    color="primary"
                    variant="flat"
                    size="small"
                    class="feature-chip"
                    :class="{ 'feature-hover': isHovering }"
                  >
                    {{ feature }}
                  </v-chip>
                </div>
              </v-card-text>
            </div>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.service-card {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px !important;
  border: 1px solid rgba(161, 0, 255, 0.1);
  overflow: hidden;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
}

.service-card:hover {
  border-color: rgba(161, 0, 255, 0.3);
  transform: translateY(-10px);
}

.service-card-content {
  padding: 2rem;
}

.service-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(161, 0, 255, 0.1);
  transition: all 0.3s ease;
}

.icon-hover {
  background: linear-gradient(45deg, #a100ff, #7b00ff);
  transform: rotate(5deg);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.feature-chip {
  transition: all 0.3s ease;
  font-weight: 500;
}

.feature-hover {
  background: linear-gradient(45deg, #a100ff, #7b00ff) !important;
  color: white !important;
  transform: scale(1.05);
}
</style>
