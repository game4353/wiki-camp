import { Locale } from '@/i18n-config'
import type {
  CampSkill,
  CampSupportEffect,
  CampTurnEvent,
  Card,
  CardCampProperty,
  Member
} from '@/app/master/main'
import { serverMaster, serverText } from '@/app/master/server'
import { num } from '@/app/util'
import { localItems as skillItems } from '../skill/item'
import { localItems as turnEventItems } from '../event/turn/item'

export async function localItems (lang: Locale) {
  const data = {
    card: await serverMaster<Card>(lang, 'card'),
    card_camp_property: await serverMaster<CardCampProperty>(
      lang,
      'card_camp_property'
    ),
    camp_skill: await serverMaster<CampSkill>(lang, 'camp_skill'),
    camp_support_effect: await serverMaster<CampSupportEffect>(
      lang,
      'camp_support_effect'
    ),
    camp_turn_event: await serverMaster<CampTurnEvent>(lang, 'camp_turn_event'),
    // home_member_clothes: await serverMaster<HomeMemberClothes>(lang, 'home_member_clothes'),
    member: await serverMaster<Member>(lang, 'member'),
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
    const rare = o.rarity as 1 | 2 | 3
    const type = num(ccp.camp_action_type)
    const costume = textMap('CardText', o.name_prefix_text_id)
    const member = data.member.find(v => v.id === o.member_id)
    if (member == null) {
      throw new Error(`unable to find member ${o.member_id}`)
    }
    const name = textMap('MemberText', member.fullname_text_id)

    const eid = ccp.camp_turn_event_id_slot1
    const event = data.event.find(e => e.uid === eid)
    if (event == null) {
      throw new Error(`unable to find turn event ${eid}`)
    }

    const sgids = ([1, 2, 3] as const).map(
      slot => ccp[`camp_skill_group_id_slot${slot}`]
    )
    const skills = sgids.map(sgid => {
      if (sgid == null) return undefined
      const skill = data.skill.find(s => s.sgid === sgid && s.level === 1)
      if (skill == null) {
        throw new Error(`unable to find skill group id ${sgid}`)
      }
      return skill
    })
    const hot = num(ccp.hotness)
    const cold = num(ccp.coldness)
    const sport = num(ccp.sporty)

    const filters: Partial<Record<string, string[]>> = {}
    filters['rare'] = [rare.toString()]
    filters['type'] = [type.toString()]
    filters['chara'] = [o.member_id.toString()]
    filters['hot'] = [hot.toString()]
    filters['cold'] = [cold.toString()]
    filters['sport'] = [sport.toString()]
    for (const i of [1, 2, 3]) {
      filters[`skillType${i}`] =
        skills[i - 1]?.skillEffects?.map(v =>
          v.effect_target_param.toString()
        ) ?? []
      filters[`skillPhase${i}`] = [
        String(skills[i - 1]?.skillLottery.mission_phase_type ?? '')
      ]
      filters[`skillMission${i}`] =
        skills[i - 1]?.skillLottery.case_mission_type_ids?.split(',') ?? []
    }

    return {
      lang,
      uid: id,
      searchName: costume + name,
      filters,
      costume,
      name,
      rid: `210${id}`,
      rare,
      type,
      skills,
      eid,
      event,
      hot,
      cold,
      sport,
      open: o.open_date
    }
  }
  return Object.values(data.card)
    .filter(o => num(o.type) === 0 && o.open_date < 4e9)
    .map(toItem)
}

export type LocalItem = Awaited<ReturnType<typeof localItems>>[number]
