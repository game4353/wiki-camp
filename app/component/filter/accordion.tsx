import { Accordion, AccordionItem } from '@nextui-org/react'
import { FilterItem, FilterProp } from '.'
import { FilterBoxes } from './hook'
import { Dispatch, SetStateAction } from 'react'

export default function FilterBlocks<T extends FilterItem> ({
  filterProp,
  list,
  filters,
  setFilters
}: {
  filterProp: FilterProp
  list: T[]
  filters: Record<string, boolean[]>
  setFilters: Dispatch<SetStateAction<Record<string, boolean[]>>>
}) {
  return (
    <div className='p-4 w-max min-w-[50%]'>
      <Accordion selectionMode='multiple' variant='bordered'>
        {filterProp.map((v, i) => (
          <AccordionItem startContent='．' key={i} title={v.title}>
            <div className='flex flex-col gap-2 p-2'>
              {v.kits.map(k => (
                <FilterBoxes
                  label={k.subtitle}
                  filterOptions={k.v}
                  filterKey={k.filterKey}
                  list={list}
                  filters={filters}
                  setFilters={setFilters}
                />
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
