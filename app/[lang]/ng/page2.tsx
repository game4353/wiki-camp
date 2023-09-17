'use client'

import { toHira } from '@/app/util'
import { Locale } from '@/i18n-config'
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Textarea } from '@nextui-org/react'
import { useState } from 'react'

const alert = (text: string) => (
  <div
    className='flex gap-2 bg-red-200 dark:bg-red-800 rounded-lg p-4 mb-4 text-sm text-red-700 dark:text-red-300'
    role='alert'
    key={text}
  >
    <FontAwesomeIcon icon={faBan} />
    <span className='font-bold'>{text}</span>
  </div>
)

const okay = (text: string) => (
  <div
    className='flex gap-2 bg-green-200 dark:bg-green-800 rounded-lg p-4 mb-4 text-sm text-green-700 dark:text-green-300'
    role='alert'
    key='ok'
  >
    <FontAwesomeIcon icon={faCheck} />
    <span className='font-bold'>{text}</span>
  </div>
)

export function NgWordClient ({
  lang,
  ngSet
}: {
  lang: Locale
  ngSet: Set<string>
}) {
  const [value, setValue] = useState('')

  const hiraValue = toHira(value)
  const cards = []
  ngSet.forEach(v => {
    if (hiraValue.includes(v)) cards.push(alert(v)) 
  })
  if (cards.length === 0 && value !== '') cards.push(okay(value))

  return (
    <div className='flex justify-center p-4'>
      <div className='w-full flex flex-col gap-2 max-w-[480px]'>
        <Textarea          
          label="NG word detection"
          labelPlacement="outside"
          variant='bordered'
          placeholder='Enter your text'
          value={value}
          onValueChange={setValue}
        />
        {cards}
      </div>
    </div>
  )
}
