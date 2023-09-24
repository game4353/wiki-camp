import {
  faList,
  faFilter,
  faSquareCheck,
  faGear
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tabs, Tab } from '@nextui-org/react'

export function MyTabs ({
  tableComponent,
  tableSize,
  filterComponent,
  filterSize,
  selectedComponent,
  selectedSize,
  settingComponent
}: {
  tableComponent: JSX.Element
  tableSize: number
  filterComponent: JSX.Element
  filterSize: number
  selectedComponent: JSX.Element
  selectedSize: number
  settingComponent: JSX.Element
}) {
  return (
    <div className='min-h-full max-h-full grid grid-rows-[auto_minmax(0,1fr)]'>
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
          className='min-w-0 max-w-full'
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
