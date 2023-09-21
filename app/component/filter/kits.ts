import { TextMap } from '@/app/master/text'
import { map8score } from '@/app/util'

export const kitRare = (textMap?: TextMap, filterKey?: string) => ({
  subtitle: 'Rare',
  v: [
    { name: 'SR', value: '3' },
    { name: 'R', value: '2' },
    { name: 'N', value: '1' }
  ],
  filterKey: filterKey ?? 'rare'
})

export const kitRareEn = (textMap?: TextMap, filterKey?: string) => ({
  subtitle: 'Rare',
  v: [
    { name: 'SR', value: 'SR' },
    { name: 'R', value: 'R' },
    { name: 'N', value: 'N' }
  ],
  filterKey: filterKey ?? 'rare'
})

const Apt6 = ['hot', 'cold', 'sport', 'relax', 'play', 'cook'] as const

export const kitApt = (
  textMap: TextMap,
  aptType: typeof Apt6[number],
  filterKey?: string
) => ({
  subtitle: textMap('CampText', 420001 + Apt6.indexOf(aptType)),
  v: new Array(8).fill(0).map((_, i) => ({
    name: map8score(8 - i),
    value: (8 - i).toString()
  })),
  filterKey: filterKey ?? aptType
})

export const kitType = (textMap: TextMap, filterKey?: string) => ({
  subtitle: 'Type',
  v: [1, 2, 3, 4, 5].map(v => ({
    name: textMap('CampText', 410000 + v),
    value: v.toString()
  })),
  filterKey: filterKey ?? 'type'
})

export const kitSkillMission = (textMap: TextMap, filterKey?: string) => ({
  subtitle: 'Mission',
  v: [1, 2, 3].map(v => ({
    name: textMap('CampText', 420003 + v),
    value: v.toString()
  })),
  filterKey: filterKey ?? 'skillMission'
})
