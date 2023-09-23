// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react'
import { PrimeReactProvider } from 'primereact/api'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ReduxProvider } from '@/redux/provider'

export function Providers ({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <PrimeReactProvider>
        <NextUIProvider>
          <NextThemesProvider attribute='class' defaultTheme='system'>
            {children}
          </NextThemesProvider>
        </NextUIProvider>
      </PrimeReactProvider>
    </ReduxProvider>
  )
}
