import { createApp } from 'vue'
import './style.css'
import Cotizaciones from './pages/Cotizaciones.vue'
import vuetify from './plugins/vuetify'

const app = createApp(Cotizaciones)
app.use(vuetify)
app.mount('#app')
