import { createApp } from 'vue'
import './style.css'
import PropuestaManual from './pages/PropuestaManual.vue'
import vuetify from './plugins/vuetify'

const app = createApp(PropuestaManual)
app.use(vuetify)
app.mount('#app')
