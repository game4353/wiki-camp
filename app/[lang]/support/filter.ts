import { Locale } from '@/i18n-config'
import { useSearchFilter, useFilter, FilterKit } from '../main'
import { LocalItem } from './data'
import { useText } from '@/app/master/main'

export function useFilters (lang: Locale): FilterKit<LocalItem>[] {
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
      o => o.skill?.skillLottery?.case_mission_type_ids?.split(',') ?? []
    ),
    useFilter(
      'Type',
      [1, 2, 3, 4, 5].map(v => ({
        name: text.map('CampText', 410000 + v),
        value: v.toString()
      })),
      o => o.type.toString()
    )
  ]
}
