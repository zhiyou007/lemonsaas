// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      title: 'Lumen — Insights that light up your growth',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'Lumen is the modern analytics, billing and revenue platform for fast-growing teams.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:title', content: 'Lumen — Insights that light up your growth' },
        { property: 'og:description', content: 'Analytics, subscriptions and billing in one beautifully simple platform.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' }
      ],
      script: [
        {
          innerHTML: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          type: 'text/javascript'
        }
      ]
    }
  },
  nitro: {
    preset: 'node-server'
  }
})
