<script setup>
import Cotizador from '../components/Cotizador.vue'
</script>

<template>
  <v-app>
    <main class="cz-page">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="11" lg="10" xl="9">
            <Cotizador />
          </v-col>
        </v-row>
      </v-container>
    </main>
  </v-app>
</template>

<style scoped>
.cz-page {
  min-height: 100vh;
  background: #09090f;
  padding: 16px 0 24px;
}
:deep(.v-btn) {
  text-transform: none !important;
}
@media (min-width: 600px) {
  .cz-page { padding-top: 40px; }
}
</style>
