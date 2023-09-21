'use client'

import type { Locale } from '@/i18n-config'
import type { LocalItem } from './item'
import { localColumns } from './render'
import MyPage from '@/app/component/table'
import { FilterProp } from '@/app/component/filter'

export function ClientComponent ({
  lang,
  items,
  filterProp
}: {
  lang: Locale
  items: LocalItem[]
  filterProp: FilterProp
}) {
  return (
    <MyPage
      lang={lang}
      items={items}
      filterProp={filterProp}
      columns={localColumns}
    />
  )
}
