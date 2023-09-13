// https://github.com/vercel/next.js/issues/41980

export const i18n = {
  defaultLocale: 'ja',
  locales: ['ja', 'zh', 'en', 'ko'],
  languages: {
    ja: '日本語',
    zh: '中文(台灣)',
    en: 'English',
    ko: '한국어'
  }
} as const

export type Locale = typeof i18n['locales'][number]
