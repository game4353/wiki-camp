import { Bars3Icon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import LocaleSwitcher from './locale-switcher'
import Image from 'next/image'

type Props = {
  onMenuButtonClick(): void
}

export default function Navbar (props: Props) {
  return (
    <nav
      className={classNames({
        'bg-white text-zinc-500': true, // colors
        'flex items-center': true, // layout
        'w-full fixed z-10 px-4 shadow-sm h-16': true //positioning & styling
      })}
    >
      <div className='flex flex-row gap-2'>
        <Image
          priority
          src='/images/logo.svg'
          height={32}
          width={32}
          alt='wiki camp logo'
        ></Image>
        <p className='font-bold text-lg'>wiki-camp</p>
      </div>
      <div className='flex-grow'></div> {/** spacer */}
      <button className='md:hidden' onClick={props.onMenuButtonClick}>
        <Bars3Icon className='h-6 w-6' />
      </button>
      <LocaleSwitcher />
    </nav>
  )
}
