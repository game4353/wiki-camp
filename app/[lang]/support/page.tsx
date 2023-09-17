'use client'

import { Locale } from '@/i18n-config'
import { useLocalItem } from './data'
import { useMyPage } from '../myTemplate'
import { useFilters } from './filter'
import { localColumns } from './render'

export default function Supports ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  return useMyPage(useLocalItem(lang), useFilters(lang), localColumns)
}
