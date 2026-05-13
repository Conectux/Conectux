import { createApp } from 'vue'
import './style.css'
import BriefSalud from './pages/BriefSalud.vue'
import vuetify from './plugins/vuetify'

const app = createApp(BriefSalud)
app.use(vuetify)
app.mount('#app')
