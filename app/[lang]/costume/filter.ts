import { useSearchFilter, useFilter, FilterKit } from '../main'
import { CostumeItem } from './data'

export function useFilters (): FilterKit<CostumeItem>[] {
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
      'Skill1',
      [
        { name: 'Relax', value: '1' },
        { name: 'Play', value: '2' },
        { name: 'Cook', value: '3' }
      ],
      o =>
        o.skill1?.skillLottery?.case_mission_type_ids?.split(',') ?? []
    ),
    useFilter(
      'Skill2',
      [
        { name: 'Relax', value: '1' },
        { name: 'Play', value: '2' },
        { name: 'Cook', value: '3' }
      ],
      o =>
        o.skill2?.skillLottery?.case_mission_type_ids?.split(',') ?? []
    ),
    useFilter(
      'Skill3',
      [
        { name: 'Relax', value: '1' },
        { name: 'Play', value: '2' },
        { name: 'Cook', value: '3' }
      ],
      o =>
        o.skill3?.skillLottery?.case_mission_type_ids?.split(',') ?? []
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
    useFilter(
      'Hot',
      [
        { name: 'S', value: '8' },
        { name: 'A', value: '7' },
        { name: 'B', value: '6' },
        { name: 'C', value: '5' },
        { name: 'D', value: '4' },
        { name: 'E', value: '3' },
        { name: 'F', value: '2' },
        { name: 'G', value: '1' }
      ],
      o => o.hot.toString()
    ),
    useFilter(
      'Cold',
      [
        { name: 'S', value: '8' },
        { name: 'A', value: '7' },
        { name: 'B', value: '6' },
        { name: 'C', value: '5' },
        { name: 'D', value: '4' },
        { name: 'E', value: '3' },
        { name: 'F', value: '2' },
        { name: 'G', value: '1' }
      ],
      o => o.cold.toString()
    ),
    useFilter(
      'Sport',
      [
        { name: 'S', value: '8' },
        { name: 'A', value: '7' },
        { name: 'B', value: '6' },
        { name: 'C', value: '5' },
        { name: 'D', value: '4' },
        { name: 'E', value: '3' },
        { name: 'F', value: '2' },
        { name: 'G', value: '1' }
      ],
      o => o.sport.toString()
    ),
    
  ]
}
