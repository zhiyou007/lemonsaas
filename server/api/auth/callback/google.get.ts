export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string | undefined
  const clientId = await getSetting(SETTING_KEYS.googleClientId, process.env.GOOGLE_CLIENT_ID || '')
  const clientSecret = await getSetting(SETTING_KEYS.googleClientSecret, process.env.GOOGLE_CLIENT_SECRET || '')
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google'
  const loginUrl = '/login?error=google'

  if (!code || !clientId || !clientSecret) {
    return sendRedirect(event, loginUrl)
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })
    const tokens = await tokenRes.json()
    if (!tokens.access_token) return sendRedirect(event, loginUrl)

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { authorization: `Bearer ${tokens.access_token}` }
    })
    const info = await userRes.json()
    const email = String(info.email || '').toLowerCase()
    if (!email) return sendRedirect(event, loginUrl)

    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      const randomPassword = Array.from(crypto.getRandomValues(new Uint8Array(24)), (b) => b.toString(16).padStart(2, '0')).join('')
      const passwordHash = await bcrypt.hash(randomPassword, 10)
      user = await prisma.user.create({
        data: {
          email,
          name: info.name || email.split('@')[0],
          passwordHash,
          subscription: { create: { plan: 'free' } }
        }
      })
    }

    const { token, expires } = await createSession(user.id)
    setSessionCookie(event, token, expires)
    return sendRedirect(event, '/dashboard')
  } catch (err) {
    return sendRedirect(event, loginUrl)
  }
})
