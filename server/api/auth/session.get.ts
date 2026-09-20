export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) return { user: null }
  const sub = await prisma.subscription.findUnique({ where: { userId: user.id } })
  return {
    user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin, plan: sub?.plan || 'free' }
  }
})
