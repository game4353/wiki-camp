import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  getCheck,
  on,
  off,
  initOn,
  initOff
} from '@/redux/features/checkBoxSlice'
import { FilterItem, FilterMode, FilterProp } from '.'

export function useCheck () {
  const checkState = useAppSelector(state => state.checkBoxReducer.value)
  const dispatch = useAppDispatch()

  return {
    checkState,
    getCheck (paths: string[]) {
      return getCheck(checkState, paths)
    },
    setCheckOn (paths: string[]) {
      dispatch(on(paths))
    },
    setCheckOff (paths: string[]) {
      dispatch(off(paths))
    },
    initCheckOn (paths: string[]) {
      dispatch(initOn(paths))
    },
    initCheckOff (paths: string[]) {
      dispatch(initOff(paths))
    }
  }
}

const Memo: {
  [key: string]: {
    dep: any[]
    value: any
  }
} = {}

function myMemo<T> (key: string, fn: () => T, dep: any[]) {
  const cachedDep = Memo[key]?.dep
  if (dep.every((v, i) => v === cachedDep?.[i])) return Memo[key].value as T
  const value = fn()
  Memo[key] = {
    dep,
    value
  }
  return value
}

export function useFiltered<T extends { uid: string | number } & FilterItem> (
  items: T[],
  filterProp: FilterProp
) {
  const { getCheck } = useCheck()

  let bools = items.map(_ => true)
  for (const fp of filterProp) {
    fp.kits.forEach(kit => {
      const paths = [fp.title, kit.filterKey]
      const shows = myMemo(
        paths.join('\\'),
        () =>
          items.map(item =>
            kit.v.some(option => {
              const paths = [fp.title, kit.filterKey, option.uid]
              const check = getCheck(paths)
              const itemValueObj = item.filters[fp.title]
              if (itemValueObj == null) return true
              const itemValue = itemValueObj[kit.filterKey]
              const filterValue = option.value
              switch (option.mode) {
                case FilterMode.EMPTY: {
                  // TODO make init of checkboxes early
                  if (check === false) return false
                  return Array.isArray(itemValue)
                    ? itemValue.length === 0
                    : itemValue instanceof Set
                    ? itemValue.size === 0
                    : itemValue === undefined
                }
                case FilterMode.IS: {
                  return check !== false && itemValue === filterValue
                }
                case FilterMode.HAS: {
                  const arr = Array.isArray(itemValue) ? itemValue : [itemValue]
                  return check !== false && arr.includes(filterValue)
                }
                case FilterMode.BETWEEN: {
                  return (
                    check !== false &&
                    itemValue >= filterValue[0] &&
                    itemValue <= filterValue[1]
                  )
                }
                case FilterMode.ENCLOSE: {
                  return (
                    check !== false &&
                    filterValue >= itemValue[0] &&
                    filterValue <= itemValue[1]
                  )
                }
                case FilterMode.LESS: {
                  return check !== false && itemValue < filterValue
                }
                case FilterMode.GTR: {
                  return check !== false && itemValue > filterValue
                }
                case FilterMode.SIZE: {
                  return (
                    check !== false &&
                    Array.isArray(itemValue) &&
                    itemValue.length === filterValue
                  )
                }
                default: {
                  throw new Error(`Unknown filter mode in option: ${option}`)
                }
              }
            })
          ),
        [
          items,
          filterProp,
          Object.entries(getCheck(paths) ?? {})
            .filter(([_, v]) => v === true)
            .map(([k, _]) => k)
            .join('\\')
        ]
      )
      shows.forEach((v, i) => (bools[i] &&= v))
      if (shows.every(v => v === false)) console.log(kit, items[80])
    })
  }
  return items.filter((_, i) => bools[i])
}
