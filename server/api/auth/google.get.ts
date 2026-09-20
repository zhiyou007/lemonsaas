export default defineEventHandler(async (event) => {
  const clientId = await getSetting(SETTING_KEYS.googleClientId, process.env.GOOGLE_CLIENT_ID || '')
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google'
  if (!clientId) {
    throw createError({ statusCode: 500, statusMessage: 'Google login is not configured' })
  }
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account'
  })
  return sendRedirect(event, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
})
