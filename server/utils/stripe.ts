import Stripe from 'stripe'
import { getSetting, SETTING_KEYS } from './settings'

let instance: Stripe | null = null
let cachedKey = ''

export async function getStripe() {
  const key = await getSetting(SETTING_KEYS.stripeSecretKey, process.env.STRIPE_SECRET_KEY || '')
  if (!key) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe is not configured' })
  }
  if (!instance || cachedKey !== key) {
    instance = new Stripe(key)
    cachedKey = key
  }
  return instance
}
