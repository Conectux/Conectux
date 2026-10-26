import { createApp } from 'vue'
import './style.css'
import LlenarBrief from './pages/LlenarBrief.vue'
import vuetify from './plugins/vuetify'

const app = createApp(LlenarBrief)
app.use(vuetify)
app.mount('#app')
