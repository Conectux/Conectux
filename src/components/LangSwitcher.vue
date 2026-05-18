<script setup>
import { ref, onMounted } from 'vue'

const active = ref('es')

const setLang = (target) => {
  active.value = target
  const select = document.querySelector('.goog-te-combo')
  if (!select) return
  select.value = target === 'es' ? '' : target
  select.dispatchEvent(new Event('change'))
}

onMounted(() => {
  const match = document.cookie.match(/googtrans=\/\w+\/(\w+)/)
  if (match?.[1] && match[1] !== 'es') active.value = match[1]
})
</script>

<template>
  <div class="lang-pill">
    <button
      class="flag-btn"
      :class="{ 'flag-active': active === 'es' }"
      title="Español"
      @click="setLang('es')"
    >🇨🇴</button>
    <div class="flag-sep" />
    <button
      class="flag-btn"
      :class="{ 'flag-active': active === 'en' }"
      title="English"
      @click="setLang('en')"
    >🇺🇸</button>
  </div>
</template>

<style scoped>
.lang-pill {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 100px;
  padding: 3px;
  gap: 2px;
}

.flag-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.45;
  line-height: 1;
  padding: 0;
}
.flag-btn:hover {
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.08);
}
.flag-active {
  opacity: 1 !important;
  background: rgba(161, 0, 255, 0.22) !important;
  box-shadow: 0 0 0 1px rgba(161, 0, 255, 0.45) !important;
}

.flag-sep {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.14);
  flex-shrink: 0;
}
</style>
