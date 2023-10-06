import type { Locale } from '@/i18n-config'
import { defaultOption, type FilterMeta } from '@/app/component/filter'
import { serverText } from '@/app/master/server'
import { kitApt, kitRare } from '@/app/component/filter/kits'
import { getFilterMeta as getEventFM } from '@/app/[lang]/event/turn/filter'
import { getFilterMeta as getSkillFM } from '@/app/[lang]/skill/filter'

export async function getFilterMeta (lang: Locale): Promise<FilterMeta> {
  const textMap = await serverText(lang)
  const skillFM = await getSkillFM(lang)
  const eventFM = await getEventFM(lang)

  return {
    uid: 'gear',
    cats: [
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
      ...skillFM.cats,
      ...eventFM.cats
    ]
  }
}
