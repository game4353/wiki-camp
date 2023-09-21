import { Bars3Icon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import LocaleSwitcher from './locale-switcher'
import Image from 'next/image'
import { Button } from '@nextui-org/react'
import { faEllipsisVertical, faListUl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SetStateAction } from 'react'
import ThemeSwitcher from './ThemeSwitcher'
import FutureSwitcher from './FutureSwitcher'

export default function Navbar ({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen(value: SetStateAction<boolean>): void
}) {
  return (
    <nav className='bg-orange-400 dark:bg-orange-700 flex gap-2 items-center w-full fixed z-50 shadow-sm h-16'>
      <div className='flex w-14 place-content-center'>
        <Button
          isIconOnly
          variant='light'
          className='bg-blue-200 dark:bg-blue-800 text-indigo-900 dark:text-indigo-100 hover:bg-indigo-100 hover:dark:bg-indigo-900'
          onClick={() => setSidebarOpen(b => !b)}
        >
          <FontAwesomeIcon
            icon={sidebarOpen ? faListUl : faEllipsisVertical}
            size='lg'
          />
        </Button>
      </div>
      <div className='flex flex-row gap-2'>
        <Image
          priority
          className='dark:invert'
          src='/images/logo.svg'
          height={32}
          width={32}
          alt='wiki camp logo'
        ></Image>
        <p className='font-bold text-lg'>wiki-camp</p>
      </div>
      <div className='flex-grow'></div> {/** spacer */}
      <FutureSwitcher />
      <ThemeSwitcher />
      <LocaleSwitcher />
    </nav>
  )
}
