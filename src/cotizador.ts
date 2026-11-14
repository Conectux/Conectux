import { createApp } from 'vue'
import './style.css'
import CotizadorPage from './pages/CotizadorPage.vue'
import vuetify from './plugins/vuetify'

const app = createApp(CotizadorPage)
app.use(vuetify)
app.mount('#app')
