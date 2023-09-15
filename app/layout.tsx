'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import Sidebar from './home/sidebar'
import Navbar from './home/navbar'
import classNames from 'classnames'
import { Locale, i18n } from '@/i18n-config'
import { Providers } from './providers'
import { Button } from '@nextui-org/react'
import { faEllipsisVertical, faListUl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
  
  useEffect(() => {
    if (window.innerWidth >= 768) setSidebarOpen(true)
  }, [])

  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <Providers>
          <div className='grid min-h-screen grid-rows-[64px_1fr] bg-zinc-100 dark:bg-zinc-900'>
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className={classNames({
              'grid row-start-2': true,
              'transition-grid-cols duration-300': true,
              'grid-cols-[56px_1fr]': !sidebarOpen,
              'grid-cols-[200px_1fr]': sidebarOpen
            })}>
              <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}></Sidebar>
              <div className='col-start-2'>{children}</div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
