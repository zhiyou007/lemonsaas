import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'

const COOKIE_NAME = 'lumen_session'

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function createSession(userId: string) {
  const token = generateToken()
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  await prisma.session.create({ data: { token, userId, expiresAt: expires } })
  return { token, expires }
}

export async function getAuthUser(event: H3Event) {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return null
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  })
  if (!session || session.expiresAt < new Date()) return null
  return session.user
}

export function setSessionCookie(event: H3Event, token: string, expires: Date) {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    expires
  })
}

export function clearSessionCookie(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export { bcrypt }
