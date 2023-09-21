import { type Column, useHeaders } from '@/app/[lang]/main'
import { useState, useMemo } from 'react'
import type { FilterItem, FilterKit, FilterProp } from '../filter'
import { MyTabs } from './tab'
import { MyTable } from './table'
import type { Locale } from '@/i18n-config'
import type { Selection } from '@nextui-org/react'
import Filters from '../filter/accordion'

export default function MyPage<T extends { uid: string | number } & FilterItem> ({
  lang,
  items,
  // filters,
  filterProp,
  columns
}: {
  lang: Locale
  items: T[]
  // filters: FilterKit<T>[]
  filterProp: FilterProp
  columns: Column<T>[]
}) {
  const { visibleColumns, tableHeader, selectVisibleColumn } =
    useHeaders(columns)
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

  // const filteredItems = useMemo(
  //   () => filters.reduce((list, { f }) => f(list), items),
  //   [...filters.map(o => o.s)]
  // )
  const filters = Filters<T>({filterProp})
  const filteredItems = useMemo(
    () => filters.f(items),
    [filters.f]
  )
  const sortedItems = filteredItems

  const tableComponent = (
    <MyTable
      lang={lang}
      selectedKeys={selectedKeys}
      setSelectedKeys={setSelectedKeys}
      tableHeader={tableHeader}
      items={sortedItems}
      columns={columns}
    />
  )

  const tableSize = items.length
  // const filterComponent = (
  //   <div className='flex flex-col gap-2 p-2'>{filters.map(o => o.c)}</div>
  // )
  const filterComponent = filters.c
  const filterSize = filteredItems.length
  const selectedComponent = <div>TBD</div>
  const selectedSize = selectedKeys === 'all' ? items.length : selectedKeys.size
  const settingComponent = useMemo(() => {
    return <div className='flex flex-col gap-4'>{selectVisibleColumn}</div>
  }, [selectedKeys, visibleColumns, /*...filters.map(o => o.s)*/ filters.f])

  return (
    <MyTabs
      tableComponent={tableComponent}
      tableSize={tableSize}
      filterComponent={filterComponent}
      filterSize={filterSize}
      selectedComponent={selectedComponent}
      selectedSize={selectedSize}
      settingComponent={settingComponent}
    />
  )
}
