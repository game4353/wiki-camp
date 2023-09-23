import { type Column, useHeaders } from '@/app/[lang]/main'
import { useState, useMemo } from 'react'
import type { FilterProp, FilterItem } from '../filter'
import { MyTabs } from './tab'
import { MyTable } from './table'
import type { Locale } from '@/i18n-config'
import type { Selection } from '@nextui-org/react'
import { FilterAccordion } from '../filter/accordion'
import { useFiltered } from '../filter/hook'

export default function MyPage<
  T extends { uid: string | number } & FilterItem
> ({
  lang,
  items,
  filterProp,
  columns
}: {
  lang: Locale
  items: T[]
  filterProp: FilterProp
  columns: Column<T>[]
}) {
  const { visibleColumns, tableHeader, selectVisibleColumn } =
    useHeaders(columns)
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const accordionState = useState<Selection>(new Set([]))
  const filteredItems = useFiltered(items, filterProp)
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
  const filterComponent = (
    <FilterAccordion filterProp={filterProp} accordionState={accordionState} />
  )
  const filterSize = filteredItems.length
  const selectedComponent = <div>TBD</div>
  const selectedSize = selectedKeys === 'all' ? items.length : selectedKeys.size
  const settingComponent = useMemo(() => {
    return <div className='flex flex-col gap-4'>{selectVisibleColumn}</div>
  }, [selectedKeys, visibleColumns])

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
