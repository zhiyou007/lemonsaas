export const useAuth = () => {
  const user = useState<{ id: string; name: string; email: string; plan: string } | null>('auth-user', () => null)

  async function refresh() {
    const { data } = await useFetch('/api/auth/session', { key: 'session' })
    user.value = data.value?.user || null
    return user.value
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/login')
  }

  return { user, refresh, logout }
}
