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
      o => o.skill?.skillLottery?.case_mission_type_ids?.split(',') ?? []
    ),
    useFilter(
      'Category',
      new Array(9).fill(0).map((_, i) => ({
        name: text.map('GearText', parseInt(`10${i + 1}0`)),
        value: (i + 1).toString()
      })),
      o => o.category.toString()
    ),
    useFilter(
      'Event',
      new Array(5).fill(0).map((_, i) => ({
        name: text.map('CampText', 410001 + i),
        value: (i + 1).toString()
      })),
      o => o.event?.params.map(([a,b]) => a.toString()) ?? []
    )
  ]
}
