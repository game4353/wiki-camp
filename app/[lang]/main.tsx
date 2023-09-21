import { Locale } from '@/i18n-config'
import {
  faChevronDown,
  faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  CheckboxGroup,
  Checkbox,
  Pagination,
  TableColumn,
  TableHeader,
  Selection,
  Input,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import type { TextMap } from '../master/text'

export type ValidColumnKey<T> = {
  [K in keyof T]: T[K] extends ReactNode
    ? K extends string
      ? K
      : never
    : never
}[keyof T]

export type Column<T> = {
  uid: string
  name: string
  align?: 'start' | 'center' | 'end'
  show?: boolean
  hide?: boolean
  sortable?: boolean
} & (
  | {
      render: (item: T, textMap: TextMap) => ReactNode
    }
  | {
      uid: ValidColumnKey<T>
      render?: undefined
    }
)


export function usePage<T> (filteredItems: T[]) {
  const rowSize = filteredItems.length
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const pages = Math.ceil(rowSize / rowsPerPage)

  if (page > pages && pages > 0) setPage(pages)

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value))
      setPage(1)
    },
    []
  )

  const pagedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const pageComponent = useMemo(() => {
    return (
      <div className='py-2 px-2 grid grid-cols-3 justify-between items-center'>
        <span className='text-small text-default-400'>
          {/* {`${rowSize} results`} */}
        </span>
        <Pagination
          className='justify-self-center'
          isCompact
          showControls
          showShadow
          color='primary'
          page={page}
          total={pages}
          onChange={setPage}
        />
        <label className='flex items-center text-default-400 text-small justify-self-end'>
          Rows per page:
          <select
            className='bg-transparent outline-none text-default-400 text-small'
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
          >
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='15'>15</option>
            <option value='30'>30</option>
            <option value='50'>50</option>
          </select>
        </label>
      </div>
    )
  }, [rowSize, page, pages])

  return {
    pageComponent,
    pagedItems
  }
}

export function useHeaders<T> (columns: Column<T>[] | Column<T>[]) {
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(columns.filter(o => o.show).map(o => o.uid))
  )
  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter(column =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const tableHeader = (
    <TableHeader columns={headerColumns}>
      {column => (
        <TableColumn
          key={column.uid}
          align={column.align ?? 'start'}
          allowsSorting={column.sortable}
        >
          {column.name}
        </TableColumn>
      )}
    </TableHeader>
  )

  const selectVisibleColumn = (
    <Dropdown>
      <DropdownTrigger className='hidden sm:flex'>
        <Button
          endContent={<FontAwesomeIcon icon={faChevronDown} />}
          variant='flat'
        >
          Columns
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label='select visible column dropdown'
        closeOnSelect={false}
        selectedKeys={visibleColumns}
        selectionMode='multiple'
        onSelectionChange={setVisibleColumns}
      >
        {columns.map(column => (
          <DropdownItem key={column.uid}>{column.name}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )

  return {
    visibleColumns,
    tableHeader,
    selectVisibleColumn
  }
}

export function i18n (lang: Locale, text: string) {
  // TODO dummy function
  return text
}
