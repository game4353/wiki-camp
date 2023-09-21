import { Locale } from '@/i18n-config'
import { type FilterProp } from '@/app/component/filter'
import { serverMaster, serverText } from '@/app/master/server'
import { num } from '@/app/util'
import { LocalItem } from './item'
import { CampSupportEffectGroup } from '@/app/master/main'
import { kitRareEn, kitSkillMission, kitType } from '@/app/component/filter/kits'

export async function getFilterProps (lang: Locale): Promise<FilterProp> {
  const cseg = await serverMaster<CampSupportEffectGroup>(
    lang,
    'camp_support_effect_group'
  )
  const textMap = await serverText(lang)

  const arr: FilterProp[number]['kits'] = []

  Object.values(cseg).forEach(o => {
    if (o == null) return
    const i1 = o.effect_target_type
    arr[i1] = arr[i1] ?? { subtitle: '', v: [{name: '❌', value: 'NULL'}], filterKey: '' }

    const i2 = num(o.effect_target_param)
    const str = textMap('CampText', o.name_text_id)
    const strs = str.match(/(.+?)[\(（](.+)[\)）]/)
    if (strs == null) {
      arr[i1].subtitle = str
      arr[i1].v[i2+1] = { name: '⭕', value: i2.toString() }
    } else {
      arr[i1].subtitle = strs[1]
      arr[i1].v[i2+1] = { name: strs[2], value: i2.toString() }
    }
    arr[i1].filterKey = `eff${i1}`
  })

  return [
    { title: 'General', kits: [kitRareEn(), kitType(textMap)] },
    {
      title: 'Skill',
      kits: [kitSkillMission(textMap), kitType(textMap, 'skillType')]
    },
    { title: 'Effect', kits: arr }
  ]
}
