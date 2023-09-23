import type { Locale } from '@/i18n-config'
import { defaultOption, type FilterProp } from '@/app/component/filter'
import { serverText } from '@/app/master/server'
import { kitApt, kitRare } from '@/app/component/filter/kits'
import { getFilterProps as getEventFP } from '@/app/[lang]/event/turn/filter'
import { getFilterProps as getSkillFP } from '@/app/[lang]/skill/filter'

export async function getFilterProps (lang: Locale): Promise<FilterProp> {
  const textMap = await serverText(lang)

  return [
    {
      title: 'General',
      kits: [
        kitRare(),
        kitApt(textMap, 'relax'),
        kitApt(textMap, 'play'),
        kitApt(textMap, 'cook'),
        {
          subtitle: 'Category',
          v: new Array(9).fill(0).map((_, i) =>
            defaultOption({
              name: textMap('GearText', parseInt(`10${i + 1}0`)),
              value: i + 1
            })
          ),
          filterKey: 'category'
        }
      ]
    },
    ...(await getSkillFP(lang)),
    ...(await getEventFP(lang))
  ]
}
