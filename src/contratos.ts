import { createApp } from 'vue'
import './style.css'
import Contratos from './pages/Contratos.vue'
import vuetify from './plugins/vuetify'

const app = createApp(Contratos)
app.use(vuetify)
app.mount('#app')
