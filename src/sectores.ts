import { createApp } from 'vue'
import './style.css'
import Sectores from './pages/Sectores.vue'
import vuetify from './plugins/vuetify'

const app = createApp(Sectores)
app.use(vuetify)
app.mount('#app')
