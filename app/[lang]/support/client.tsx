'use client'

import type { Locale } from '@/i18n-config'
import type { LocalItem } from './item'
import { localColumns } from './render'
import MyPage from '@/app/component/table'
import { FilterMeta } from '@/app/component/filter'
import { useFuture } from '@/app/home/FutureSwitcher'

export function ClientComponent ({
  lang,
  items,
  filterMeta
}: {
  lang: Locale
  items: LocalItem[]
  filterMeta: FilterMeta
}) {
  const future = useFuture()
  if (!future) items = items.filter(o => o.open * 1000 <= Date.now())
  
  return (
    <MyPage
      lang={lang}
      items={items}
      filterMeta={filterMeta}
      columns={localColumns}
    />
  )
}
