import { createApp } from 'vue'
import './style.css'
import PresentacionSalud from './pages/PresentacionSalud.vue'
import vuetify from './plugins/vuetify'

const app = createApp(PresentacionSalud)
app.use(vuetify)
app.mount('#app')
