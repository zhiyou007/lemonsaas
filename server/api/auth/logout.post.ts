export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'lumen_session')
  if (token) {
    await prisma.session.deleteMany({ where: { token } })
  }
  clearSessionCookie(event)
  return { ok: true }
})
