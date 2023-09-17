'use client'

import { Locale } from '@/i18n-config'
import { useGears } from './data'
import { useFilters } from './filter'
import { useMyPage } from '../myTemplate'
import { columns } from './render'

export default function Gears ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  
  const filters = useFilters(lang)
  const itemO = useGears(lang)

  // console.log('data loaded?', !itemO.l)

  return useMyPage(itemO, filters, columns)
}
