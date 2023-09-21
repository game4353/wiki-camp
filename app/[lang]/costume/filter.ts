import { Locale } from '@/i18n-config'
import { type FilterProp } from '@/app/component/filter'
import { kitApt, kitRare, kitSkillMission, kitType } from '@/app/component/filter/kits'
import { serverText } from '@/app/master/server'

export async function getFilterProps (lang: Locale): Promise<FilterProp> {
  const textMap = await serverText(lang)

  return [
    { 
      title: 'General', 
      kits: [
        kitRare(), 
        kitType(textMap),
        kitApt(textMap, 'hot'),
        kitApt(textMap, 'cold'),
        kitApt(textMap, 'sport'),
      ] 
    },
    {
      title: 'Skill 1',
      kits: [
        kitSkillMission(textMap, 'skillMission1'),
        kitType(textMap, 'skillType1')
      ]
    },
    {
      title: 'Skill 2',
      kits: [
        kitSkillMission(textMap, 'skillMission2'),
        kitType(textMap, 'skillType2')
      ]
    },
    {
      title: 'Skill 3',
      kits: [
        kitSkillMission(textMap, 'skillMission3'),
        kitType(textMap, 'skillType3')
      ]
    }
  ]
}
