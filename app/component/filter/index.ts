import { type ReactNode } from 'react'
export { FilterBox } from './box'
export { useFilters, useFilter, useSearchFilter } from './hook'

/** this stands for absent of a filter type */
export const NULL = 'NULL'

export type FilterItem = {
  filters: Partial<Record<string, string | string[]>>
}

export type FilterOption = {
  /** name displays beside checkbox */
  name: ReactNode
  /** unique string for filter */
  value: string
  /** filtered out at start */
  hide?: boolean
}

export type FilterKit<T> = {
  s: string | Set<string>
  c: JSX.Element
  f: (list: T[]) => T[]
}

export type FilterParams<T> = {
  title: ReactNode
  options: FilterOption[]
  toList(o: T): string | string[]
}

export type FilterProp = {
  title: string
  kits: {
    subtitle: string
    v: FilterOption[]
    filterKey: string
  }[]
}[]
