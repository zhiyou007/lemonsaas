export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) return
  const { data } = await useFetch('/api/auth/session', { key: 'session' })
  if (!data.value?.user) {
    return navigateTo('/login')
  }
  if (to.path === '/dashboard' && !data.value.user.isAdmin) return navigateTo('/dashboard/projects')
  if ((to.path.startsWith('/dashboard/admin') || to.path.startsWith('/dashboard/blog') || to.path === '/dashboard/settings') && !data.value.user.isAdmin) {
    return navigateTo('/dashboard')
  }
})
