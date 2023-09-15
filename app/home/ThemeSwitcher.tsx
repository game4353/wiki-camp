'use client'

import { Button } from '@nextui-org/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const Sun = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='icon icon-tabler icon-tabler-sun'
    width='30'
    height='30'
    viewBox='0 0 24 24'
    stroke-width='1.5'
    stroke='#2c3e50'
    fill='currentColor'
    stroke-linecap='round'
    stroke-linejoin='round'
  >
    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
    <path d='M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0' />
    <path d='M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7' />
  </svg>
)

const Moon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='icon icon-tabler icon-tabler-moon'
    width='30'
    height='30'
    viewBox='0 0 24 24'
    stroke-width='1.5'
    stroke='#2c3e50'
    fill='currentColor'
    stroke-linecap='round'
    stroke-linejoin='round'
  >
    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
    <path d='M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z' />
  </svg>
)

const SunMoon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='icon icon-tabler icon-tabler-sun-moon'
    width='30'
    height='30'
    viewBox='0 0 24 24'
    stroke-width='1.5'
    stroke='#2c3e50'
    fill='currentColor'
    stroke-linecap='round'
    stroke-linejoin='round'
  >
    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
    <path d='M9.173 14.83a4 4 0 1 1 5.657 -5.657' />
    <path d='M11.294 12.707l.174 .247a7.5 7.5 0 0 0 8.845 2.492a9 9 0 0 1 -14.671 2.914' />
    <path d='M3 12h1' />
    <path d='M12 3v1' />
    <path d='M5.6 5.6l.7 .7' />
    <path d='M3 21l18 -18' />
  </svg>
)

export default function ThemeSwitcher () {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  if (theme === 'light')
    return (
      <Button isIconOnly variant='light' onClick={() => setTheme('dark')}>
        <Sun />
      </Button>
    )
  if (theme === 'dark')
    return (
      <Button isIconOnly variant='light' onClick={() => setTheme('system')}>
        <Moon />
      </Button>
    )
  return (
    <Button isIconOnly variant='light' onClick={() => setTheme('light')}>
      <SunMoon />
    </Button>
  )
}
