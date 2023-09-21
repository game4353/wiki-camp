import { Accordion, AccordionItem } from '@nextui-org/react'
import { FilterItem, FilterProp } from '.'
import { useBoxFilter } from './hook'

export default function Filters<T extends FilterItem> ({
  filterProp
}: {
  filterProp: FilterProp
}) {
  const filteredData = filterProp.map(({ kits }) =>
    kits.map(kit => ({
      subtitle: kit.subtitle,
      v: kit.v,
      filterKey: kit.filterKey
    }))
  )

  // Now, call useBoxFilter once for each kit and flatten the result
  const filters: {
    s: Set<string>
    c: JSX.Element
    f: (list: T[]) => T[]
  }[][] = filteredData.map(kits =>
    kits.map(kit => useBoxFilter<T>(kit.subtitle, kit.v, kit.filterKey))
  )

  const filter = (list: T[]) =>
    filters.reduce((l, o) => o.reduce((l2, o2) => o2.f(l2), l), list)

  const component = (
    <div className='p-4 w-max min-w-[50%]'>
      <Accordion selectionMode='multiple' variant='bordered'>
        {filterProp.map((v, i) => (
          <AccordionItem startContent='．' key={i} title={v.title}>
            <div className='flex flex-col gap-2 p-2'>
              {filters[i].map(o => o.c)}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )

  return {
    f: filter,
    c: component
  }
}