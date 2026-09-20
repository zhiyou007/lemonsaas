import en from '~/i18n/locales/en'
import zh from '~/i18n/locales/zh'

// Add new locales here: import the file and push { code, label }.
const messages: Record<string, any> = { en, zh }
export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
] as const
export type Locale = typeof LOCALES[number]['code']

export const useI18n = () => {
  const locale = useState<Locale>('locale', () => 'en')

  function t(path: string): string {
    const val = path.split('.').reduce((acc: any, k) => (acc ? acc[k] : undefined), messages[locale.value] || messages.en)
    return typeof val === 'string' ? val : path
  }

  function setLocale(l: Locale) {
    locale.value = l
    useCookie('locale', { maxAge: 365 * 86400 }).value = l
  }

  return { locale, t, setLocale, locales: LOCALES }
}
