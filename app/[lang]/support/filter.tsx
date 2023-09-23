import { Locale } from '@/i18n-config'
import {
  defaultOption,
  FilterMode,
  type FilterProp
} from '@/app/component/filter'
import { serverMaster, serverText } from '@/app/master/server'
import { num } from '@/app/util'
import { CampSupportEffectGroup } from '@/app/master/main'
import { kitRare, kitType } from '@/app/component/filter/kits'
import { getFilterProps as getEventFP } from '@/app/[lang]/event/turn/filter'
import { getFilterProps as getSkillFP } from '@/app/[lang]/skill/filter'

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
    arr[i1] = arr[i1] ?? {
      subtitle: '',
      v: [defaultOption({ name: '❌', value: 0, mode: FilterMode.EMPTY })],
      filterKey: ''
    }

    const i2 = num(o.effect_target_param)
    const str = textMap('CampText', o.name_text_id)
    const strs = str.match(/(.+?)[\(（](.+)[\)）]/)
    if (strs == null) {
      arr[i1].subtitle = str
      arr[i1].v[i2 + 1] = defaultOption({
        name: '⭕',
        value: i2,
        mode: FilterMode.HAS
      })
    } else {
      arr[i1].subtitle = strs[1]
      arr[i1].v[i2 + 1] = defaultOption({
        name: strs[2],
        value: i2,
        mode: FilterMode.HAS
      })
    }
    arr[i1].filterKey = `eff${i1}`
  })

  return [
    { title: 'General', kits: [kitRare(), kitType(textMap)] },
    ...(await getSkillFP(lang)),
    { title: 'Effect', kits: arr },
    ...(await getEventFP(lang))
  ]
}
