import { createApp } from 'vue'
import './style.css'
import BriefManuales from './pages/BriefManuales.vue'
import vuetify from './plugins/vuetify'

const app = createApp(BriefManuales)
app.use(vuetify)
app.mount('#app')
