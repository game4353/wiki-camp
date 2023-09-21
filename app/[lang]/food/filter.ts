import type { FilterProp } from '@/app/component/filter'

export const filterProp: FilterProp = [
  {
    title: 'General',
    kits: [
      {
        subtitle: 'Rare',
        v: [
          { name: 'SR', value: 'SR' },
          { name: 'R', value: 'R' },
          { name: 'N', value: 'N' }
        ],
        filterKey: 'rare'
      }
    ]
  }
]
