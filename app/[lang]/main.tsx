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

type ValidColumnKey<T> = {
  [K in keyof T]: T[K] extends ReactNode
    ? K extends string
      ? K
      : never
    : never
}[keyof T]

export type Column<T> = {
  uid: ValidColumnKey<T>
  name: string
  align?: 'start' | 'center' | 'end'
  show?: boolean
  sortable?: boolean
}

type FilterOption = {
  /** name displays beside checkbox */
  name: string // TODO or component
  /** unique string for filter */
  value: string
  /** filtered out at start */
  hide?: boolean
}

export type FilterKit<T> = {
  a: string | string[]
  c: JSX.Element
  f: (list: T[]) => T[]
}

export function useFilter<T> (
  label: string,
  filterOptions: FilterOption[],
  toList: (o: T) => string | string[]
) {
  const size = filterOptions.length
  const all = filterOptions.map(o => o.value)
  const init = filterOptions.filter(o => !Boolean(o.hide)).map(o => o.value)
  const [arr, setArr] = useState(all)

  function filter (list: T[]) {
    if (arr.length !== size) {
      return list.filter(row => {
        const strs = toList(row)
        const arr2 = typeof strs === 'string' ? [strs] : strs
        return arr2.some(s => arr.includes(s))
      })
    }
    return list
  }

  const component = (
    <CheckboxGroup
      label={label}
      key={label}
      orientation='horizontal'
      color='primary'
      defaultValue={init}
      value={arr}
      onValueChange={setArr}
    >
      {filterOptions.map(o => (
        <Checkbox key={o.value} value={o.value}>
          {o.name}
        </Checkbox>
      ))}
    </CheckboxGroup>
  )

  return {
    /** the Array of filtering strings that will show */
    a: arr,
    /** the Component that shows checkboxes for filter */
    c: component,
    /** use this to Filter the original list */
    f: filter
  }
}

export function useSearchFilter () {
  const [filterValue, setFilterValue] = useState('')

  function filter<T extends { searchName: string }> (list: T[]) {
    if (!Boolean(filterValue)) return list
    return list.filter(row => row.searchName.includes(filterValue))
  }

  const onListChange = useCallback((value?: string) => {
    setFilterValue(value ?? '')
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
  }, [])

  const component = (
    <Input
      key='searchFilter'
      isClearable
      className='w-full sm:max-w-[44%]'
      placeholder='Input text here...'
      startContent={<FontAwesomeIcon icon={faMagnifyingGlass} />}
      value={filterValue}
      onClear={() => onClear()}
      onValueChange={onListChange}
    />
  )

  return {
    /** the searching string */
    a: filterValue,
    /** the Component that shows checkboxes for filter */
    c: component,
    /** use this to Filter the original list */
    f: filter
  }
}

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

export function useHeaders<T> (columns: Column<T>[]) {
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

export function str2element (str?: string) {
  return (
    <div className='flex flex-col'>
      {(str?.split('\n') ?? []).map((t, i) => (
        <div key={i}>{t}</div>
      ))}
    </div>
  )
}
