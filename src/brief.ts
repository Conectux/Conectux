import { createApp } from 'vue'
import './style.css'
import Brief from './pages/Brief.vue'
import vuetify from './plugins/vuetify'

const app = createApp(Brief)
app.use(vuetify)
app.mount('#app')
