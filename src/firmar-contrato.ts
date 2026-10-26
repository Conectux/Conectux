import { createApp } from 'vue'
import './style.css'
import FirmarContrato from './pages/FirmarContrato.vue'
import vuetify from './plugins/vuetify'

const app = createApp(FirmarContrato)
app.use(vuetify)
app.mount('#app')
