import type { FilterProp } from '@/app/component/filter'
import { kitRare } from '@/app/component/filter/kits'

export const filterProp: FilterProp = [
  {
    title: 'General',
    kits: [kitRare()]
  }
]
