<script setup>
import { ref, onMounted } from 'vue'
import logo from '../assets/logo-conectux.png'

// Nombre fijo del representante legal — se incrusta en cada contrato nuevo.
const NOMBRE_REPRESENTANTE = 'Felipe Villa' // TODO: confirmar nombre completo exacto

const autenticado = ref(false)
const verificando = ref(true)
const passwordInput = ref('')
const loginError = ref('')
const loginCargando = ref(false)

const contratos = ref([])
const cargandoLista = ref(false)

const dialogNuevo = ref(false)
const nuevoForm = ref({ ciudad: '', cliente: '', documentoCliente: '', fechaInicioContrato: '', fechaInicioTrabajo: '', plan: '' })
const creando = ref(false)
const errorCrear = ref('')
const linkGenerado = ref('')
const copiado = ref(false)

const eliminandoId = ref(null)

const cargarContratos = async () => {
  cargandoLista.value = true
  const res = await fetch('/api/contratos-admin', { cache: 'no-store' })
  if (res.status === 401) {
    autenticado.value = false
  } else if (res.ok) {
    autenticado.value = true
    contratos.value = (await res.json()).sort((a, b) => b.creado_en.localeCompare(a.creado_en))
  }
  cargandoLista.value = false
  verificando.value = false
}

onMounted(cargarContratos)

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
    await cargarContratos()
  } catch {
    loginError.value = 'No se pudo conectar. Intenta de nuevo.'
  } finally {
    loginCargando.value = false
  }
}

const abrirNuevo = () => {
  nuevoForm.value = { ciudad: '', cliente: '', documentoCliente: '', fechaInicioContrato: '', fechaInicioTrabajo: '', plan: '' }
  errorCrear.value = ''
  linkGenerado.value = ''
  copiado.value = false
  dialogNuevo.value = true
}

const crearContrato = async () => {
  const f = nuevoForm.value
  if (!f.ciudad || !f.cliente || !f.documentoCliente || !f.fechaInicioContrato || !f.fechaInicioTrabajo || !f.plan) {
    errorCrear.value = 'Completa todos los campos.'
    return
  }
  creando.value = true
  errorCrear.value = ''
  try {
    const res = await fetch('/api/contratos-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'crear', ...f, nombreRepresentante: NOMBRE_REPRESENTANTE }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'No se pudo crear el contrato')
    linkGenerado.value = data.linkCliente
    await cargarContratos()
  } catch (e) {
    errorCrear.value = e.message || 'No se pudo crear el contrato.'
  } finally {
    creando.value = false
  }
}

const linkDe = (contrato) => `${location.origin}/firmar-contrato/?token=${contrato.token}`

const copiarLink = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto)
    copiado.value = true
    setTimeout(() => { copiado.value = false }, 2000)
  } catch {
    window.prompt('Copia el link:', texto)
  }
}

const eliminarContrato = async (contrato) => {
  const ok = window.confirm(`¿Eliminar el contrato de "${contrato.cliente}"? Esta acción no se puede deshacer.`)
  if (!ok) return
  eliminandoId.value = contrato.id
  try {
    const res = await fetch('/api/contratos-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'eliminar', id: contrato.id }),
    })
    if (!res.ok) throw new Error()
    await cargarContratos()
  } catch {
    window.alert('No se pudo eliminar el contrato.')
  } finally {
    eliminandoId.value = null
  }
}

const formatoFecha = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<template>
  <div class="ct-page">
    <div class="ct-glow ct-glow-1"></div>
    <div class="ct-glow ct-glow-2"></div>

    <header class="ct-header">
      <img :src="logo" alt="Conectux" class="ct-logo" />
      <div class="ct-header-text">
        <h1>Contratos</h1>
        <p>Uso interno — gestión y firma de contratos de clientes.</p>
      </div>
    </header>

    <div v-if="verificando" class="ct-estado-carga">Cargando…</div>

    <!-- LOGIN -->
    <div v-else-if="!autenticado" class="ct-login glass-card">
      <h2>Acceso restringido</h2>
      <p>Ingresa la contraseña del equipo para continuar.</p>
      <input
        type="password" v-model="passwordInput" placeholder="Contraseña"
        @keyup.enter="iniciarSesion" class="ct-input"
      />
      <p v-if="loginError" class="ct-error">{{ loginError }}</p>
      <button class="ct-btn ct-btn--primary" :disabled="loginCargando" @click="iniciarSesion">
        {{ loginCargando ? 'Entrando…' : 'Entrar' }}
      </button>
    </div>

    <!-- LISTADO -->
    <div v-else class="ct-contenido">
      <button class="ct-btn ct-btn--primary ct-btn-nuevo" @click="abrirNuevo">
        <v-icon icon="mdi-file-document-plus-outline" size="18" class="mr-2" /> Nuevo contrato
      </button>

      <div v-if="cargandoLista" class="ct-estado-carga">Cargando contratos…</div>
      <div v-else-if="!contratos.length" class="ct-estado-carga">Todavía no hay contratos creados.</div>

      <div v-for="c in contratos" :key="c.id" class="ct-card glass-card">
        <div class="ct-card-top">
          <div>
            <div class="ct-card-cliente">{{ c.cliente }}</div>
            <div class="ct-card-meta">{{ c.ciudad }} · Doc. {{ c.documentoCliente }}</div>
            <div class="ct-card-meta">Inicio contrato: {{ formatoFecha(c.fechaInicioContrato) }} · Inicio trabajo: {{ formatoFecha(c.fechaInicioTrabajo) }}</div>
            <div class="ct-card-plan">{{ c.plan }}</div>
          </div>
          <div class="ct-estado" :class="c.estado === 'firmado' ? 'ct-estado--verde' : 'ct-estado--rojo'">
            <span class="ct-estado-dot"></span>
            {{ c.estado === 'firmado' ? 'Firmado' : 'Pendiente de firma' }}
          </div>
        </div>

        <div v-if="c.estado === 'firmado'" class="ct-card-firmado">
          Firmado por {{ c.firmante_nombre }} el {{ formatoFecha(c.firmado_en) }}
        </div>

        <div class="ct-card-acciones">
          <template v-if="c.estado === 'pendiente_firma'">
            <input class="ct-input ct-input--link" readonly :value="linkDe(c)" @click="$event.target.select()" />
            <button class="ct-btn ct-btn--ghost" @click="copiarLink(linkDe(c))">
              <v-icon icon="mdi-content-copy" size="16" class="mr-1" /> Copiar link
            </button>
          </template>
          <a v-else :href="`/api/contratos-publico?accion=descargar&id=${c.id}`" target="_blank" rel="noopener" class="ct-btn ct-btn--ghost">
            <v-icon icon="mdi-download" size="16" class="mr-1" /> Descargar PDF firmado
          </a>
          <button class="ct-btn ct-btn--eliminar" :disabled="eliminandoId === c.id" @click="eliminarContrato(c)">
            <v-icon icon="mdi-trash-can-outline" size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- DIÁLOGO NUEVO CONTRATO -->
    <v-dialog v-model="dialogNuevo" max-width="480">
      <v-card class="ct-dialog">
        <v-card-title class="ct-dialog-title">Nuevo contrato</v-card-title>
        <v-card-text>
          <template v-if="!linkGenerado">
            <div class="ct-form-grid">
              <label>Ciudad<input class="ct-input" v-model="nuevoForm.ciudad" placeholder="Medellín" /></label>
              <label>Nombre del cliente<input class="ct-input" v-model="nuevoForm.cliente" placeholder="Nombre o razón social" /></label>
              <label>Documento del cliente<input class="ct-input" v-model="nuevoForm.documentoCliente" placeholder="C.C. o NIT" /></label>
              <label>Fecha de inicio del contrato<input class="ct-input" type="date" v-model="nuevoForm.fechaInicioContrato" /></label>
              <label>Fecha de inicio del trabajo<input class="ct-input" type="date" v-model="nuevoForm.fechaInicioTrabajo" /></label>
              <label class="ct-form-full">Plan de trabajo (incluye el valor mensual)
                <textarea class="ct-input ct-textarea" v-model="nuevoForm.plan" placeholder="Ej: Plan Pro — contenido + pauta, $1.500.000 COP/mes" rows="3"></textarea>
              </label>
            </div>
            <p v-if="errorCrear" class="ct-error">{{ errorCrear }}</p>
          </template>
          <template v-else>
            <p class="ct-link-generado-titulo">Contrato generado ✅</p>
            <p class="ct-link-generado-texto">Envía este link al cliente para que lo revise y firme:</p>
            <div class="ct-link-generado-box">
              <input class="ct-input ct-input--link" readonly :value="linkGenerado" @click="$event.target.select()" />
              <button class="ct-btn ct-btn--ghost" @click="copiarLink(linkGenerado)">
                {{ copiado ? 'Copiado ✓' : 'Copiar' }}
              </button>
            </div>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button v-if="!linkGenerado" class="ct-dialog-cancel" @click="dialogNuevo = false" :disabled="creando">Cancelar</button>
          <button v-if="!linkGenerado" class="ct-btn ct-btn--primary" :disabled="creando" @click="crearContrato">
            {{ creando ? 'Generando…' : 'Generar contrato' }}
          </button>
          <button v-else class="ct-btn ct-btn--primary" @click="dialogNuevo = false">Listo</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.ct-page {
  min-height: 100vh;
  background: var(--dark-bg);
  padding: 56px 24px 80px;
  position: relative;
  overflow: hidden;
}
.ct-glow { position: absolute; width: 600px; height: 600px; border-radius: 50%; pointer-events: none; z-index: 0; }
.ct-glow-1 { top: -200px; left: -150px; background: radial-gradient(circle, rgba(161, 0, 255, 0.18) 0%, transparent 65%); }
.ct-glow-2 { bottom: -250px; right: -150px; background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 65%); }

.ct-header { position: relative; z-index: 1; max-width: 800px; margin: 0 auto 40px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.ct-logo { width: 140px; }
.ct-header-text h1 { font-size: 26px; margin: 0 0 4px; font-weight: 800; color: #fff; }
.ct-header-text p { margin: 0; color: var(--text-secondary); font-size: 13px; }

.ct-estado-carga { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; color: var(--text-muted); font-size: 13px; padding: 12px 0; }

.ct-login { position: relative; z-index: 1; max-width: 360px; margin: 40px auto; padding: 32px; text-align: center; }
.ct-login h2 { color: #fff; font-size: 18px; margin: 0 0 8px; }
.ct-login p { color: var(--text-secondary); font-size: 13px; margin: 0 0 18px; }
.ct-login .ct-input { margin-bottom: 14px; }
.ct-login .ct-btn { width: 100%; }

.ct-contenido { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
.ct-btn-nuevo { margin-bottom: 24px; }

.ct-card { padding: 20px 22px; margin-bottom: 14px; }
.ct-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
.ct-card-cliente { font-size: 16px; font-weight: 800; color: #fff; }
.ct-card-meta { font-size: 11.5px; color: var(--text-secondary); margin-top: 2px; }
.ct-card-plan { font-size: 12px; color: var(--text-muted); margin-top: 6px; font-style: italic; }
.ct-card-firmado { font-size: 11.5px; color: #86efac; margin-top: 10px; }
.ct-card-acciones { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; align-items: center; }

.ct-estado { display: inline-flex; align-items: center; gap: 7px; border-radius: 8px; padding: 7px 10px; font-size: 11px; font-weight: 700; white-space: nowrap; }
.ct-estado-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.ct-estado--rojo { background: rgba(248, 113, 113, 0.12); border: 1px solid rgba(248, 113, 113, 0.35); color: #fca5a5; }
.ct-estado--rojo .ct-estado-dot { background: #f87171; }
.ct-estado--verde { background: rgba(74, 222, 128, 0.12); border: 1px solid rgba(74, 222, 128, 0.35); color: #86efac; }
.ct-estado--verde .ct-estado-dot { background: #4ade80; }

.ct-input {
  background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); border-radius: 8px;
  padding: 9px 12px; color: #fff; color-scheme: dark; font-family: inherit; font-size: 13px; width: 100%;
}
.ct-input--link { font-size: 11px; color: var(--text-secondary); }
.ct-textarea { resize: vertical; }

.ct-btn {
  display: inline-flex; align-items: center; justify-content: center; border-radius: 10px;
  padding: 10px 16px; font-size: 13px; font-weight: 600; border: none; font-family: inherit;
  cursor: pointer; text-decoration: none; transition: all 0.2s ease;
}
.ct-btn--primary { background: var(--gradient); color: #fff; }
.ct-btn--primary:hover { filter: brightness(1.1); }
.ct-btn--primary:disabled { opacity: 0.6; cursor: default; }
.ct-btn--ghost { background: rgba(161, 0, 255, 0.12); border: 1px solid var(--border); color: var(--primary-light); }
.ct-btn--ghost:hover { background: rgba(161, 0, 255, 0.2); }
.ct-btn--eliminar {
  width: 36px; height: 36px; padding: 0;
  background: rgba(248, 113, 113, 0.08); border: 1px solid rgba(248, 113, 113, 0.3); color: #fca5a5;
}
.ct-btn--eliminar:hover { background: rgba(248, 113, 113, 0.18); }
.ct-btn--eliminar:disabled { opacity: 0.5; cursor: default; }

.ct-error { color: #fca5a5; font-size: 12px; margin: 8px 0; }

.ct-dialog { background: var(--dark-card) !important; }
.ct-dialog-title { color: #fff; }
.ct-form-grid { display: flex; flex-direction: column; gap: 14px; }
.ct-form-grid label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: var(--text-secondary); }
.ct-dialog-cancel { background: transparent; border: none; color: var(--text-secondary); padding: 10px 14px; cursor: pointer; font-family: inherit; font-size: 13px; }

.ct-link-generado-titulo { color: #86efac; font-weight: 700; font-size: 15px; margin: 0 0 6px; }
.ct-link-generado-texto { color: var(--text-secondary); font-size: 13px; margin: 0 0 12px; }
.ct-link-generado-box { display: flex; gap: 8px; }
.ct-link-generado-box .ct-input--link { flex: 1; }

@media (max-width: 480px) {
  .ct-header { gap: 14px; }
  .ct-logo { width: 110px; }
}
</style>
