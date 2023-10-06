'use client'

import { Accordion, AccordionItem, Divider, Selection } from '@nextui-org/react'
import type { FilterMeta } from '.'
import type { Dispatch, SetStateAction } from 'react'
import { FilterBoxes } from './box'

export function FilterAccordion ({
  filterMeta,
  accordionState
}: {
  filterMeta: FilterMeta
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
        {filterMeta.cats.map((v, i) => (
          <AccordionItem startContent='．' key={i} title={v.title}>
            <div className='flex flex-col gap-2 p-2'>
              {v.kits.map(kit => (
                <>
                <Divider className='w-[80%] self-center'/>
                  <FilterBoxes
                    boxes={kit.v}
                    label={kit.subtitle}
                    uid={kit.filterKey}
                    parentPaths={[filterMeta.uid, v.title]}
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
