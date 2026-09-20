// Shared UI state for the dashboard chrome: sidebar collapse + open tabs.
const routes = [
  { path: '/dashboard', labelKey: 'nav.dashboard', adminOnly: true, icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { path: '/dashboard/projects', labelKey: 'nav.projects', icon: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z' },
  { path: '/dashboard/blog', labelKey: 'nav.blog', icon: 'M4 6h16M4 12h16M4 18h10', adminOnly: true },
  { path: '/dashboard/admin', labelKey: 'nav.admin', icon: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6', adminOnly: true },
  { path: '/dashboard/billing', labelKey: 'nav.billing', icon: 'M3 10h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z' },
  { path: '/dashboard/settings', labelKey: 'nav.settings', adminOnly: true, icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z', divider: true },
  // Personal center is opened via the avatar block, not shown in the nav.
  { path: '/dashboard/profile', labelKey: 'nav.profile', icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z', hideNav: true }
]

export const useUi = () => {
  const collapsed = useState('sidebar-collapsed', () => {
    if (import.meta.client) return localStorage.getItem('sidebar-collapsed') === '1'
    return false
  })
  const mobileOpen = useState('sidebar-mobile', () => false)
  const openTabs = useState<string[]>('open-tabs', () => {
    if (import.meta.client) {
      try {
        const saved = JSON.parse(localStorage.getItem('open-tabs') || 'null')
        if (Array.isArray(saved) && saved.length) return saved
      } catch {}
    }
    return ['/dashboard']
  })

  if (import.meta.client) {
    watch(collapsed, v => localStorage.setItem('sidebar-collapsed', v ? '1' : '0'), { immediate: true })
    watch(openTabs, v => localStorage.setItem('open-tabs', JSON.stringify(v)), { deep: true })
  }

  function toggleSidebar() { collapsed.value = !collapsed.value }

  function openTab(path: string) {
    if (!openTabs.value.includes(path)) openTabs.value = [...openTabs.value, path]
  }
  function closeTab(path: string, current: string, router: any) {
    const idx = openTabs.value.indexOf(path)
    const next = openTabs.value.filter((p) => p !== path)
    openTabs.value = next
    if (current === path) {
      const fallback = next[Math.max(0, idx - 1)] || '/dashboard'
      router.push(fallback)
    }
  }
  function labelFor(path: string) {
    // Match the longest route prefix so /dashboard/projects doesn't fall back to /dashboard.
    const best = routes
      .filter((r) => path === r.path || path.startsWith(r.path + '/'))
      .sort((a, b) => b.path.length - a.path.length)[0]
    return best?.labelKey || 'nav.dashboard'
  }

  return { collapsed, toggleSidebar, mobileOpen, openTabs, openTab, closeTab, routes, labelFor }
}
