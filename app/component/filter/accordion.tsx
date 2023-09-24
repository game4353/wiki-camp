'use client'

import { Accordion, AccordionItem, Divider, Selection } from '@nextui-org/react'
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
    <div className='p-4 w-max min-w-[75%] max-w-full min-h-0 max-h-full overflow-auto'>
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
                <>
                <Divider className='w-[80%] self-center'/>
                  <FilterBoxes2
                    boxes={kit.v}
                    label={kit.subtitle}
                    uid={kit.filterKey}
                    parentPaths={[v.title]}
                    key={kit.filterKey}
                  />
                </>
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
