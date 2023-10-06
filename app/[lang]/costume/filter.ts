import { Locale } from '@/i18n-config'
import { defaultOption, type FilterMeta } from '@/app/component/filter'
import { kitApt, kitRare, kitType } from '@/app/component/filter/kits'
import { serverMaster, serverText } from '@/app/master/server'
import { getFilterMeta as getSkillFM } from '@/app/[lang]/skill/filter'
import { Member } from '@/app/master/main'

export async function getFilterMeta (lang: Locale): Promise<FilterMeta> {
  const textMap = await serverText(lang)
  const skillFM = await getSkillFM(lang)
  const member = await serverMaster<Member>(lang, 'member')

  return {
    uid: 'costume',
    cats: [
      {
        title: 'General',
        kits: [
          kitRare(undefined, true),
          kitType(textMap),
          {
            subtitle: 'chara',
            filterKey: 'chara',
            v: [1, 2, 3, 4, 5].map(v =>
              defaultOption({
                name: textMap(
                  'MemberText',
                  member.find(m => m.id === v)!.firstname_text_id
                ),
                value: v
              })
            )
          },
          kitApt(textMap, 'hot'),
          kitApt(textMap, 'cold'),
          kitApt(textMap, 'sport')
        ]
      },
      {
        ...skillFM.cats[0],
        title: 'Skill 1'
      },
      {
        ...skillFM.cats[0],
        title: 'Skill 2'
      },
      {
        ...skillFM.cats[0],
        title: 'Skill 3'
      }
    ]
  }
}
