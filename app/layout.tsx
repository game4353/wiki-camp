'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import Sidebar from './home/sidebar'
import Navbar from './home/navbar'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <Providers>
          <div className='grid min-h-screen grid-rows-header bg-zinc-100'>
            <Navbar onMenuButtonClick={() => setSidebarOpen(b => !b)} />
            <div className='grid row-start-2 md:grid-cols-sidebar'>
              <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}></Sidebar>
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
