import type { Locale } from '@/i18n-config'
import { type FilterProp } from '@/app/component/filter'
import { serverText } from '@/app/master/server'
import {
  kitApt,
  kitRare,
  kitSkillMission,
  kitType
} from '@/app/component/filter/kits'

export async function getFilterProps (lang: Locale): Promise<FilterProp> {
  const textMap = await serverText(lang)

  return [
    {
      title: 'General',
      kits: [
        kitRare(),
        kitType(textMap),
        kitApt(textMap, 'relax'),
        kitApt(textMap, 'play'),
        kitApt(textMap, 'cook'),
        {
          subtitle: 'Category',
          v: new Array(9).fill(0).map((_, i) => ({
            name: textMap('GearText', parseInt(`10${i + 1}0`)),
            value: (i + 1).toString()
          })),
          filterKey: 'category'
        }
      ]
    },
    {
      title: 'Skill',
      kits: [kitSkillMission(textMap), kitType(textMap, 'skillType')]
    },
    // {
    //   title: 'Event',
    //   kits: [

    //   ]
    // }
    // useFilter(
    //   'Event',
    //   new Array(5).fill(0).map((_, i) => ({
    //     name: text.map('CampText', 410001 + i),
    //     value: (i + 1).toString()
    //   })),
    //   o => o.event?.params.map(([a,b]) => a.toString()) ?? []
    // )
  ]
}
