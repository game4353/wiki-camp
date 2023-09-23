import {
  CampSkill,
  CampSupportEffect,
  CampSupportEffectGroup,
  CampTurnEvent,
  Card,
  CardCampProperty
} from '@/app/master/main'
import { Locale } from '@/i18n-config'
import { num } from '@/app/util'
import { serverMaster, serverText } from '@/app/master/server'
import { localItems as skillItems } from '../skill/item'
import { localItems as turnEventItems } from '../event/turn/item'
import type { FilterItem } from '@/app/component/filter'

export async function localItems (lang: Locale) {
  const data = {
    card: await serverMaster<Card>(lang, 'card'),
    card_camp_property: await serverMaster<CardCampProperty>(
      lang,
      'card_camp_property'
    ),
    camp_skill: await serverMaster<CampSkill>(lang, 'camp_skill'),
    // camp_skill_trick: await serverMaster<CampSkillTrick>(lang, 'camp_skill_trick', 'id'),
    camp_support_effect: await serverMaster<CampSupportEffect>(
      lang,
      'camp_support_effect'
    ),
    camp_support_effect_group: await serverMaster<CampSupportEffectGroup>(
      lang,
      'camp_support_effect_group'
    ),
    camp_turn_event: await serverMaster<CampTurnEvent>(lang, 'camp_turn_event'),
    skill: await skillItems(lang),
    event: await turnEventItems(lang)
  }
  const textMap = await serverText(lang)

  function toItem (o: Card) {
    const id = o.id
    const ccp = data.card_camp_property.find(v => v.card_id === id)
    if (ccp == null) {
      throw new Error(`unable to find card camp property (card_id: ${id})`)
    }
    const rare = o.rarity
    const type = num(ccp.camp_action_type)
    const name = textMap('CardText', o.name_prefix_text_id)
    /** skill effect group ids */
    const ses = ([1, 2, 3, 4, 5, 6] as const)
      .map(slot => ccp[`camp_support_effect_group_id_slot${slot}`])
      .map(id => data.camp_support_effect_group.find(v => v.id === id))
      .filter((v): v is CampSupportEffectGroup => v != null)
    const sgid = ccp.camp_skill_group_id_slot1
    const skill = data.skill.find(s => s.sgid === sgid && s.level === 1)
    if (skill == null) {
      throw new Error(`unable to find skill group id ${sgid}`)
    }
    const eid = ccp.camp_turn_event_id_slot1
    const event = data.event.find(e => e.uid === eid)
    if (event == null) {
      throw new Error(`unable to find turn event ${eid}`)
    }

    const filters: FilterItem['filters'] = {
      General: {
        rare,
        type
      },
      Skill: skill.filters,
      Event: event.filters
    }
    const filterSet: Record<string, Set<number>> = {}
    ses.forEach(se => {
      const k = `eff${se.effect_target_type}`
      filterSet[k] = filterSet[k] ?? new Set()
      filterSet[k].add(num(se.effect_target_param))
    })
    filters['Effect'] = Object.fromEntries(
      Object.entries(filterSet).map(([k, v]) => [k, [...v]])
    )

    return {
      lang,
      uid: id,
      searchName: name,
      filters,
      rid: `220${id}`,
      rare,
      type,
      skill,
      ses,
      event,
      open: o.open_date
    }
  }
  return Object.values(data.card)
    .filter(o => o.type === 14 && o.open_date < 4e9)
    .map(toItem)
}

export type LocalItem = Awaited<ReturnType<typeof localItems>>[number]
