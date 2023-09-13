'use client'

import { Locale } from '@/i18n-config'
import { useFoods } from './data'
import { useFilters } from './filter'
import { useMyPage } from '../myTemplate'

export default function Gears ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  return useMyPage(useFoods(lang), useFilters(), [
    { name: 'ID', uid: 'uid' },
    { name: 'ICON', uid: 'icon', show: true },
    { name: 'NAME', uid: 'nameC', show: true },
    { name: 'RARE', uid: 'rareText' },
    { name: 'RECIPE', uid: 'recipe', show: true }
  ])
}
