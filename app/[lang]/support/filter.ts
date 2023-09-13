import { useSearchFilter, useFilter, FilterKit } from '../main'
import { SupportItem } from './data'

export function useFilters (): FilterKit<SupportItem>[] {
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
    useFilter(
      'Skill',
      [
        { name: 'Relax', value: '1' },
        { name: 'Play', value: '2' },
        { name: 'Cook', value: '3' }
      ],
      o =>
        o.skill?.skillLottery?.case_mission_type_ids?.split(',') ?? []
    ),
    useFilter(
      'Type',
      [
        { name: 'つながり', value: '1' },
        { name: 'まんぞく', value: '2' },
        { name: 'いごこち', value: '3' },
        { name: 'ぬくもり', value: '4' },
        { name: 'いやし', value: '5' }
      ],
      o => o.type.toString()
    ),
    
  ]
}
