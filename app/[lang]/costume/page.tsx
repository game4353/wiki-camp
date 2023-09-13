'use client'

import { Locale } from '@/i18n-config'
import { useCostumes } from './data'
import { useFilters } from './filter'
import { useMyPage } from '../myTemplate'

export default function Costumes ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  return useMyPage(useCostumes(lang), useFilters(lang), [
    { name: 'ID', uid: 'uid' },
    { name: 'ICON', uid: 'icon', show: true },
    { name: 'NAME', uid: 'nameC', show: true },
    { name: 'APT', uid: 'aptC', show: true },
    { name: 'SKILL1', uid: 'skill1C', show: true },
    { name: 'SKILL2', uid: 'skill2C', show: true },
    { name: 'SKILL3', uid: 'skill3C', show: true },
    { name: 'EVENT', uid: 'event', show: true },
    { name: 'RELEASE', uid: 'release', show: true }
  ])
}
