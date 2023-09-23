'use client'

import { Checkbox } from '@nextui-org/react'
import { useEffect, type ReactNode } from 'react'
import type { FilterOption } from '.'
import { useCheck } from './hook'
import { isEmpty } from '@/app/util'

export function FilterBoxes ({
  label,
  boxes,
  parentPaths,
  uid
}: {
  parentPaths: string[]
  uid: string
  boxes: FilterOption[]
  label: ReactNode
}) {
  const { getCheck, setCheckOn, setCheckOff } = useCheck()
  const allPath = [...parentPaths, uid]
  const allStates = getCheck(allPath)
  const allState =
    typeof allStates === 'boolean'
      ? allStates
      : isEmpty(allStates ?? [])
      ? undefined
      : Object.values(allStates!).every(b => b === true)
      ? true
      : Object.values(allStates!).every(b => b === false)
      ? false
      : undefined

  return (
    <div className='flex flex-col gap-1'>
      <Checkbox
        value='all'
        isSelected={Boolean(allState)}
        isIndeterminate={allState == null}
        onValueChange={check => {
          if (check) setCheckOn(allPath)
          else setCheckOff(allPath)
        }}
      >
        <div className='font-semibold'>{label}</div>
      </Checkbox>
      <div className='flex flex-row gap-4'>
        {boxes.map(box => (
          <FilterBox parentPaths={allPath} options={box} key={box.uid} />
        ))}
      </div>
    </div>
  )
}

export function FilterBox ({
  options,
  parentPaths
}: {
  parentPaths: string[]
  options: FilterOption
}) {
  const { getCheck, setCheckOn, setCheckOff, initCheckOn, initCheckOff } =
    useCheck()
  const paths = [...parentPaths, options.uid]

  useEffect(() => {
    Boolean(options.hide) ? initCheckOff(paths) : initCheckOn(paths)
  }, [])

  return (
    <Checkbox
      key={options.uid}
      value={options.value}
      isSelected={Boolean(getCheck(paths))}
      onValueChange={check => {
        check ? setCheckOn(paths) : setCheckOff(paths)
      }}
    >
      {options.name}
    </Checkbox>
  )
}
