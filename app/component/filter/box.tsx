'use client'

import { Checkbox } from '@nextui-org/react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { type FilterOption } from '.'

export function FilterBox ({
  label,
  boxes,
  value,
  onValueChange
}: {
  label: ReactNode
  boxes: FilterOption[]
  value: Set<string>
  onValueChange: Dispatch<SetStateAction<Set<string>>>
}) {
  const all = new Set(boxes.map(b => b.value).filter(v => v != null))
  const n = [...value].filter(x => all.has(x)).length

  return (
    <div className='flex flex-col gap-1'>
      <Checkbox
        value='all'
        isSelected={n === all.size}
        isIndeterminate={0 < n && n < all.size}
        onValueChange={on => {
          if (on) onValueChange(new Set(all))
          else onValueChange(new Set([]))
        }}
      >
        <div className='font-semibold'>{label}</div>
      </Checkbox>
      <div className='flex flex-row gap-4'>
        {boxes.map(box => (
          <Checkbox
            key={box.value}
            value={box.value}
            isSelected={value.has(box.value)}
            onValueChange={on => {
              if (on) onValueChange(s => new Set(s.add(box.value)))
              else
                onValueChange(s => {
                  s.delete(box.value)
                  return new Set(s)
                })
            }}
          >
            {box.name}
          </Checkbox>
        ))}
      </div>
    </div>
  )
}
