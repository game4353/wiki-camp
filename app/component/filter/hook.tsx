'use client'

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'
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

export function FilterBoxes<T extends FilterItem> ({
  label,
  filterKey,
  filterOptions,
  filters,
  setFilters,
  list
}: {
  label: ReactNode
  filterOptions: FilterOption[]
  filterKey: string
  list: T[]
  filters: Record<string, boolean[]>
  setFilters: Dispatch<SetStateAction<Record<string, boolean[]>>>
}) {
  const size = filterOptions.length
  const init = new Set(
    filterOptions
      .filter(o => !Boolean(o.hide) && o.value != null)
      .map(o => o.value)
  )
  const [set, setSet] = useState(init)

  useEffect(() => {
    const newShow = list.map(o => {
      if (set.size === size) return true
      const strs = o.filters[filterKey]
      if (strs == null) return set.has('NULL')
      const arr2 = typeof strs === 'string' ? [strs] : strs
      return arr2.some(s => set.has(s))
    })
    const show = filters[filterKey] ?? []
    if (newShow.every((v, i) => v === show[i])) return
    const newFilters = { ...filters }
    newFilters[filterKey] = newShow
    setFilters(newFilters)
  }, [set, filters])

  return (
    <FilterBox
      key={filterKey}
      label={label}
      value={set}
      onValueChange={setSet}
      boxes={filterOptions}
    />
  )
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
