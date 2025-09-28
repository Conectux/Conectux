<script setup lang="ts">
const testimonials = [
  {
    name: "Hotel Central Plaza",
    position: "Hotelería y turismo",
    comment:
      "Conectux entendió que nuestro hotel no solo vende habitaciones, sino experiencias. Gracias a su estrategia digital aumentamos en un 35% las reservas directas en solo 3 meses.",
  },
  {
    name: "Healthy Pets",
    position: "Industria de alimentos para mascotas",
    comment:
      "Pasamos de ser una marca desconocida a competir con grandes del mercado. Lo mejor fue sentir que no éramos un cliente más, sino un aliado. Hoy nuestros productos llegan a más familias con mascotas felices.",
  },
  {
    name: "Gerpar",
    position: "Industria textil",
    comment:
      "Nuestro reto era mostrar procesos industriales de forma atractiva. Conectux logró que lo técnico se viera cercano, y eso generó confianza en nuevos distribuidores.",
  },
];
</script>

<template>
  <v-container class="py-16 testimonials-section">
    <v-row justify="center">
      <v-col cols="12" class="text-center mb-12">
        <h2 class="text-h3 font-weight-bold">Lo que nuestros clientes dicen</h2>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            cols="12"
            md="4"
          >
            <v-card class="pa-6" elevation="2">
              <v-card-text>
                <v-icon color="primary" size="36" class="mb-4"
                  >mdi-format-quote-open</v-icon
                >
                <p class="text-body-1 mb-4">{{ testimonial.comment }}</p>
                <div class="d-flex align-center">
                  <v-avatar color="primary" class="mr-4">
                    <span class="text-h6 white--text">{{
                      testimonial.name[0]
                    }}</span>
                  </v-avatar>
                  <div>
                    <h4 class="text-subtitle-1 font-weight-bold">
                      {{ testimonial.name }}
                    </h4>
                    <p class="text-caption">{{ testimonial.position }}</p>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
