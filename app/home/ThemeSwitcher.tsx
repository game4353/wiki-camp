'use client'

import { Button } from '@nextui-org/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Sun from './sun.svg'
import Moon from './moon.svg'
import SunMoon from './sunMoon.svg'


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
