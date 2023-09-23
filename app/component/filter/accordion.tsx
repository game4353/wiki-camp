'use client'

import { Accordion, AccordionItem, Selection } from '@nextui-org/react'
import type { FilterProp } from '.'
import type { Dispatch, SetStateAction } from 'react'
import { FilterBoxes as FilterBoxes2 } from './box'

export function FilterAccordion ({
  filterProp,
  accordionState
}: {
  filterProp: FilterProp
  accordionState: [Selection, Dispatch<SetStateAction<Selection>>]
}) {
  const [selectedKeys, setSelectedKeys] = accordionState

  return (
    <div className='p-4 w-max min-w-[50%]'>
      <Accordion
        selectionMode='multiple'
        variant='bordered'
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        {filterProp.map((v, i) => (
          <AccordionItem startContent='．' key={i} title={v.title}>
            <div className='flex flex-col gap-2 p-2'>
              {v.kits.map(kit => (
                <FilterBoxes2
                  boxes={kit.v}
                  label={kit.subtitle}
                  uid={kit.filterKey}
                  parentPaths={[v.title]}
                  key={kit.filterKey}
                />
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
