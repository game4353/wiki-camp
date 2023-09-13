'use client'

import { Locale } from '@/i18n-config'
import { useSupports, useHeaders } from './data'
import { useMyPage } from '../myTemplate'
import { useFilters } from './filter'

export default function Supports ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  return useMyPage(useSupports(lang), useFilters(), useHeaders())
}
