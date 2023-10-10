import { type Column, useHeaders } from '@/app/[lang]/main'
import { useState, useMemo } from 'react'
import type { FilterMeta, FilterItem } from '../filter'
import { MyTabs } from './tab'
import { MyTable } from './table'
import type { Locale } from '@/i18n-config'
import type { Selection } from '@nextui-org/react'
import { FilterAccordion } from '../filter/accordion'
import { useFiltered } from '../filter/hook'
import WIP from '@/app/template/wip'

export default function MyPage<
  T extends { uid: string | number } & FilterItem
> ({
  lang,
  items,
  filterMeta,
  columns
}: {
  lang: Locale
  items: T[]
  filterMeta: FilterMeta
  columns: Column<T>[]
}) {
  const { visibleColumns, tableHeader, selectVisibleColumn } =
    useHeaders(columns)
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const accordionState = useState<Selection>(new Set([]))
  const filteredItems = useFiltered(items, filterMeta)
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
    <FilterAccordion filterMeta={filterMeta} accordionState={accordionState} />
  )
  const filterSize = filteredItems.length
  const selectedComponent = <WIP/>
  const selectedSize = selectedKeys === 'all' ? items.length : selectedKeys.size
  const settingComponent = useMemo(() => {
    return <div className='flex flex-col gap-4'>{selectVisibleColumn}</div>
  }, [selectedKeys, visibleColumns, selectVisibleColumn])

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
