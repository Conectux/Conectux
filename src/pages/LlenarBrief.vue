<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import logo from '../assets/logo-conectux.png'
import { SECCIONES_BRIEF, TOTAL_PREGUNTAS } from '../data/brief-preguntas.js'

const token = new URLSearchParams(location.search).get('token') || ''

const cargando = ref(true)
const error = ref('')
const cliente = ref('')
const respuestas = reactive({})

const guardando = ref(false)
const guardado = ref(false)
const errorGuardar = ref('')

onMounted(async () => {
  if (!token) {
    error.value = 'Este link no es válido — falta el código del brief.'
    cargando.value = false
    return
  }
  try {
    const res = await fetch(`/api/brief?token=${encodeURIComponent(token)}`)
    if (!res.ok) {
      error.value = 'No se encontró este brief. Verifica el link.'
      return
    }
    const data = await res.json()
    cliente.value = data.cliente
    Object.assign(respuestas, data.respuestas || {})
  } catch {
    error.value = 'No se pudo cargar el brief. Intenta de nuevo.'
  } finally {
    cargando.value = false
  }
})

const respondidas = computed(() => SECCIONES_BRIEF.flatMap((s) => s.preguntas).filter((p) => {
  const v = respuestas[p.id]
  return Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim())
}).length)

const tieneOpcion = (preguntaId, opcion) => (respuestas[preguntaId] || []).includes(opcion)

const toggleCheckbox = (preguntaId, opcion) => {
  const actual = respuestas[preguntaId] || []
  const idx = actual.indexOf(opcion)
  const nuevo = [...actual]
  if (idx === -1) nuevo.push(opcion); else nuevo.splice(idx, 1)
  respuestas[preguntaId] = nuevo
}

const guardar = async () => {
  guardando.value = true
  errorGuardar.value = ''
  guardado.value = false
  try {
    const res = await fetch('/api/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, respuestas: { ...respuestas } }),
    })
    if (!res.ok) throw new Error()
    guardado.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => { guardado.value = false }, 4000)
  } catch {
    errorGuardar.value = 'No se pudo guardar. Intenta de nuevo.'
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <div class="lb-page">
    <div class="lb-glow"></div>

    <div v-if="cargando" class="lb-estado">Cargando brief…</div>
    <div v-else-if="error" class="lb-estado lb-estado--error">{{ error }}</div>

    <template v-else>
      <header class="lb-header">
        <img :src="logo" alt="Conectux" class="lb-logo" />
        <div>
          <h1>Brief de marca</h1>
          <p>{{ cliente }}</p>
        </div>
      </header>

      <div class="lb-intro glass-card">
        <p>Cuéntanos todo sobre tu marca, tus objetivos y tu cliente ideal — entre más completo, mejor será la estrategia que construyamos. No tienes que terminarlo de una sola vez: puedes guardar tu progreso y volver a este mismo link cuando quieras para completarlo o editarlo.</p>
        <div class="lb-progreso">
          <div class="lb-progreso-barra"><div class="lb-progreso-fill" :style="{ width: `${(respondidas / TOTAL_PREGUNTAS) * 100}%` }"></div></div>
          <span>{{ respondidas }}/{{ TOTAL_PREGUNTAS }} preguntas respondidas</span>
        </div>
      </div>

      <form class="lb-form" @submit.prevent="guardar">
        <section v-for="seccion in SECCIONES_BRIEF" :key="seccion.titulo" class="lb-seccion glass-card">
          <h2>{{ seccion.titulo }}</h2>

          <div v-for="p in seccion.preguntas" :key="p.id" class="lb-pregunta">
            <label class="lb-label">{{ p.label }} <span v-if="p.requerido" class="lb-obligatorio">*</span></label>

            <input v-if="p.tipo === 'texto'" class="lb-input" v-model="respuestas[p.id]" type="text" />

            <textarea v-else-if="p.tipo === 'parrafo'" class="lb-input lb-textarea" v-model="respuestas[p.id]" rows="3"></textarea>

            <div v-else-if="p.tipo === 'opcion'" class="lb-opciones">
              <label v-for="o in p.opciones" :key="o" class="lb-opcion">
                <input type="radio" :name="p.id" :value="o" v-model="respuestas[p.id]" /> {{ o }}
              </label>
              <label v-if="p.otros" class="lb-opcion">
                <input type="radio" :name="p.id" value="Otros" v-model="respuestas[p.id]" /> Otros
              </label>
              <input
                v-if="p.otros && respuestas[p.id] === 'Otros'"
                class="lb-input lb-input--otros" v-model="respuestas[p.id + '_otros']"
                placeholder="¿Cuál?"
              />
            </div>

            <div v-else-if="p.tipo === 'checkbox'" class="lb-opciones">
              <label v-for="o in p.opciones" :key="o" class="lb-opcion">
                <input type="checkbox" :checked="tieneOpcion(p.id, o)" @change="toggleCheckbox(p.id, o)" /> {{ o }}
              </label>
              <label v-if="p.otros" class="lb-opcion">
                <input type="checkbox" :checked="tieneOpcion(p.id, 'Otros')" @change="toggleCheckbox(p.id, 'Otros')" /> Otros
              </label>
              <input
                v-if="p.otros && tieneOpcion(p.id, 'Otros')"
                class="lb-input lb-input--otros" v-model="respuestas[p.id + '_otros']"
                placeholder="¿Cuál?"
              />
            </div>
          </div>
        </section>

        <p v-if="errorGuardar" class="lb-error">{{ errorGuardar }}</p>
        <p v-if="guardado" class="lb-exito">✅ Guardado — puedes seguir completando o volver cuando quieras con el mismo link.</p>

        <button type="submit" class="lb-btn-guardar" :disabled="guardando">
          {{ guardando ? 'Guardando…' : 'Guardar respuestas' }}
        </button>
      </form>

      <button class="lb-btn-flotante" type="button" :disabled="guardando" @click="guardar">
        <v-icon icon="mdi-content-save-outline" size="18" class="mr-1" />
        {{ guardando ? 'Guardando…' : 'Guardar' }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.lb-page {
  min-height: 100vh;
  background: var(--dark-bg);
  padding: 40px 20px 100px;
  position: relative;
  overflow: hidden;
}
.lb-glow {
  position: absolute; width: 700px; height: 700px; border-radius: 50%;
  top: -250px; left: 50%; transform: translateX(-50%);
  background: radial-gradient(circle, rgba(161, 0, 255, 0.16) 0%, transparent 65%);
  pointer-events: none;
}
.lb-estado { color: var(--text-secondary); font-size: 14px; text-align: center; padding: 80px 20px; }
.lb-estado--error { color: #fca5a5; }

.lb-header {
  position: relative; z-index: 1; max-width: 720px; margin: 0 auto 20px;
  display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
}
.lb-logo { width: 110px; }
.lb-header h1 { color: #fff; font-size: 22px; margin: 0 0 2px; font-weight: 800; }
.lb-header p { color: var(--text-secondary); font-size: 13px; margin: 0; }

.lb-intro {
  position: relative; z-index: 1; max-width: 720px; margin: 0 auto 24px; padding: 18px 20px;
}
.lb-intro p { color: var(--text-secondary); font-size: 13px; line-height: 1.6; margin: 0 0 14px; }
.lb-progreso { display: flex; align-items: center; gap: 10px; font-size: 11.5px; color: var(--text-muted); }
.lb-progreso-barra { flex: 1; height: 6px; border-radius: 4px; background: rgba(255,255,255,0.08); overflow: hidden; }
.lb-progreso-fill { height: 100%; background: var(--gradient); transition: width 0.3s ease; }

.lb-form { position: relative; z-index: 1; max-width: 720px; margin: 0 auto; }
.lb-seccion { padding: 20px 22px; margin-bottom: 16px; }
.lb-seccion h2 { color: var(--primary-light); font-size: 14px; font-weight: 700; margin: 0 0 16px; }

.lb-pregunta { margin-bottom: 18px; }
.lb-pregunta:last-child { margin-bottom: 0; }
.lb-label { display: block; font-size: 12.5px; color: var(--text-secondary); margin-bottom: 7px; font-weight: 600; line-height: 1.4; }
.lb-obligatorio { color: #fca5a5; }

.lb-input {
  width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 8px;
  padding: 9px 12px; color: #fff; color-scheme: dark; font-family: inherit; font-size: 13px;
}
.lb-textarea { resize: vertical; }
.lb-input--otros { margin-top: 8px; }

.lb-opciones { display: flex; flex-direction: column; gap: 8px; }
.lb-opcion { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); cursor: pointer; }

.lb-error { color: #fca5a5; font-size: 12.5px; margin: 0 0 14px; }
.lb-exito { color: #86efac; font-size: 12.5px; margin: 0 0 14px; }

.lb-btn-guardar {
  width: 100%; background: var(--gradient); color: #fff; border: none; border-radius: 12px;
  padding: 14px; font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer;
  transition: filter 0.2s ease; margin-bottom: 40px;
}
.lb-btn-guardar:hover { filter: brightness(1.1); }
.lb-btn-guardar:disabled { opacity: 0.6; cursor: default; }

.lb-btn-flotante {
  position: fixed; bottom: 20px; right: 20px; z-index: 10;
  display: inline-flex; align-items: center; background: var(--gradient); color: #fff;
  border: none; border-radius: 999px; padding: 12px 20px; font-size: 13px; font-weight: 700;
  font-family: inherit; cursor: pointer; box-shadow: 0 8px 24px rgba(161, 0, 255, 0.4);
}
.lb-btn-flotante:disabled { opacity: 0.6; cursor: default; }

@media (max-width: 480px) {
  .lb-logo { width: 90px; }
  .lb-seccion { padding: 16px 16px; }
}
</style>
