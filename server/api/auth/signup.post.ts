export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = String(body?.name || '').trim()
  const email = String(body?.email || '').trim().toLowerCase()
  const password = String(body?.password || '')

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters' })
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Please enter a valid email' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'An account with this email already exists' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const userCount = await prisma.user.count()
  const user = await prisma.user.create({
    data: { name, email, passwordHash, isAdmin: userCount === 0, subscription: { create: { plan: 'free' } } }
  })

  const { token, expires } = await createSession(user.id)
  setSessionCookie(event, token, expires)

  return { id: user.id, name: user.name, email: user.email }
})
