import { Locale } from '@/i18n-config'
import { useSearchFilter, useFilter, FilterKit } from '../main'
import { GearItem } from './data'
import { useText } from '@/app/master/main'

export function useFilters (lang: Locale): FilterKit<GearItem>[] {
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
      'Skill',
      [1, 2, 3].map(v => ({
        name: text.map('CampText', 420003 + v),
        value: v.toString()
      })),
      o =>
      o.skill?.skillLottery?.case_mission_type_ids?.split(',') ?? []
    ),
    // useFilter(
    //   'Type',
    //   [
    //     { name: 'つながり', value: '1' },
    //     { name: 'まんぞく', value: '2' },
    //     { name: 'いごこち', value: '3' },
    //     { name: 'ぬくもり', value: '4' },
    //     { name: 'いやし', value: '5' }
    //   ],
    //   o => o.type.toString()
    // )
  ]
}
