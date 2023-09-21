import {
  faList,
  faFilter,
  faSquareCheck,
  faGear
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Selection
} from '@nextui-org/react'
import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react'
import { Column, ValidColumnKey, useHeaders, usePage } from './main'
import { FilterKit } from '../component/filter'

export interface ItemMore {
  uid: number | string
  searchName: string
  [key: string]: ReactNode
}

export function myTabs (
  tableComponent: JSX.Element,
  tableSize: number,
  filterComponent: JSX.Element,
  filterSize: number,
  selectedComponent: JSX.Element,
  selectedSize: number,
  settingComponent: JSX.Element
) {
  return (
    <div>
      <Tabs aria-label='Options' color='primary' variant='underlined'>
        <Tab
          key='list'
          title={
            <div className='flex items-center space-x-2'>
              <FontAwesomeIcon icon={faList} />
              <span>{`List (${tableSize})`}</span>
            </div>
          }
        >
          {tableComponent}
        </Tab>
        <Tab
          key='filter'
          title={
            <div className='flex items-center space-x-2'>
              <FontAwesomeIcon icon={faFilter} />
              <span>{`Filter (${filterSize})`}</span>
            </div>
          }
        >
          {filterComponent}
        </Tab>
        <Tab
          key='selected'
          title={
            <div className='flex items-center space-x-2'>
              <FontAwesomeIcon icon={faSquareCheck} />
              <span>{`Selected (${selectedSize})`}</span>
            </div>
          }
        >
          {selectedComponent}
        </Tab>
        <Tab
          key='settings'
          title={
            <div className='flex items-center space-x-2'>
              <FontAwesomeIcon icon={faGear} />
              <span>Settings</span>
            </div>
          }
        >
          {settingComponent}
        </Tab>
      </Tabs>
    </div>
  )
}

export function myTable<T extends { uid: number | string }> (
  pageComponent: JSX.Element,
  selectedKeys: Selection,
  setSelectedKeys: Dispatch<SetStateAction<Selection>>,
  tableHeader: JSX.Element,
  pagedItems: T[],
  columns?: Column<T>[]
) {
  
  function renderCell(item: T, key: keyof T): ReactNode {
    const render = columns?.find(o => o.uid === key)?.render
    if (render != null) return render(item)
    else {
      return item[key as ValidColumnKey<T>] as ReactNode
    }
  }

  return (
    <Table
      aria-label='Table.'
      isHeaderSticky
      bottomContent={pageComponent}
      bottomContentPlacement='outside'
      classNames={{
        wrapper: 'max-h-[calc(100vh-200px)]'
      }}
      selectedKeys={selectedKeys}
      selectionMode='multiple'
      onSelectionChange={setSelectedKeys}
    >
      {tableHeader}
      <TableBody emptyContent={'Nothing found'} items={pagedItems}>
        {item => (
          <TableRow key={item.uid}>
            {columnKey => (
              <TableCell>
                {renderCell(item, columnKey as keyof typeof item)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export function useMyPage<T extends { uid: string | number }> (
  itemO: {
    d: T[]
    l: boolean
    e: any
  },
  filters: FilterKit<T>[],
  columns: Column<T>[]
) {
  const { d: items, l, e } = itemO
  const { visibleColumns, tableHeader, selectVisibleColumn } = useHeaders(columns)

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const filteredItems = useMemo(
    () => filters.reduce((list, { f }) => f(list), items),
    [l, ...filters.map(o => o.s)]
  )
  const { pageComponent, pagedItems } = usePage(filteredItems)

  const tableComponent = myTable(
    pageComponent,
    selectedKeys,
    setSelectedKeys,
    tableHeader,
    pagedItems,
    columns
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
  }, [selectedKeys, visibleColumns, l, ...filters.map(o => o.s)])

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
