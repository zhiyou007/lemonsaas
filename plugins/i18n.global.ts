export default defineNuxtPlugin(() => {
  const cookie = useCookie('locale', { maxAge: 365 * 86400 })
  const { setLocale } = useI18n()
  if (cookie.value === 'en' || cookie.value === 'zh') {
    setLocale(cookie.value)
  }
})
