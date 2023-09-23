import { isEmpty } from '@/app/util'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const val = Symbol()

type Nested<T> = T | { [k: string]: Nested<T> }
type Tree<T> = { [k: symbol]: T } | { [k: string]: Tree<T> }

type CheckBoxState = {
  value: Tree<boolean>
}

const initialState = {
  value: {}
} as CheckBoxState

function getDict (root: Tree<boolean>, path: string[], index = 0) {
  const name = path[index]
  if (name == null || name === '') return root
  if (val in root) throw new Error(' is a leaf.')
  if (!(name in root)) (root as { [k: string]: Tree<boolean> })[name] = {}
  try {
    return getDict(
      (root as { [k: string]: Tree<boolean> })[name],
      path,
      index + 1
    )
  } catch (e) {
    if (e instanceof Error) throw new Error(`\\${name}${e.message}`)
    else throw e
  }
}

export function getCheck (
  dict: Tree<boolean>,
  paths: string[]
): Nested<boolean | undefined> {
  try {
    const leaf = getDict(dict, paths)
    if (!isEmpty(leaf)) {
      return Object.fromEntries(
        Object.entries(leaf).map(([k, v]) => [k, getCheck(v, [])])
      )
    }
    return (leaf as { [k: symbol]: boolean })[val]
  } catch (e) {}
}

function recursiveSet (dict: Tree<boolean>, fn: (b: boolean) => boolean) {
  if (val in dict) dict[val] = fn(dict[val])
  else Object.values(dict).forEach(d => recursiveSet(d, fn))
}

export const checkBox = createSlice({
  name: 'checkBox',
  initialState,
  reducers: {
    reset: () => initialState,
    on: (state, action: PayloadAction<string[]>) => {
      const leaf = getDict(state.value, action.payload)
      if (isEmpty(leaf)) (leaf as { [k: symbol]: boolean })[val] = true
      else recursiveSet(leaf, b => true)
    },
    off: (state, action: PayloadAction<string[]>) => {
      const leaf = getDict(state.value, action.payload)
      if (isEmpty(leaf)) (leaf as { [k: symbol]: boolean })[val] = false
      else recursiveSet(leaf, b => false)
    },
    initOn: (state, action: PayloadAction<string[]>) => {
      const leaf = getDict(state.value, action.payload)
      if (isEmpty(leaf) && !(val in leaf))
        (leaf as { [k: symbol]: boolean })[val] = true
      else recursiveSet(leaf, b => b)
    },
    initOff: (state, action: PayloadAction<string[]>) => {
      const leaf = getDict(state.value, action.payload)
      if (isEmpty(leaf) && !(val in leaf))
        (leaf as { [k: symbol]: boolean })[val] = false
      else recursiveSet(leaf, b => b)
    }
  }
})

export const { reset, on, off, initOn, initOff } = checkBox.actions
export default checkBox.reducer
