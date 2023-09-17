'use client'

import { Locale } from '@/i18n-config'
import { useCostumes } from './data'
import { useFilters } from './filter'
import { useMyPage } from '../myTemplate'
import { columns } from './render'

export default function Costumes ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  return useMyPage(useCostumes(lang), useFilters(lang), columns)
}
