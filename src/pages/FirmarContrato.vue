<script setup>
import { ref, onMounted, nextTick } from 'vue'
import logo from '../assets/logo-conectux.png'

const token = new URLSearchParams(location.search).get('token') || ''

const cargando = ref(true)
const error = ref('')
const contrato = ref(null)

const modoFirma = ref('dibujar') // 'dibujar' | 'subir'
const canvasRef = ref(null)
const dibujando = ref(false)
const tieneTrazo = ref(false)
const archivoFirma = ref(null) // { dataUrl, tipo }

const nombreFirmante = ref('')
const acepto = ref(false)
const enviando = ref(false)
const errorEnvio = ref('')
const firmado = ref(false)

const formatoFecha = (iso) => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

onMounted(async () => {
  if (!token) {
    error.value = 'Este link no es válido — falta el código del contrato.'
    cargando.value = false
    return
  }
  try {
    const res = await fetch(`/api/contratos-detalle?token=${encodeURIComponent(token)}`)
    if (!res.ok) {
      error.value = 'No se encontró este contrato. Verifica el link.'
      return
    }
    contrato.value = await res.json()
    if (contrato.value.estado === 'firmado') firmado.value = true
  } catch {
    error.value = 'No se pudo cargar el contrato. Intenta de nuevo.'
  } finally {
    cargando.value = false
  }
})

const iniciarCanvas = async () => {
  await nextTick()
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#1c1230'
}

const posicion = (e, canvas) => {
  const rect = canvas.getBoundingClientRect()
  const punto = e.touches ? e.touches[0] : e
  return {
    x: (punto.clientX - rect.left) * (canvas.width / rect.width),
    y: (punto.clientY - rect.top) * (canvas.height / rect.height),
  }
}

const empezarTrazo = (e) => {
  dibujando.value = true
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const { x, y } = posicion(e, canvas)
  ctx.beginPath()
  ctx.moveTo(x, y)
}
const continuarTrazo = (e) => {
  if (!dibujando.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const { x, y } = posicion(e, canvas)
  ctx.lineTo(x, y)
  ctx.stroke()
  tieneTrazo.value = true
}
const terminarTrazo = () => { dibujando.value = false }

const limpiarCanvas = () => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  tieneTrazo.value = false
}

const manejarArchivo = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    archivoFirma.value = { dataUrl: reader.result, tipo: file.type.includes('png') ? 'png' : 'jpg' }
  }
  reader.readAsDataURL(file)
}

const puedeFirmar = () => {
  if (!nombreFirmante.value.trim() || !acepto.value) return false
  if (modoFirma.value === 'dibujar') return tieneTrazo.value
  return !!archivoFirma.value
}

const confirmarFirma = async () => {
  if (!puedeFirmar()) return
  enviando.value = true
  errorEnvio.value = ''
  try {
    let firmaBase64, firmaTipo
    if (modoFirma.value === 'dibujar') {
      firmaBase64 = canvasRef.value.toDataURL('image/png')
      firmaTipo = 'png'
    } else {
      firmaBase64 = archivoFirma.value.dataUrl
      firmaTipo = archivoFirma.value.tipo
    }

    const res = await fetch('/api/contratos-firmar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, nombreFirmante: nombreFirmante.value.trim(), firmaBase64, firmaTipo }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'No se pudo firmar')
    firmado.value = true
  } catch (e) {
    errorEnvio.value = e.message || 'No se pudo firmar el contrato. Intenta de nuevo.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="fc-page">
    <div class="fc-glow"></div>
    <div class="fc-card glass-card">
      <img :src="logo" alt="Conectux" class="fc-logo" />

      <div v-if="cargando" class="fc-estado">Cargando contrato…</div>
      <div v-else-if="error" class="fc-estado fc-estado--error">{{ error }}</div>

      <template v-else-if="firmado">
        <div class="fc-check">✅</div>
        <h1>Contrato firmado</h1>
        <p class="fc-texto">Gracias — tu contrato con Conectux quedó firmado correctamente.</p>
        <a :href="`/api/contratos-descargar?token=${token}`" target="_blank" rel="noopener" class="fc-btn fc-btn--primary">
          Descargar copia del contrato
        </a>
      </template>

      <template v-else>
        <h1>Firma tu contrato</h1>
        <div class="fc-resumen">
          <div><strong>Cliente:</strong> {{ contrato.cliente }}</div>
          <div><strong>Documento:</strong> {{ contrato.documentoCliente }}</div>
          <div><strong>Ciudad:</strong> {{ contrato.ciudad }}</div>
          <div><strong>Plan:</strong> {{ contrato.plan }}</div>
          <div><strong>Inicio del contrato:</strong> {{ formatoFecha(contrato.fechaInicioContrato) }}</div>
          <div><strong>Inicio del trabajo:</strong> {{ formatoFecha(contrato.fechaInicioTrabajo) }}</div>
        </div>
        <a :href="`/api/contratos-descargar?token=${token}`" target="_blank" rel="noopener" class="fc-link-ver">
          📄 Ver el contrato completo
        </a>

        <div class="fc-divider"></div>

        <label class="fc-label">Tu nombre completo</label>
        <input class="fc-input" v-model="nombreFirmante" placeholder="Nombre y apellido" />

        <label class="fc-label" style="margin-top:16px;">Tu firma</label>
        <div class="fc-tabs">
          <button class="fc-tab" :class="{ 'fc-tab--activo': modoFirma === 'dibujar' }" @click="modoFirma = 'dibujar'; iniciarCanvas()">Dibujar</button>
          <button class="fc-tab" :class="{ 'fc-tab--activo': modoFirma === 'subir' }" @click="modoFirma = 'subir'">Subir imagen</button>
        </div>

        <div v-show="modoFirma === 'dibujar'" class="fc-canvas-wrap">
          <canvas
            ref="canvasRef" width="500" height="180" class="fc-canvas"
            @mousedown="empezarTrazo" @mousemove="continuarTrazo" @mouseup="terminarTrazo" @mouseleave="terminarTrazo"
            @touchstart.prevent="empezarTrazo" @touchmove.prevent="continuarTrazo" @touchend.prevent="terminarTrazo"
          ></canvas>
          <button class="fc-btn fc-btn--ghost fc-btn--sm" @click="limpiarCanvas">Limpiar</button>
        </div>
        <div v-show="modoFirma === 'subir'" class="fc-subir-wrap">
          <input type="file" accept="image/png,image/jpeg" @change="manejarArchivo" class="fc-input" />
          <img v-if="archivoFirma" :src="archivoFirma.dataUrl" class="fc-preview-firma" />
        </div>

        <label class="fc-checkbox">
          <input type="checkbox" v-model="acepto" />
          <span>He leído el contrato y acepto sus términos.</span>
        </label>

        <p v-if="errorEnvio" class="fc-error">{{ errorEnvio }}</p>

        <button class="fc-btn fc-btn--primary fc-btn--full" :disabled="!puedeFirmar() || enviando" @click="confirmarFirma">
          {{ enviando ? 'Firmando…' : 'Firmar contrato' }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.fc-page {
  min-height: 100vh; background: var(--dark-bg);
  display: flex; align-items: center; justify-content: center;
  padding: 24px; position: relative; overflow: hidden;
}
.fc-glow {
  position: absolute; width: 700px; height: 700px; border-radius: 50%;
  top: -250px; left: 50%; transform: translateX(-50%);
  background: radial-gradient(circle, rgba(161, 0, 255, 0.18) 0%, transparent 65%);
  pointer-events: none;
}
.fc-card { position: relative; z-index: 1; max-width: 480px; width: 100%; padding: 32px 28px; }
.fc-logo { width: 130px; margin-bottom: 20px; }
.fc-card h1 { color: #fff; font-size: 20px; margin: 0 0 16px; }
.fc-estado { color: var(--text-secondary); font-size: 13px; padding: 20px 0; }
.fc-estado--error { color: #fca5a5; }

.fc-check { font-size: 40px; margin-bottom: 8px; }
.fc-texto { color: var(--text-secondary); font-size: 13px; margin: 0 0 22px; line-height: 1.6; }

.fc-resumen {
  background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 12px;
  padding: 14px 16px; font-size: 12.5px; color: var(--text-secondary); line-height: 1.9; margin-bottom: 12px;
}
.fc-resumen strong { color: #fff; font-weight: 600; }
.fc-link-ver { display: inline-block; font-size: 12.5px; color: var(--primary-light); text-decoration: none; margin-bottom: 18px; }
.fc-link-ver:hover { text-decoration: underline; }

.fc-divider { height: 1px; background: var(--border); margin: 8px 0 18px; }

.fc-label { display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; font-weight: 600; }
.fc-input {
  width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 8px;
  padding: 10px 12px; color: #fff; color-scheme: dark; font-family: inherit; font-size: 13px;
}

.fc-tabs { display: flex; gap: 8px; margin-bottom: 10px; }
.fc-tab {
  flex: 1; background: rgba(255,255,255,0.04); border: 1px solid var(--border); color: var(--text-secondary);
  padding: 8px 10px; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit;
}
.fc-tab--activo { background: rgba(161,0,255,0.15); border-color: var(--border-hover); color: #fff; }

.fc-canvas-wrap { position: relative; }
.fc-canvas { width: 100%; height: 150px; background: #fff; border-radius: 10px; touch-action: none; cursor: crosshair; }
.fc-canvas-wrap .fc-btn--sm { position: absolute; top: 8px; right: 8px; }

.fc-subir-wrap { display: flex; flex-direction: column; gap: 10px; }
.fc-preview-firma { max-width: 100%; max-height: 100px; background: #fff; border-radius: 8px; padding: 6px; align-self: flex-start; }

.fc-checkbox {
  display: flex; align-items: flex-start; gap: 10px; margin: 18px 0; cursor: pointer;
  font-size: 12.5px; color: var(--text-secondary); line-height: 1.4;
}
.fc-checkbox input { margin-top: 2px; }

.fc-error { color: #fca5a5; font-size: 12px; margin: 0 0 10px; }

.fc-btn {
  display: inline-flex; align-items: center; justify-content: center; border-radius: 10px;
  padding: 11px 18px; font-size: 13.5px; font-weight: 700; border: none; font-family: inherit;
  cursor: pointer; text-decoration: none; transition: all 0.2s ease;
}
.fc-btn--primary { background: var(--gradient); color: #fff; }
.fc-btn--primary:hover { filter: brightness(1.1); }
.fc-btn--primary:disabled { opacity: 0.5; cursor: default; }
.fc-btn--full { width: 100%; }
.fc-btn--ghost { background: rgba(0,0,0,0.5); border: 1px solid rgba(0,0,0,0.1); color: #1c1230; }
.fc-btn--sm { padding: 5px 10px; font-size: 11px; }
</style>
