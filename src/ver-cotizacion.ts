import { createApp } from 'vue'
import './style.css'
import VerCotizacion from './pages/VerCotizacion.vue'
import vuetify from './plugins/vuetify'

const app = createApp(VerCotizacion)
app.use(vuetify)
app.mount('#app')
