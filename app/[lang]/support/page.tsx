'use client'

import { Locale } from '@/i18n-config'
import { useSupports } from './data'
import { useMyPage } from '../myTemplate'
import { useFilters } from './filter'

export default function Supports ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  return useMyPage(useSupports(lang), useFilters(lang), [
    { name: 'ID', uid: 'uid' },
    { name: 'ICON', uid: 'icon', show: true },
    { name: 'NAME', uid: 'name', show: true },
    { name: 'RARE', uid: 'rareText' },
    { name: 'SKILL', uid: 'skillC', show: true },
    { name: 'SUPPORT', uid: 'support', show: true },
    { name: 'EVENT', uid: 'event', show: true },
    { name: 'TYPE', uid: 'type' }
  ])
}
