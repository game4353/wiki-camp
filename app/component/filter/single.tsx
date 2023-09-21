import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from 'react'
import { FilterOption, FilterBox } from '.'

export default function Filter1<T> ({
  label,
  filterOptions,
  toList,
  list,
  onChange
}: {
  label: ReactNode
  filterOptions: FilterOption[]
  toList: (o: T) => string | string[]
  list: Set<T>
  onChange: Function
}) {
  const size = filterOptions.length
  const init = new Set(
    filterOptions
      .filter(o => !Boolean(o.hide) && o.value != null)
      .map(o => o.value)
  )

  console.log('hello', label)

  const [set, setSet] = useState(init)

  function filter (itemSet: Set<T>) {
    itemSet.forEach(item => {      
      const strs = toList(item)
      const arr = typeof strs === 'string' ? [strs] : strs
      if (arr.some(s => set.has(s))) return
      itemSet.delete(item)
    })
  }

  useEffect(() => {
    console.log('clicking', label)
    onChange()
  }, [set])

  useEffect(() => {
    console.log('setting', label)
    filter(list)
  }, [list])

  return (
    <FilterBox
      label={label}
      value={set}
      onValueChange={setSet}
      boxes={filterOptions}
    />
  )
}
