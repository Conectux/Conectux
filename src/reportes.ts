import { createApp } from 'vue'
import './style.css'
import Reportes from './pages/Reportes.vue'
import vuetify from './plugins/vuetify'

const app = createApp(Reportes)
app.use(vuetify)
app.mount('#app')
