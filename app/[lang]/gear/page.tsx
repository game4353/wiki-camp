'use client'

import { Locale } from '@/i18n-config'
import { useGears } from './data'
import { useFilters } from './filter'
import { useMyPage } from '../myTemplate'

export default function Gears ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  return useMyPage(useGears(lang), useFilters(), [
    { name: 'ID', uid: 'uid' },
    { name: 'ICON', uid: 'icon', show: true },
    { name: 'NAME', uid: 'nameC', show: true },
    { name: 'RARE', uid: 'rareText' },
    { name: 'APT', uid: 'aptC', show: true },
    { name: 'SKILL', uid: 'skillC', show: true },
    { name: 'EVENT', uid: 'event', show: true },
    { name: 'RECIPE', uid: 'recipe', show: true }
  ])
}
