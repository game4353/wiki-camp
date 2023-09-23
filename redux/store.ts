// https://medium.com/enjoy-life-enjoy-coding/react-%E5%8F%8A-redux-%E9%96%93%E7%9A%84%E6%97%A5%E5%B8%B8-1-%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8-215436d14430

import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlice'
import languageReducer from './features/languageSlice'
import checkBoxReducer from './features/checkBoxSlice'

export const store = configureStore({
  reducer: { checkBoxReducer, counterReducer, languageReducer },
  devTools: process.env.NODE_ENV !== 'production'
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
