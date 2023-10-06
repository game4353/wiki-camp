import type { Locale } from '@/i18n-config'
import {
  defaultOption,
  FilterMode,
  type FilterMeta
} from '@/app/component/filter'
import { serverMaster, serverText } from '@/app/master/server'
import { STATS } from '@/app/util'
import type { CampCondition, Member } from '@/app/master/main'

const options = [
  defaultOption({
    name: '< 0',
    value: 0,
    mode: FilterMode.LESS
  }),
  defaultOption({
    name: '0',
    value: 0
  }),
  defaultOption({
    name: '1 ~ 5',
    value: [1, 5],
    mode: FilterMode.BETWEEN
  }),
  defaultOption({
    name: '6 ~ 15',
    value: [6, 15],
    mode: FilterMode.BETWEEN
  }),
  defaultOption({
    name: '16 ~ 20',
    value: [16, 20],
    mode: FilterMode.BETWEEN
  }),
  defaultOption({
    name: '21 ~ 25',
    value: [21, 25],
    mode: FilterMode.BETWEEN
  }),
  defaultOption({
    name: '> 25',
    value: 25,
    mode: FilterMode.GTR
  })
]

export async function getFilterMeta (lang: Locale): Promise<FilterMeta> {
  const condition = await serverMaster<CampCondition>(lang, 'camp_condition')
  const member = await serverMaster<Member>(lang, 'member')
  const textMap = await serverText(lang)
  return {
    uid: 'event/turn',
    cats: [
      {
        title: 'Event',
        kits: [
          ...STATS.map((v, i) => ({
            subtitle: textMap('CampText', 410001 + i),
            v: options,
            filterKey: v
          })),
          {
            subtitle: 'skill PT',
            v: options,
            filterKey: 'skillPt'
          },
          {
            subtitle: 'motivation',
            v: [
              defaultOption({
                name: '－',
                value: 0,
                mode: FilterMode.LESS
              }),
              defaultOption({
                name: '0',
                value: 0
              }),
              defaultOption({
                name: '＋',
                value: 0,
                mode: FilterMode.GTR
              })
            ],
            filterKey: 'motivation'
          },
          {
            subtitle: 'friendship',
            filterKey: 'friendship',
            v: [
              defaultOption({
                name: '❌',
                value: 0,
                mode: FilterMode.SIZE
              }),
              ...[1, 2, 3, 4, 5].map(v =>
                defaultOption({
                  name: textMap(
                    'MemberText',
                    member.find(m => m.id === v)!.firstname_text_id
                  ),
                  value: v
                })
              )
            ]
          },
          {
            subtitle: 'condition',
            filterKey: 'condition',
            v: [
              defaultOption({
                name: '❌',
                value: 0
              }),
              defaultOption({
                name: '⭕',
                value: 0,
                mode: FilterMode.GTR
              })
              // ...condition.map(v => defaultOption({
              //   name: textMap('CampText', v.name_text_id),
              //   value: v.id
              // }))
            ]
          }
        ]
      }
    ]
  }
}
