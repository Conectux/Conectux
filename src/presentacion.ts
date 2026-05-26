import { createApp } from 'vue'
import './style.css'
import Presentacion from './pages/Presentacion.vue'
import vuetify from './plugins/vuetify'

const app = createApp(Presentacion)
app.use(vuetify)
app.mount('#app')
