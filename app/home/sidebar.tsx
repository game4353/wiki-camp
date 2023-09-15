import { type ReactNode, useRef } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { defaultNavItems } from './defaultNavItems'
import { useOnClickOutside } from 'usehooks-ts'
import { usePathname } from 'next/navigation'
import { i18n } from '@/i18n-config'

// define a NavItem prop
export type NavItem = {
  label: string
  href: string
  icon: ReactNode
}

export default function Sidebar ({
  open,
  navItems = defaultNavItems,
  setOpen
}: {
  open: boolean
  navItems?: NavItem[]
  setOpen(open: boolean): void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, e => {
    setOpen(false)
  })

  const pathName = usePathname()
  const currentLoacale = (() => {
    if (!pathName) return ''
    const locale = pathName.split('/')[1]
    if (i18n.locales.includes(locale as any)) return `/${locale}`
    return ''
  })()

  return (
    <div
      className='flex flex-col justify-between bg-blue-200 dark:bg-blue-800 transition duration-250 ease-default'
      ref={ref}
    >
      <nav className='md:sticky top-0 md:top-16'>
        {/* nav items */}
        <ul>
          {navItems.map((item, index) => {
            return (
              <Link
                key={index}
                href={`${currentLoacale}${item.href}`}
              >
                <li className='text-indigo-900 hover:bg-indigo-100 dark:text-indigo-100 hover:dark:bg-indigo-900 flex flex-row gap-4 items-center transition-colors duration-300 rounded-md p-2 m-2'>
                  <div className='w-7'>
                    {item.icon}
                  </div>
                  <span className={classNames({
                    'hidden': !open,
                    'whitespace-nowrap': true
                  })}>
                  {item.label}
                  </span>
                </li>
              </Link>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
