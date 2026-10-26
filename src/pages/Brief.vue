<script setup>
import { ref, onMounted } from 'vue'
import logo from '../assets/logo-conectux.png'
import { TOTAL_PREGUNTAS } from '../data/brief-preguntas.js'

const autenticado = ref(false)
const verificando = ref(true)
const passwordInput = ref('')
const loginError = ref('')
const loginCargando = ref(false)

const briefs = ref([])
const cargandoLista = ref(false)

const dialogNuevo = ref(false)
const nombreCliente = ref('')
const creando = ref(false)
const errorCrear = ref('')
const linkGenerado = ref('')
const copiado = ref(false)

const eliminandoId = ref(null)

const cargarBriefs = async () => {
  cargandoLista.value = true
  const res = await fetch('/api/brief', { cache: 'no-store' })
  if (res.status === 401) {
    autenticado.value = false
  } else if (res.ok) {
    autenticado.value = true
    briefs.value = (await res.json()).sort((a, b) => b.creado_en.localeCompare(a.creado_en))
  }
  cargandoLista.value = false
  verificando.value = false
}

onMounted(cargarBriefs)

const iniciarSesion = async () => {
  loginCargando.value = true
  loginError.value = ''
  try {
    const res = await fetch('/api/contratos-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput.value }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      loginError.value = data.error || 'No se pudo iniciar sesión'
      return
    }
    passwordInput.value = ''
    await cargarBriefs()
  } catch {
    loginError.value = 'No se pudo conectar. Intenta de nuevo.'
  } finally {
    loginCargando.value = false
  }
}

const abrirNuevo = () => {
  nombreCliente.value = ''
  errorCrear.value = ''
  linkGenerado.value = ''
  copiado.value = false
  dialogNuevo.value = true
}

const crearBrief = async () => {
  if (!nombreCliente.value.trim()) {
    errorCrear.value = 'Escribe el nombre del cliente.'
    return
  }
  creando.value = true
  errorCrear.value = ''
  try {
    const res = await fetch('/api/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'crear', cliente: nombreCliente.value.trim() }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'No se pudo crear el brief')
    linkGenerado.value = data.linkCliente
    await cargarBriefs()
  } catch (e) {
    errorCrear.value = e.message || 'No se pudo crear el brief.'
  } finally {
    creando.value = false
  }
}

const linkDe = (b) => `${location.origin}/llenar-brief/?token=${b.token}`

const copiarLink = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto)
    copiado.value = true
    setTimeout(() => { copiado.value = false }, 2000)
  } catch {
    window.prompt('Copia el link:', texto)
  }
}

const eliminarBrief = async (b) => {
  const ok = window.confirm(`¿Eliminar el brief de "${b.cliente}"? Esta acción no se puede deshacer.`)
  if (!ok) return
  eliminandoId.value = b.id
  try {
    const res = await fetch('/api/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'eliminar', id: b.id }),
    })
    if (!res.ok) throw new Error()
    await cargarBriefs()
  } catch {
    window.alert('No se pudo eliminar el brief.')
  } finally {
    eliminandoId.value = null
  }
}

const formatoFecha = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const preguntasRespondidas = (b) => Object.keys(b.respuestas || {}).filter((k) => {
  const v = b.respuestas[k]
  return Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim())
}).length
</script>

<template>
  <div class="bp-page">
    <div class="bp-glow bp-glow-1"></div>
    <div class="bp-glow bp-glow-2"></div>

    <header class="bp-header">
      <img :src="logo" alt="Conectux" class="bp-logo" />
      <div class="bp-header-text">
        <h1>Brief</h1>
        <p>Uso interno — gestión de briefs de clientes.</p>
      </div>
    </header>

    <div v-if="verificando" class="bp-estado-carga">Cargando…</div>

    <!-- LOGIN -->
    <div v-else-if="!autenticado" class="bp-login glass-card">
      <h2>Acceso restringido</h2>
      <p>Ingresa la contraseña del equipo para continuar.</p>
      <input
        type="password" v-model="passwordInput" placeholder="Contraseña"
        @keyup.enter="iniciarSesion" class="bp-input"
      />
      <p v-if="loginError" class="bp-error">{{ loginError }}</p>
      <button class="bp-btn bp-btn--primary" :disabled="loginCargando" @click="iniciarSesion">
        {{ loginCargando ? 'Entrando…' : 'Entrar' }}
      </button>
    </div>

    <!-- LISTADO -->
    <div v-else class="bp-contenido">
      <button class="bp-btn bp-btn--primary bp-btn-nuevo" @click="abrirNuevo">
        <v-icon icon="mdi-file-document-plus-outline" size="18" class="mr-2" /> Nuevo brief
      </button>

      <div v-if="cargandoLista" class="bp-estado-carga">Cargando briefs…</div>
      <div v-else-if="!briefs.length" class="bp-estado-carga">Todavía no hay briefs creados.</div>

      <div v-for="b in briefs" :key="b.id" class="bp-card glass-card">
        <div class="bp-card-top">
          <div>
            <div class="bp-card-cliente">{{ b.cliente }}</div>
            <div class="bp-card-meta">Creado: {{ formatoFecha(b.creado_en) }}</div>
            <div v-if="b.actualizado_en" class="bp-card-meta">Última respuesta: {{ formatoFecha(b.actualizado_en) }} · {{ preguntasRespondidas(b) }}/{{ TOTAL_PREGUNTAS }} preguntas</div>
          </div>
          <div class="bp-estado" :class="b.estado === 'lleno' ? 'bp-estado--verde' : 'bp-estado--rojo'">
            <span class="bp-estado-dot"></span>
            {{ b.estado === 'lleno' ? 'Respondido' : 'Por llenar' }}
          </div>
        </div>

        <div class="bp-card-acciones">
          <input class="bp-input bp-input--link" readonly :value="linkDe(b)" @click="$event.target.select()" />
          <button class="bp-btn bp-btn--ghost" @click="copiarLink(linkDe(b))">
            <v-icon icon="mdi-content-copy" size="16" class="mr-1" /> Copiar link
          </button>
          <a :href="linkDe(b)" target="_blank" rel="noopener" class="bp-btn bp-btn--ghost">
            <v-icon icon="mdi-eye-outline" size="16" class="mr-1" /> Ver / completar
          </a>
          <button class="bp-btn bp-btn--eliminar" :disabled="eliminandoId === b.id" @click="eliminarBrief(b)">
            <v-icon icon="mdi-trash-can-outline" size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- DIÁLOGO NUEVO BRIEF -->
    <v-dialog v-model="dialogNuevo" max-width="440">
      <v-card class="bp-dialog">
        <v-card-title class="bp-dialog-title">Nuevo brief</v-card-title>
        <v-card-text>
          <template v-if="!linkGenerado">
            <label class="bp-form-label">Nombre del cliente
              <input class="bp-input" v-model="nombreCliente" placeholder="Nombre o razón social" @keyup.enter="crearBrief" />
            </label>
            <p v-if="errorCrear" class="bp-error">{{ errorCrear }}</p>
          </template>
          <template v-else>
            <p class="bp-link-generado-titulo">Brief generado ✅</p>
            <p class="bp-link-generado-texto">Envía este link al cliente para que lo responda (puede volver a entrar y editarlo cuando quiera):</p>
            <div class="bp-link-generado-box">
              <input class="bp-input bp-input--link" readonly :value="linkGenerado" @click="$event.target.select()" />
              <button class="bp-btn bp-btn--ghost" @click="copiarLink(linkGenerado)">
                {{ copiado ? 'Copiado ✓' : 'Copiar' }}
              </button>
            </div>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button v-if="!linkGenerado" class="bp-dialog-cancel" @click="dialogNuevo = false" :disabled="creando">Cancelar</button>
          <button v-if="!linkGenerado" class="bp-btn bp-btn--primary" :disabled="creando" @click="crearBrief">
            {{ creando ? 'Generando…' : 'Generar brief' }}
          </button>
          <button v-else class="bp-btn bp-btn--primary" @click="dialogNuevo = false">Listo</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.bp-page {
  min-height: 100vh;
  background: var(--dark-bg);
  padding: 56px 24px 80px;
  position: relative;
  overflow: hidden;
}
.bp-glow { position: absolute; width: 600px; height: 600px; border-radius: 50%; pointer-events: none; z-index: 0; }
.bp-glow-1 { top: -200px; left: -150px; background: radial-gradient(circle, rgba(161, 0, 255, 0.18) 0%, transparent 65%); }
.bp-glow-2 { bottom: -250px; right: -150px; background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 65%); }

.bp-header { position: relative; z-index: 1; max-width: 800px; margin: 0 auto 40px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.bp-logo { width: 140px; }
.bp-header-text h1 { font-size: 26px; margin: 0 0 4px; font-weight: 800; color: #fff; }
.bp-header-text p { margin: 0; color: var(--text-secondary); font-size: 13px; }

.bp-estado-carga { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; color: var(--text-muted); font-size: 13px; padding: 12px 0; }

.bp-login { position: relative; z-index: 1; max-width: 360px; margin: 40px auto; padding: 32px; text-align: center; }
.bp-login h2 { color: #fff; font-size: 18px; margin: 0 0 8px; }
.bp-login p { color: var(--text-secondary); font-size: 13px; margin: 0 0 18px; }
.bp-login .bp-input { margin-bottom: 14px; }
.bp-login .bp-btn { width: 100%; }

.bp-contenido { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
.bp-btn-nuevo { margin-bottom: 24px; }

.bp-card { padding: 20px 22px; margin-bottom: 14px; }
.bp-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
.bp-card-cliente { font-size: 16px; font-weight: 800; color: #fff; }
.bp-card-meta { font-size: 11.5px; color: var(--text-secondary); margin-top: 2px; }
.bp-card-acciones { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; align-items: center; }

.bp-estado { display: inline-flex; align-items: center; gap: 7px; border-radius: 8px; padding: 7px 10px; font-size: 11px; font-weight: 700; white-space: nowrap; }
.bp-estado-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.bp-estado--rojo { background: rgba(248, 113, 113, 0.12); border: 1px solid rgba(248, 113, 113, 0.35); color: #fca5a5; }
.bp-estado--rojo .bp-estado-dot { background: #f87171; }
.bp-estado--verde { background: rgba(74, 222, 128, 0.12); border: 1px solid rgba(74, 222, 128, 0.35); color: #86efac; }
.bp-estado--verde .bp-estado-dot { background: #4ade80; }

.bp-input {
  background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); border-radius: 8px;
  padding: 9px 12px; color: #fff; color-scheme: dark; font-family: inherit; font-size: 13px; width: 100%;
}
.bp-input--link { font-size: 11px; color: var(--text-secondary); }

.bp-btn {
  display: inline-flex; align-items: center; justify-content: center; border-radius: 10px;
  padding: 10px 16px; font-size: 13px; font-weight: 600; border: none; font-family: inherit;
  cursor: pointer; text-decoration: none; transition: all 0.2s ease;
}
.bp-btn--primary { background: var(--gradient); color: #fff; }
.bp-btn--primary:hover { filter: brightness(1.1); }
.bp-btn--primary:disabled { opacity: 0.6; cursor: default; }
.bp-btn--ghost { background: rgba(161, 0, 255, 0.12); border: 1px solid var(--border); color: var(--primary-light); }
.bp-btn--ghost:hover { background: rgba(161, 0, 255, 0.2); }
.bp-btn--eliminar {
  width: 36px; height: 36px; padding: 0;
  background: rgba(248, 113, 113, 0.08); border: 1px solid rgba(248, 113, 113, 0.3); color: #fca5a5;
}
.bp-btn--eliminar:hover { background: rgba(248, 113, 113, 0.18); }
.bp-btn--eliminar:disabled { opacity: 0.5; cursor: default; }

.bp-error { color: #fca5a5; font-size: 12px; margin: 8px 0; }

.bp-dialog { background: var(--dark-card) !important; }
.bp-dialog-title { color: #fff; }
.bp-form-label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: var(--text-secondary); }
.bp-dialog-cancel { background: transparent; border: none; color: var(--text-secondary); padding: 10px 14px; cursor: pointer; font-family: inherit; font-size: 13px; }

.bp-link-generado-titulo { color: #86efac; font-weight: 700; font-size: 15px; margin: 0 0 6px; }
.bp-link-generado-texto { color: var(--text-secondary); font-size: 13px; margin: 0 0 12px; }
.bp-link-generado-box { display: flex; gap: 8px; }
.bp-link-generado-box .bp-input--link { flex: 1; }

@media (max-width: 480px) {
  .bp-header { gap: 14px; }
  .bp-logo { width: 110px; }
}
</style>
