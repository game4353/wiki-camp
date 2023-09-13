'use client'

import { Selection } from '@nextui-org/react'
import { Locale } from '@/i18n-config'
import { useFoods, useHeaders } from './data'
import { useMemo, useState } from 'react'
import { usePage } from '../main'
import { myTable, myTabs } from '../myTemplate'
import { useFilters } from './filter'

export default function Gears ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  const { d: items, l, e } = useFoods(lang)
  const filters = useFilters()
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const { visibleColumns, tableHeader, selectVisibleColumn } = useHeaders()
  const filteredItems = useMemo(
    () => filters.reduce((list, { f }) => f(list), items),
    [l, ...filters.map(o => o.a)]
  )
  const { pageComponent, pagedItems } = usePage(filteredItems)

  const tableComponent = myTable(
    pageComponent,
    selectedKeys,
    setSelectedKeys,
    tableHeader,
    pagedItems
  )
  const tableSize = items.length
  const filterComponent = (
    <div className='flex flex-col gap-2 p-2'>{filters.map(o => o.c)}</div>
  )
  const filterSize = filteredItems.length
  const selectedComponent = <div>TBD</div>
  const selectedSize = selectedKeys === 'all' ? items.length : selectedKeys.size
  const settingComponent = useMemo(() => {
    return <div className='flex flex-col gap-4'>{selectVisibleColumn}</div>
  }, [selectedKeys, visibleColumns, l, ...filters.map(o => o.a)])

  if (e) return <div>{'Some error happens :('}</div>
  if (l) return <div>Loading...</div>
  return myTabs(
    tableComponent,
    tableSize,
    filterComponent,
    filterSize,
    selectedComponent,
    selectedSize,
    settingComponent
  )
}
