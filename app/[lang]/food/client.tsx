'use client'

import type { Locale } from '@/i18n-config'
import type { LocalItem } from './item'
import { localColumns } from './render'
import MyPage from '@/app/component/table'
import { FilterMeta } from '@/app/component/filter'

export function ClientComponent ({
  lang,
  items,
  filterMeta
}: {
  lang: Locale
  items: LocalItem[]
  filterMeta: FilterMeta
}) {
  return (
    <MyPage
      lang={lang}
      items={items}
      filterMeta={filterMeta}
      columns={localColumns}
    />
  )
}
