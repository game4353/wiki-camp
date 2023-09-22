'use client'

import { ReactNode, useEffect, useState } from 'react'
import Sidebar from './sidebar'
import Navbar from './navbar'
import classNames from 'classnames'

export default function Home ({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (window.innerWidth >= 768) setSidebarOpen(true)
  }, [])

  return (
    <div className='grid min-h-screen grid-rows-[64px_1fr] bg-stone-100 dark:bg-stone-800'>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={classNames({
          'grid row-start-2': true,
          'transition-grid-cols duration-300': true,
          'grid-cols-[56px_minmax(0,1fr)]': !sidebarOpen,
          'grid-cols-[200px_minmax(0,1fr)]': sidebarOpen
        })}
      >
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}></Sidebar>
        <div className='col-start-2'>{children}</div>
      </div>
    </div>
  )
}
