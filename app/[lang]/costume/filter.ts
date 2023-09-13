import { Locale } from '@/i18n-config'
import { useSearchFilter, useFilter, FilterKit } from '../main'
import { CostumeItem } from './data'
import { useText } from '@/app/master/main'

export function useFilters (lang: Locale): FilterKit<CostumeItem>[] {
  const text = useText(lang)
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
      [1, 2, 3].map(v => ({
        name: text.map('CampText', 420003 + v),
        value: v.toString()
      })),
      o =>
        o.skill1?.skillLottery?.case_mission_type_ids?.split(',') ?? []
    ),
    useFilter(
      'Skill2',
      [1, 2, 3].map(v => ({
        name: text.map('CampText', 420003 + v),
        value: v.toString()
      })),
      o =>
        o.skill2?.skillLottery?.case_mission_type_ids?.split(',') ?? []
    ),
    useFilter(
      'Skill3',
      [1, 2, 3].map(v => ({
        name: text.map('CampText', 420003 + v),
        value: v.toString()
      })),
      o =>
        o.skill3?.skillLottery?.case_mission_type_ids?.split(',') ?? []
    ),
    useFilter(
      'Type',
      [1, 2, 3, 4, 5].map(v => ({
        name: text.map('CampText', 410000 + v),
        value: v.toString()
      })),
      o => o.type.toString()
    ),
    useFilter(
      text.map('CampText', 420001),
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
      text.map('CampText', 420002),
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
      text.map('CampText', 420003),
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
