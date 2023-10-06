import { type ReactNode } from 'react'

export type FilterItem = {
  filters: Record<string, any>
}

export enum FilterMode {
  /** `itemValue` is undefined or empty array or empty set */
  EMPTY,
  /** `itemValue: T` === `filterValue: T` */
  IS,
  /** `itemValue: T` is in `filterValue: T | T[]` */
  IN,
  /** `filterValue: T` is in `itemValue: T | T[]` */
  HAS,
  // /** `itemValue: T[]` fully contains `filterValue: T[]` */
  // SUPEQ,
  // /** `itemValue: string` is a superstring of `filterValue: string` */
  // SUPSTR,
  /** `itemValue: number` is in the range of `filterValue: [number, number]`*/
  BETWEEN,
  /** `filterValue: number` is in the range of `itemValue: [number, number]`*/
  ENCLOSE,
  /** `itemValue: number` < `filterValue: number`*/
  LESS,
  /** `itemValue: number` > `filterValue: number`*/
  GTR,
  // /** `itemValue: number` <= `filterValue: number`*/
  // LEQ,
  // /** `itemValue: number` >= `filterValue: number`*/
  // GEQ,
  /** `itemValue: any[]` has length `filterValue: number` */
  SIZE,
}

export type FilterOption = {
  mode: FilterMode
  /** unique string for path */
  uid: string
  /** name displays beside checkbox */
  name: Exclude<ReactNode, null | undefined>
  /** filter value */
  value: any
  /** filtered out at start */
  hide?: boolean
}

export type FilterKit = {
  subtitle: string
  v: FilterOption[]
  filterKey: string
}

type FilterCat = {
  title: string
  kits: FilterKit[]
}

export type FilterMeta = {
  uid: string
  cats: FilterCat[]
}

/** [Defaults] 
 * 
 *  mode = FilterMode.HAS
 * 
 *  uid = name.toString()
 * 
 *  value = uid
 * 
 *  hide = false
 */
export function defaultOption({
  mode, uid, name, value, hide
}:{
  mode?: FilterMode
  uid?: string
  name: Exclude<ReactNode, null | undefined>
  value?: any
  hide?: boolean
}) {
  return {
    name,
    mode: mode ?? FilterMode.HAS,
    uid: uid ?? name.toString(),
    value: value ?? uid ?? name.toString(),
    hide,
  }
}