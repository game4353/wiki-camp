import { useSearchFilter, useFilter, FilterKit } from '../main'
import { FoodItem } from './data'

export function useFilters (): FilterKit<FoodItem>[] {
  return [
    useSearchFilter(),
    useFilter(
      'Rare',
      [
        { name: 'SR', value: '3' },
        { name: 'R', value: '2' },
        { name: 'N', value: '1' }
      ],
      o => o.rare.toString()
    ),
  ]
}
