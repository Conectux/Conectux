<script setup lang="ts">
const form = {
  name: '',
  email: '',
  phone: '',
  message: ''
}

const submit = () => {
  // Handle form submission
  console.log('Form submitted:', form)
}
</script>

<template>
  <v-container class="py-16">
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <h2 class="text-h3 font-weight-bold mb-8">¿Listo para despegar?</h2>
        <v-card class="pa-6" elevation="2">
          <v-form @submit.prevent="submit">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.name"
                  label="Nombre"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.phone"
                  label="Teléfono"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.message"
                  label="Mensaje"
                  variant="outlined"
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="12" class="text-center">
                <v-btn
                  color="primary"
                  size="x-large"
                  type="submit"
                  elevation="2"
                >
                  Enviar mensaje
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>