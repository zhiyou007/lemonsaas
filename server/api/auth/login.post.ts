export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = String(body?.email || '').trim().toLowerCase()
  const password = String(body?.password || '')

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const { token, expires } = await createSession(user.id)
  setSessionCookie(event, token, expires)

  return { id: user.id, name: user.name, email: user.email }
})
