'use client'

import type { Locale } from '@/i18n-config'
import type { LocalItem } from './item'
import { localColumns } from './render'
import MyPage from '@/app/component/table'
import { FilterProp } from '@/app/component/filter'
import { useFuture } from '@/app/home/FutureSwitcher'

export function ClientComponent ({
  lang,
  items,
  filterProp
}: {
  lang: Locale
  items: LocalItem[]
  filterProp: FilterProp
}) {
  const future = useFuture()
  if (!future) items = items.filter(o => o.open * 1000 <= Date.now())

  return (
    <MyPage<LocalItem>
      lang={lang}
      items={items}
      filterProp={filterProp}
      columns={localColumns}
    />
  )
}
