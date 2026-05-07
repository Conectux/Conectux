import { onMounted, onUnmounted } from 'vue'

export function useReveal() {
  let observer

  const init = (container) => {
    if (!container) return
    const elements = container.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    elements.forEach((el) => observer.observe(el))
  }

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { init }
}
