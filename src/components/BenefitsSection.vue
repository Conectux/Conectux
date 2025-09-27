<script setup lang="ts">
const benefits = [
  {
    icon: "mdi-rocket-launch",
    title: "Impulso de Ventas",
    description: "Incrementa tus conversiones con estrategias probadas",
    stats: "+150%",
  },
  {
    icon: "mdi-account-group",
    title: "Mayor Alcance",
    description: "Llega a tu audiencia ideal en el momento preciso",
    stats: "+200K",
  },
  {
    icon: "mdi-chart-bar",
    title: "ROI Optimizado",
    description: "Maximiza el retorno de tu inversión publicitaria",
    stats: "+300%",
  },
];
</script>

<template>
  <v-container
    fluid
    class="benefits-section py-16"
    style="background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)"
  >
    <v-row justify="center" class="mb-16">
      <v-col cols="12" md="8" class="text-center">
        <h2 class="text-h3 font-weight-bold mb-4">Qué podemos hacer por ti</h2>
        <p class="text-subtitle-1 text-grey-darken-1">
          Transformamos ideas en resultados medibles y escalables
        </p>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-row>
          <v-col
            v-for="benefit in benefits"
            :key="benefit.title"
            cols="12"
            md="4"
          >
            <v-card class="benefit-card h-100" elevation="0">
              <v-card-item class="text-center">
                <v-avatar color="primary" size="80" class="mb-6">
                  <v-icon color="white" size="40">
                    {{ benefit.icon }}
                  </v-icon>
                </v-avatar>
                <div class="text-h2 font-weight-black mb-4 primary--text">
                  {{ benefit.stats }}
                </div>
                <v-card-title
                  class="text-h5 font-weight-bold mb-2 justify-center"
                >
                  {{ benefit.title }}
                </v-card-title>
                <v-card-text>
                  <p class="text-body-1">{{ benefit.description }}</p>
                </v-card-text>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-16">
      <v-col cols="12" class="text-center">
        <v-btn
          color="primary"
          :href="'https://wa.me/573242947897'"
          target="_blank"
          size="x-large"
          elevation="2"
          class="px-8"
        >
          Hablemos de tu proyecto
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.benefit-card {
  background: transparent;
  transition: all 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-10px);
}
</style>
