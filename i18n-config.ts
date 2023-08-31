// https://github.com/vercel/next.js/issues/41980

export const i18n = {
  defaultLocale: 'ja',
  locales: ['ja', 'zh', 'en', 'ko'],
} as const

export type Locale = (typeof i18n)['locales'][number]
