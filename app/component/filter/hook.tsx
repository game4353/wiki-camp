'use client'

import { ReactNode, useCallback, useState } from 'react'
import { FilterItem, FilterKit, type FilterOption } from '.'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FilterBox } from './box'
import { Accordion, AccordionItem, Input } from '@nextui-org/react'

export function useFilters<T> (
  filters: {
    title: string
    kits: FilterKit<T>[]
  }[]
) {
  function filter (list: T[]) {
    let items = list
    filters.forEach(({ kits }) => {
      kits.forEach(({ f }) => {
        items = f(items)
      })
    })
    return items
  }

  const component = (
    <div className='p-3'>
      <Accordion selectionMode='multiple'>
        {filters.map((o, i) => (
          <AccordionItem key={i} title={o.title}>
            <div className='flex flex-col gap-3'>
              {o.kits.map((k, j) => (
                <div key={j}>{k.c}</div>
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )

  return {
    c: component,
    f: filter
  }
}

export function useFilter<T> (
  label: ReactNode,
  filterOptions: FilterOption[],
  toList: (o: T) => string | string[]
) {
  const size = filterOptions.length
  const init = new Set(
    filterOptions
      .filter(o => !Boolean(o.hide) && o.value != null)
      .map(o => o.value)
  )

  const [set, setSet] = useState(init)

  function filter (list: T[]) {
    if (set.size !== size) {
      return list.filter(row => {
        const strs = toList(row)
        const arr2 = typeof strs === 'string' ? [strs] : strs
        return arr2.some(s => set.has(s))
      })
    }
    return list
  }

  const component = (
    <FilterBox
      label={label}
      value={set}
      onValueChange={setSet}
      boxes={filterOptions}
    />
  )

  return {
    /** the Set of Strings that Show */
    s: set,
    /** the Component of Checkboxes */
    c: component,
    /** the Function to Filter */
    f: filter
  }
}


export function useBoxFilter<T extends FilterItem> (
  label: ReactNode,
  filterOptions: FilterOption[],
  filterKey: string
) {  
  const size = filterOptions.length
  const init = new Set(
    filterOptions
      .filter(o => !Boolean(o.hide) && o.value != null)
      .map(o => o.value)
  )
  const [set, setSet] = useState(init)
  
  function filter (list: T[]) {
    if (set.size !== size) {
      return list.filter(row => {
        const strs = row.filters[filterKey]
        if (strs == null) return set.has('NULL')
        const arr2 = typeof strs === 'string' ? [strs] : strs
        return arr2.some(s => set.has(s))
      })
    }
    return list
  }

  const component = (
    <FilterBox
      key={filterKey}
      label={label}
      value={set}
      onValueChange={setSet}
      boxes={filterOptions}
    />
  )

  return {
    /** the Set of Strings that Show */
    s: set,
    /** the Component of Checkboxes */
    c: component,
    /** the Function to Filter */
    f: filter
  }
}

export function useSearchFilter () {
  const [filterValue, setFilterValue] = useState('')

  function filter<T extends { searchName: string }> (list: T[]) {
    if (!Boolean(filterValue)) return list
    return list.filter(row => row.searchName.includes(filterValue))
  }

  const onListChange = useCallback((value?: string) => {
    setFilterValue(value ?? '')
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
  }, [])

  const component = (
    <Input
      key='searchFilter'
      isClearable
      className='w-full sm:max-w-[44%]'
      placeholder='Input text here...'
      startContent={<FontAwesomeIcon icon={faMagnifyingGlass} />}
      value={filterValue}
      onClear={() => onClear()}
      onValueChange={onListChange}
    />
  )

  return {
    /** the String for Searching */
    s: filterValue,
    /** the Component of Checkboxes */
    c: component,
    /** the Function to Filter */
    f: filter
  }
}
