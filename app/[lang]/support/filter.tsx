import { Locale } from '@/i18n-config'
import {
  defaultOption,
  FilterMode,
  type FilterMeta,
  type FilterKit
} from '@/app/component/filter'
import { serverMaster, serverText } from '@/app/master/server'
import { num } from '@/app/util'
import { CampSupportEffectGroup } from '@/app/master/main'
import { kitRare, kitType } from '@/app/component/filter/kits'
import { getFilterMeta as getEventFM } from '@/app/[lang]/event/turn/filter'
import { getFilterMeta as getSkillFM } from '@/app/[lang]/skill/filter'

export async function getFilterMeta (lang: Locale): Promise<FilterMeta> {
  const cseg = await serverMaster<CampSupportEffectGroup>(
    lang,
    'camp_support_effect_group'
  )
  const textMap = await serverText(lang)
  const skillFM = await getSkillFM(lang)
  const eventFM = await getEventFM(lang)

  const arr: FilterKit[] = []

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

  return {
    uid: 'support',
    cats: [
      { title: 'General', kits: [kitRare(), kitType(textMap)] },
      ...skillFM.cats,
      { title: 'Effect', kits: arr },
      ...eventFM.cats
    ]
  }
}
