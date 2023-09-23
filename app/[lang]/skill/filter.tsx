import type { Locale } from '@/i18n-config'
import {
  defaultOption,
  FilterMode,
  type FilterProp
} from '@/app/component/filter'
import { serverMaster, serverText } from '@/app/master/server'
import type {
  CampCampingArea,
  CampLocation,
  CampTemperature,
  Member
} from '@/app/master/main'
import { kitSkillMission, kitType } from '@/app/component/filter/kits'

export async function getFilterProps (lang: Locale): Promise<FilterProp> {
  const temp = await serverMaster<CampTemperature>(lang, 'camp_temperature')
  const area = await serverMaster<CampCampingArea>(lang, 'camp_camping_area')
  const location = await serverMaster<CampLocation>(lang, 'camp_location')
  const member = await serverMaster<Member>(lang, 'member')
  const textMap = await serverText(lang)
  return [
    {
      title: 'Skill',
      kits: [
        kitSkillMission(textMap),
        kitType(textMap),
        {
          subtitle: 'skill pt',
          filterKey: 'sp',
          v: [
            defaultOption({
              name: '< 40',
              value: 40,
              mode: FilterMode.LESS
            }),
            ...[4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(v =>
              defaultOption({
                name: `${v}x`,
                value: [v * 10, v * 10 + 9],
                mode: FilterMode.BETWEEN
              })
            ),
            defaultOption({
              name: '140+',
              value: 139,
              mode: FilterMode.GTR
            })
          ]
        },
        {
          subtitle: 'phase',
          v: [1, 2, 3].map(v =>
            defaultOption({
              name: textMap('CampText', 50000 + v),
              value: v
            })
          ),
          filterKey: 'phase'
        },
        {
          subtitle: 'leader',
          filterKey: 'leader',
          v: [
            defaultOption({
              name: '❌',
              value: 0
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
          subtitle: 'area',
          filterKey: 'area',
          v: [
            defaultOption({
              name: '❌',
              value: 0
            }),
            ...area.map(o =>
              defaultOption({
                name: textMap('CampText', o.name_text_id),
                value: o.id
              })
            )
          ]
        },
        {
          subtitle: 'location',
          filterKey: 'location',
          v: [
            defaultOption({
              name: '❌',
              value: 0
            }),
            ...location.map(o =>
              defaultOption({
                name: textMap('CampText', o.name_text_id),
                value: o.id
              })
            )
          ]
        },
        {
          subtitle: 'season',
          filterKey: 'season',
          v: [
            defaultOption({
              name: '❌',
              value: 0
            }),
            defaultOption({
              name: 'spring',
              value: 1
            }),
            defaultOption({
              name: 'summer',
              value: 2
            }),
            defaultOption({
              name: 'fall',
              value: 3
            }),
            defaultOption({
              name: 'winter',
              value: 4
            })
          ]
        },
        {
          subtitle: 'temperature',
          v: temp.map(o =>
            defaultOption({
              name: textMap('CampText', o.name_text_id),
              value: o.id,
              mode: FilterMode.ENCLOSE
            })
          ),
          filterKey: 'temperature'
        }
      ]
    }
  ]
}
