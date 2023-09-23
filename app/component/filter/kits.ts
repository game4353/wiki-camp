import { TextMap } from '@/app/master/text'
import { map8score } from '@/app/util'
import { defaultOption } from '.'

export const kitRare = (textMap?: TextMap, star?: boolean) => ({
  subtitle: 'Rare',
  v: (Boolean(star) ? ['★★★', '★★', '★'] : ['SR', 'R', 'N']).map((v, i) =>
    defaultOption({ name: v, value: 3 - i })
  ),
  filterKey: 'rare'
})

const Apt6 = ['hot', 'cold', 'sport', 'relax', 'play', 'cook'] as const

export const kitApt = (
  textMap: TextMap,
  aptType: typeof Apt6[number],
  filterKey?: string
) => ({
  subtitle: textMap('CampText', 420001 + Apt6.indexOf(aptType)),
  v: new Array(8).fill(0).map((_, i) =>
    defaultOption({
      name: map8score(8 - i),
      value: 8 - i
    })
  ),
  filterKey: filterKey ?? aptType
})

export const kitType = (textMap: TextMap, filterKey?: string) => ({
  subtitle: 'Type',
  v: [1, 2, 3, 4, 5].map(v =>
    defaultOption({
      name: textMap('CampText', 410000 + v),
      value: v
    })
  ),
  filterKey: filterKey ?? 'type'
})

export const kitSkillMission = (textMap: TextMap, filterKey?: string) => ({
  subtitle: 'Mission',
  v: [1, 2, 3].map(v =>
    defaultOption({
      name: textMap('CampText', 420003 + v),
      value: v
    })
  ),
  filterKey: filterKey ?? 'mission'
})
