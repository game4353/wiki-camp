// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react'
import { PrimeReactProvider } from 'primereact/api'

export function Providers ({ children }: { children: React.ReactNode }) {
  return (
    <PrimeReactProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </PrimeReactProvider>
  )
}
