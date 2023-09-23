import { Locale } from '@/i18n-config'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type LanguageState = {
  value: Locale
}

const initialState = {
  value: 'ja'
} as LanguageState

export const language = createSlice({
  name: 'language',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Locale>) => {
      state.value = action.payload
    }
  }
})

export const { set } = language.actions
export default language.reducer
