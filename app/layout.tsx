import './globals.css'
import Home from './home'
import { Inter } from 'next/font/google'
import { Locale, i18n } from '@/i18n-config'
import { Providers } from './providers'

import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false

const inter = Inter({ subsets: ['latin'] })

export async function generateStaticParams () {
  return i18n.locales.map(lang => {
    lang
  })
}

export default function RootLayout ({
  children,
  params
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <Providers>
          <Home>
            {children}
          </Home>
        </Providers>
      </body>
    </html>
  )
}
