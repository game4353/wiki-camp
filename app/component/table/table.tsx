import { type Column, usePage } from '@/app/[lang]/main'
import type { Locale } from '@/i18n-config'
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Selection
} from '@nextui-org/react'
import type { Dispatch, SetStateAction } from 'react'
import { MyCell } from './cell'

export function MyTable<T extends { uid: number | string }> ({
  lang,
  selectedKeys,
  setSelectedKeys,
  tableHeader,
  items,
  columns
}: {
  lang: Locale
  selectedKeys: Selection
  setSelectedKeys: Dispatch<SetStateAction<Selection>>
  tableHeader: JSX.Element
  items: T[]
  columns: Column<T>[]
}) {
  const { pageComponent, pagedItems } = usePage(items)

  return (
    <Table
      aria-label='Table.'
      isHeaderSticky
      bottomContent={pageComponent}
      bottomContentPlacement='outside'
      classNames={{
        base: 'min-h-0 max-h-full w-min-full w-fit',
        wrapper: 'min-h-0 max-h-full'
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
                <MyCell
                  lang={lang}
                  item={item}
                  columnKey={columnKey as keyof typeof item}
                  columns={columns}
                />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
