import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#A100FF',
          secondary: '#111111',
          accent: '#E8E8E8',
          background: '#FFFFFF'
        }
      }
    }
  }
})