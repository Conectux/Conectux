<script setup>
import { ref, onMounted } from 'vue'
import logo from '../assets/logo-conectux.png'

const autenticado = ref(false)
const verificando = ref(true)
const passwordInput = ref('')
const loginError = ref('')
const loginCargando = ref(false)

const cotizaciones = ref([])
const cargandoLista = ref(false)
const eliminandoSlug = ref(null)

const dialogAbierto = ref(false)
const editandoSlug = ref(null)
const guardando = ref(false)
const errorGuardar = ref('')

const planVacio = () => ({ avatar: '', nombre: '', tipo: '', acento: 'purple', itemsTexto: '', precioAntes: '', precioLabel: 'Precio', precioMostrado: '', periodo: 'COP / mes' })

const formVacio = () => ({
  slug: '', cliente: '', periodo: '', heroTitulo: '', heroSubtitulo: '',
  estadoLabel: 'Activa', descripcionCorta: '', etiquetasTexto: '',
  precioLabel: '', precioMostrado: '',
  pilaresTitulo: '', pilaresSubtitulo: '', pilares: [],
  planesTitulo: '', planesSubtitulo: '', planesBadge: '', planes: [planVacio()],
  resumenFilas: [], resumenTotalAntes: '', resumenTotalMonto: '', resumenTotalPeriodo: '',
  cierreTitulo: '', cierreTexto: '', exclusionesTexto: '',
})
const form = ref(formVacio())
const avanzado = ref(false)

const cargarCotizaciones = async () => {
  cargandoLista.value = true
  const res = await fetch('/api/cotizaciones', { cache: 'no-store' })
  if (res.status === 401) {
    autenticado.value = false
  } else if (res.ok) {
    autenticado.value = true
    cotizaciones.value = (await res.json()).sort((a, b) => (b.actualizado_en || b.creado_en).localeCompare(a.actualizado_en || a.creado_en))
  }
  cargandoLista.value = false
  verificando.value = false
}
onMounted(cargarCotizaciones)

const iniciarSesion = async () => {
  loginCargando.value = true
  loginError.value = ''
  try {
    const res = await fetch('/api/contratos-publico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'login', password: passwordInput.value }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      loginError.value = data.error || 'No se pudo iniciar sesión'
      return
    }
    passwordInput.value = ''
    await cargarCotizaciones()
  } catch {
    loginError.value = 'No se pudo conectar. Intenta de nuevo.'
  } finally {
    loginCargando.value = false
  }
}

const abrirNueva = () => {
  editandoSlug.value = null
  form.value = formVacio()
  avanzado.value = false
  errorGuardar.value = ''
  dialogAbierto.value = true
}

const abrirEditar = (c) => {
  editandoSlug.value = c.slug
  errorGuardar.value = ''
  form.value = {
    slug: c.slug, cliente: c.cliente, periodo: c.periodo, heroTitulo: c.heroTitulo, heroSubtitulo: c.heroSubtitulo,
    estadoLabel: c.estadoLabel, descripcionCorta: c.descripcionCorta, etiquetasTexto: (c.etiquetas || []).join(', '),
    precioLabel: c.precioLabel, precioMostrado: c.precioMostrado,
    pilaresTitulo: c.pilaresTitulo, pilaresSubtitulo: c.pilaresSubtitulo, pilares: (c.pilares || []).map((p) => ({ ...p })),
    planesTitulo: c.planesTitulo, planesSubtitulo: c.planesSubtitulo, planesBadge: c.planesBadge,
    planes: (c.planes?.length ? c.planes : [{}]).map((p) => ({ ...planVacio(), ...p, itemsTexto: (p.items || []).join('\n') })),
    resumenFilas: (c.resumenFilas || []).map((f) => ({ ...f })),
    resumenTotalAntes: c.resumenTotal?.antes || '', resumenTotalMonto: c.resumenTotal?.monto || '', resumenTotalPeriodo: c.resumenTotal?.periodo || '',
    cierreTitulo: c.cierreTitulo, cierreTexto: c.cierreTexto, exclusionesTexto: (c.exclusiones || []).join('\n'),
  }
  // Las cotizaciones migradas usan las secciones avanzadas (pilares, hero propio, etc.) — se muestran abiertas al editar.
  avanzado.value = !!(c.pilares?.length || c.heroTitulo || c.resumenFilas?.length)
  dialogAbierto.value = true
}

const agregarPilar = () => form.value.pilares.push({ numero: String(form.value.pilares.length + 1).padStart(2, '0'), titulo: '', descripcion: '' })
const quitarPilar = (i) => form.value.pilares.splice(i, 1)

const agregarPlan = () => form.value.planes.push(planVacio())
const quitarPlan = (i) => form.value.planes.splice(i, 1)

const agregarFilaResumen = () => form.value.resumenFilas.push({ servicio: '', antes: '', precio: '' })
const quitarFilaResumen = (i) => form.value.resumenFilas.splice(i, 1)

const guardar = async () => {
  const f = form.value
  if (!f.cliente.trim()) { errorGuardar.value = 'Escribe el nombre del cliente.'; return }
  guardando.value = true
  errorGuardar.value = ''
  try {
    const body = {
      slug: editandoSlug.value || f.slug,
      cliente: f.cliente, periodo: f.periodo, heroTitulo: f.heroTitulo, heroSubtitulo: f.heroSubtitulo,
      estadoLabel: f.estadoLabel, descripcionCorta: f.descripcionCorta,
      etiquetas: f.etiquetasTexto.split(',').map((s) => s.trim()).filter(Boolean),
      precioLabel: f.precioLabel, precioMostrado: f.precioMostrado,
      pilaresTitulo: f.pilaresTitulo, pilaresSubtitulo: f.pilaresSubtitulo, pilares: f.pilares,
      planesTitulo: f.planesTitulo, planesSubtitulo: f.planesSubtitulo, planesBadge: f.planesBadge,
      planes: f.planes.map((p) => ({
        avatar: p.avatar, nombre: p.nombre, tipo: p.tipo, acento: p.acento,
        items: p.itemsTexto.split('\n').map((s) => s.trim()).filter(Boolean),
        precioAntes: p.precioAntes, precioLabel: p.precioLabel, precioMostrado: p.precioMostrado, periodo: p.periodo,
      })),
      resumenFilas: f.resumenFilas,
      resumenTotal: (f.resumenTotalMonto.trim()) ? { antes: f.resumenTotalAntes, monto: f.resumenTotalMonto, periodo: f.resumenTotalPeriodo } : null,
      cierreTitulo: f.cierreTitulo, cierreTexto: f.cierreTexto,
      exclusiones: f.exclusionesTexto.split('\n').map((s) => s.trim()).filter(Boolean),
    }
    const res = await fetch('/api/cotizaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'No se pudo guardar la cotización')
    dialogAbierto.value = false
    await cargarCotizaciones()
  } catch (e) {
    errorGuardar.value = e.message || 'No se pudo guardar la cotización.'
  } finally {
    guardando.value = false
  }
}

const eliminarCotizacion = async (c) => {
  const ok = window.confirm(`¿Eliminar la cotización de "${c.cliente}"? Esta acción no se puede deshacer.`)
  if (!ok) return
  eliminandoSlug.value = c.slug
  try {
    const res = await fetch('/api/cotizaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'eliminar', slug: c.slug }),
    })
    if (!res.ok) throw new Error()
    await cargarCotizaciones()
  } catch {
    window.alert('No se pudo eliminar la cotización.')
  } finally {
    eliminandoSlug.value = null
  }
}
</script>

<template>
  <div class="cz-page">
    <div class="cz-glow cz-glow-1"></div>
    <div class="cz-glow cz-glow-2"></div>

    <header class="cz-header">
      <img :src="logo" alt="Conectux" class="cz-logo" />
      <div class="cz-header-text">
        <h1>Cotizaciones</h1>
        <p>Uso interno — gestión de propuestas comerciales.</p>
      </div>
    </header>

    <div v-if="verificando" class="cz-estado-carga">Cargando…</div>

    <div v-else-if="!autenticado" class="cz-login glass-card">
      <h2>Acceso restringido</h2>
      <p>Ingresa la contraseña del equipo para continuar.</p>
      <input type="password" v-model="passwordInput" placeholder="Contraseña" @keyup.enter="iniciarSesion" class="cz-input" />
      <p v-if="loginError" class="cz-error">{{ loginError }}</p>
      <button class="cz-btn cz-btn--primary" :disabled="loginCargando" @click="iniciarSesion">
        {{ loginCargando ? 'Entrando…' : 'Entrar' }}
      </button>
    </div>

    <div v-else class="cz-contenido">
      <button class="cz-btn cz-btn--primary cz-btn-nueva" @click="abrirNueva">
        <v-icon icon="mdi-file-chart-outline" size="18" class="mr-2" /> Nueva cotización
      </button>

      <div v-if="cargandoLista" class="cz-estado-carga">Cargando cotizaciones…</div>
      <div v-else-if="!cotizaciones.length" class="cz-estado-carga">Todavía no hay cotizaciones creadas.</div>

      <div class="cz-grid">
        <div v-for="c in cotizaciones" :key="c.slug" class="cz-card glass-card">
          <div class="cz-card-top">
            <div class="cz-card-cliente">{{ c.cliente }}</div>
            <span class="cz-estado-badge" :class="{ 'cz-estado-badge--descuento': !/^activa$/i.test(c.estadoLabel || '') }">{{ c.estadoLabel }}</span>
          </div>
          <p class="cz-card-desc">{{ c.descripcionCorta }}</p>
          <div class="cz-card-precio">
            <span class="cz-card-precio-label">{{ c.precioLabel }}</span>
            <span class="cz-card-precio-monto">{{ c.precioMostrado }}</span>
          </div>
          <div class="cz-card-acciones">
            <a :href="`/ver-cotizacion?slug=${c.slug}`" target="_blank" rel="noopener" class="cz-btn cz-btn--ghost">
              <v-icon icon="mdi-eye-outline" size="16" class="mr-1" /> Ver
            </a>
            <a :href="`/api/cotizaciones?accion=pdf&slug=${c.slug}`" target="_blank" rel="noopener" class="cz-btn cz-btn--ghost">
              <v-icon icon="mdi-download" size="16" class="mr-1" /> PDF
            </a>
            <button class="cz-btn cz-btn--ghost" @click="abrirEditar(c)">
              <v-icon icon="mdi-pencil-outline" size="16" class="mr-1" /> Editar
            </button>
            <button class="cz-btn cz-btn--eliminar" :disabled="eliminandoSlug === c.slug" @click="eliminarCotizacion(c)">
              <v-icon icon="mdi-trash-can-outline" size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- DIÁLOGO NUEVA/EDITAR COTIZACIÓN -->
    <v-dialog v-model="dialogAbierto" max-width="680">
      <v-card class="cz-dialog">
        <v-card-title class="cz-dialog-title">{{ editandoSlug ? 'Editar cotización' : 'Nueva cotización' }}</v-card-title>
        <v-card-text>
          <p class="cz-ayuda">Completa esto y ya queda lista para enviar. Lo demás (textos de portada, enfoque, tabla resumen) se arma solo — si quieres personalizarlo, abre "Opciones avanzadas" al final.</p>

          <div class="cz-form-grid">
            <label class="cz-form-full">Cliente<input class="cz-input" v-model="form.cliente" placeholder="Nombre del cliente" /></label>
            <label class="cz-form-full">Descripción corta (lo que se ve en la tarjeta del panel)<textarea class="cz-input cz-textarea" v-model="form.descripcionCorta" rows="2" placeholder="Ej: Redes sociales y pauta digital para posicionar la marca y aumentar ventas."></textarea></label>
            <label class="cz-form-full">Nota especial (opcional)<input class="cz-input" v-model="form.planesBadge" placeholder="Ej: Precio especial este mes, Oferta por tiempo limitado..." /></label>
          </div>

          <h3 class="cz-subtitulo">{{ form.planes.length > 1 ? 'Planes' : 'Plan de trabajo' }}</h3>
          <div v-for="(p, i) in form.planes" :key="i" class="cz-item-box">
            <div class="cz-item-top" v-if="form.planes.length > 1 || avanzado">
              <input v-if="avanzado" class="cz-input cz-item-num" v-model="p.avatar" placeholder="RS" maxlength="3" />
              <input class="cz-input" v-model="p.nombre" :placeholder="form.planes.length > 1 ? 'Nombre de este plan' : 'Nombre del plan (opcional)'" />
              <select v-if="avanzado" class="cz-input cz-select" v-model="p.acento"><option value="purple">Morado</option><option value="cyan">Cyan</option></select>
              <button v-if="form.planes.length > 1" class="cz-btn cz-btn--eliminar cz-btn--chico" @click="quitarPlan(i)"><v-icon icon="mdi-trash-can-outline" size="14" /></button>
            </div>
            <input v-if="avanzado" class="cz-input" v-model="p.tipo" placeholder="Subtítulo / tipo de plan (opcional)" style="margin-bottom:8px;" />
            <textarea class="cz-input cz-textarea" v-model="p.itemsTexto" placeholder="Qué incluye — un ítem por línea" rows="4" style="margin-bottom:8px;"></textarea>
            <div class="cz-form-grid" :class="avanzado ? 'cz-form-grid--4' : 'cz-form-grid--3'">
              <label v-if="avanzado">Antes (tachado)<input class="cz-input" v-model="p.precioAntes" placeholder="$2.000.000" /></label>
              <label v-if="avanzado">Etiqueta<input class="cz-input" v-model="p.precioLabel" placeholder="Precio especial" /></label>
              <label>Precio<input class="cz-input" v-model="p.precioMostrado" placeholder="$1.500.000" /></label>
              <label>Período<input class="cz-input" v-model="p.periodo" placeholder="COP / mes" /></label>
            </div>
          </div>
          <button class="cz-btn cz-btn--ghost cz-btn-agregar" @click="agregarPlan"><v-icon icon="mdi-plus" size="16" class="mr-1" /> Agregar otro plan</button>

          <h3 class="cz-subtitulo">Esta cotización no incluye (opcional)</h3>
          <textarea class="cz-input cz-textarea" v-model="form.exclusionesTexto" placeholder="Una exclusión por línea, ej: La inversión en pauta digital (Meta Ads, Google Ads) se define aparte." rows="3"></textarea>

          <details class="cz-avanzado" :open="avanzado" @toggle="avanzado = $event.target.open">
            <summary>Opciones avanzadas</summary>

            <div class="cz-form-grid" style="margin-top:14px;">
              <label v-if="!editandoSlug">Slug (opcional, se genera del nombre)<input class="cz-input" v-model="form.slug" placeholder="daniel-gil" /></label>
              <label>Período<input class="cz-input" v-model="form.periodo" placeholder="Agosto 2026" /></label>
              <label>Estado<input class="cz-input" v-model="form.estadoLabel" placeholder="Activa / -20% Descuento" /></label>
              <label>Etiquetas (separadas por coma)<input class="cz-input" v-model="form.etiquetasTexto" placeholder="Redes Sociales, Pauta Digital" /></label>
              <label>Etiqueta de precio (tarjeta)<input class="cz-input" v-model="form.precioLabel" placeholder="Total mensual / Desde / Valor único" /></label>
              <label>Precio mostrado (tarjeta)<input class="cz-input" v-model="form.precioMostrado" placeholder="$1.500.000" /></label>
            </div>

            <h3 class="cz-subtitulo">Portada (hero)</h3>
            <div class="cz-form-grid">
              <label class="cz-form-full">Título<input class="cz-input" v-model="form.heroTitulo" placeholder="Posicionamiento de marca y ventas para..." /></label>
              <label class="cz-form-full">Subtítulo<textarea class="cz-input cz-textarea" v-model="form.heroSubtitulo" rows="2"></textarea></label>
            </div>

            <h3 class="cz-subtitulo">Pilares / enfoque</h3>
            <div class="cz-form-grid">
              <label class="cz-form-full">Título de sección<input class="cz-input" v-model="form.pilaresTitulo" /></label>
              <label class="cz-form-full">Subtítulo de sección<textarea class="cz-input cz-textarea" v-model="form.pilaresSubtitulo" rows="2"></textarea></label>
            </div>
            <div v-for="(p, i) in form.pilares" :key="i" class="cz-item-box">
              <div class="cz-item-top">
                <input class="cz-input cz-item-num" v-model="p.numero" placeholder="01" />
                <input class="cz-input" v-model="p.titulo" placeholder="Título del pilar" />
                <button class="cz-btn cz-btn--eliminar cz-btn--chico" @click="quitarPilar(i)"><v-icon icon="mdi-trash-can-outline" size="14" /></button>
              </div>
              <textarea class="cz-input cz-textarea" v-model="p.descripcion" placeholder="Descripción" rows="2"></textarea>
            </div>
            <button class="cz-btn cz-btn--ghost cz-btn-agregar" @click="agregarPilar"><v-icon icon="mdi-plus" size="16" class="mr-1" /> Agregar pilar</button>

            <h3 class="cz-subtitulo">Sección de planes</h3>
            <div class="cz-form-grid">
              <label class="cz-form-full">Título de sección<input class="cz-input" v-model="form.planesTitulo" placeholder="Plan de trabajo" /></label>
              <label class="cz-form-full">Subtítulo de sección<textarea class="cz-input cz-textarea" v-model="form.planesSubtitulo" rows="2"></textarea></label>
            </div>

            <h3 class="cz-subtitulo">Resumen económico (tabla aparte, opcional)</h3>
            <div v-for="(f, i) in form.resumenFilas" :key="i" class="cz-item-top" style="margin-bottom:8px;">
              <input class="cz-input" v-model="f.servicio" placeholder="Servicio" />
              <input class="cz-input cz-item-num" v-model="f.antes" placeholder="Antes" />
              <input class="cz-input cz-item-num" v-model="f.precio" placeholder="Precio" />
              <button class="cz-btn cz-btn--eliminar cz-btn--chico" @click="quitarFilaResumen(i)"><v-icon icon="mdi-trash-can-outline" size="14" /></button>
            </div>
            <button class="cz-btn cz-btn--ghost cz-btn-agregar" @click="agregarFilaResumen"><v-icon icon="mdi-plus" size="16" class="mr-1" /> Agregar fila</button>
            <div class="cz-form-grid cz-form-grid--3" style="margin-top:12px;">
              <label>Total antes<input class="cz-input" v-model="form.resumenTotalAntes" placeholder="$3.500.000" /></label>
              <label>Total<input class="cz-input" v-model="form.resumenTotalMonto" placeholder="$2.500.000" /></label>
              <label>Período<input class="cz-input" v-model="form.resumenTotalPeriodo" placeholder="COP / mes" /></label>
            </div>

            <h3 class="cz-subtitulo">Cierre</h3>
            <div class="cz-form-grid">
              <label class="cz-form-full">Título de cierre<input class="cz-input" v-model="form.cierreTitulo" placeholder="Listos para empezar" /></label>
              <label class="cz-form-full">Texto de cierre<textarea class="cz-input cz-textarea" v-model="form.cierreTexto" rows="2"></textarea></label>
            </div>
          </details>

          <p v-if="errorGuardar" class="cz-error">{{ errorGuardar }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="cz-dialog-cancel" @click="dialogAbierto = false" :disabled="guardando">Cancelar</button>
          <button class="cz-btn cz-btn--primary" :disabled="guardando" @click="guardar">
            {{ guardando ? 'Guardando…' : (editandoSlug ? 'Guardar cambios' : 'Crear cotización') }}
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.cz-page { min-height: 100vh; background: var(--dark-bg); padding: 56px 24px 80px; position: relative; overflow: hidden; }
.cz-glow { position: absolute; width: 600px; height: 600px; border-radius: 50%; pointer-events: none; z-index: 0; }
.cz-glow-1 { top: -200px; left: -150px; background: radial-gradient(circle, rgba(161, 0, 255, 0.18) 0%, transparent 65%); }
.cz-glow-2 { bottom: -250px; right: -150px; background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 65%); }

.cz-header { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto 40px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.cz-logo { width: 140px; }
.cz-header-text h1 { font-size: 26px; margin: 0 0 4px; font-weight: 800; color: #fff; }
.cz-header-text p { margin: 0; color: var(--text-secondary); font-size: 13px; }

.cz-estado-carga { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; color: var(--text-muted); font-size: 13px; padding: 12px 0; }

.cz-login { position: relative; z-index: 1; max-width: 360px; margin: 40px auto; padding: 32px; text-align: center; }
.cz-login h2 { color: #fff; font-size: 18px; margin: 0 0 8px; }
.cz-login p { color: var(--text-secondary); font-size: 13px; margin: 0 0 18px; }
.cz-login .cz-input { margin-bottom: 14px; }
.cz-login .cz-btn { width: 100%; }

.cz-contenido { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; }
.cz-btn-nueva { margin-bottom: 24px; }

.cz-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 16px; }
.cz-card { padding: 20px 22px; display: flex; flex-direction: column; gap: 10px; }
.cz-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.cz-card-cliente { font-size: 16px; font-weight: 800; color: #fff; }
.cz-card-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin: 0; }
.cz-card-precio { display: flex; flex-direction: column; gap: 2px; padding-top: 8px; border-top: 1px solid var(--border); }
.cz-card-precio-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
.cz-card-precio-monto { font-size: 18px; font-weight: 800; color: var(--primary-light); }
.cz-card-acciones { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }

.cz-estado-badge {
  font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap;
  padding: 5px 10px; border-radius: 100px; background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.3); color: #4ade80;
}
.cz-estado-badge--descuento { background: rgba(161,0,255,0.12); border-color: var(--border); color: var(--primary-light); }

.cz-input {
  background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); border-radius: 8px;
  padding: 8px 11px; color: #fff; color-scheme: dark; font-family: inherit; font-size: 12.5px; width: 100%;
}
.cz-textarea { resize: vertical; }
.cz-select { appearance: auto; }

.cz-btn {
  display: inline-flex; align-items: center; justify-content: center; border-radius: 10px;
  padding: 9px 14px; font-size: 12.5px; font-weight: 600; border: none; font-family: inherit;
  cursor: pointer; text-decoration: none; transition: all 0.2s ease;
}
.cz-btn--primary { background: var(--gradient); color: #fff; }
.cz-btn--primary:hover { filter: brightness(1.1); }
.cz-btn--primary:disabled { opacity: 0.6; cursor: default; }
.cz-btn--ghost { background: rgba(161, 0, 255, 0.12); border: 1px solid var(--border); color: var(--primary-light); }
.cz-btn--ghost:hover { background: rgba(161, 0, 255, 0.2); }
.cz-btn--eliminar { background: rgba(248, 113, 113, 0.08); border: 1px solid rgba(248, 113, 113, 0.3); color: #fca5a5; }
.cz-btn--eliminar:hover { background: rgba(248, 113, 113, 0.18); }
.cz-btn--eliminar:disabled { opacity: 0.5; cursor: default; }
.cz-btn--chico { width: 30px; height: 30px; padding: 0; flex-shrink: 0; }
.cz-btn-agregar { margin-top: 2px; }

.cz-error { color: #fca5a5; font-size: 12px; margin: 10px 0 0; }

.cz-dialog { background: var(--dark-card) !important; }
.cz-dialog-title { color: #fff; }
.cz-subtitulo { color: var(--primary-light); font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 22px 0 12px; border-top: 1px solid var(--border); padding-top: 18px; }
.cz-ayuda { color: var(--text-muted); font-size: 12px; line-height: 1.5; margin: 0 0 18px; }
.cz-avanzado { margin-top: 22px; border-top: 1px solid var(--border); padding-top: 14px; }
.cz-avanzado summary { cursor: pointer; font-size: 12.5px; color: var(--primary-light); font-weight: 600; }
.cz-avanzado .cz-subtitulo:first-of-type { margin-top: 22px; }
.cz-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.cz-form-grid--3 { grid-template-columns: 1fr 1fr 1fr; }
.cz-form-grid--4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
.cz-form-grid label { display: flex; flex-direction: column; gap: 5px; font-size: 11.5px; color: var(--text-secondary); }
.cz-form-full { grid-column: 1 / -1; }
.cz-dialog-cancel { background: transparent; border: none; color: var(--text-secondary); padding: 10px 14px; cursor: pointer; font-family: inherit; font-size: 13px; }

.cz-item-box { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 10px; padding: 12px; margin-top: 10px; }
.cz-item-top { display: flex; gap: 8px; align-items: center; }
.cz-item-num { max-width: 90px; }

@media (max-width: 480px) {
  .cz-header { gap: 14px; }
  .cz-logo { width: 110px; }
  .cz-form-grid, .cz-form-grid--3, .cz-form-grid--4 { grid-template-columns: 1fr; }
}
</style>
