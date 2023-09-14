import { Locale } from '@/i18n-config'
import { mergeMaster, useMaster, useText } from '@/app/master/main'
import type {
  CampSkill,
  CampSkillTrick,
  CampSupportEffect,
  CampTurnEvent,
  Card,
  CardCampProperty,
  Member
} from '@/app/master/main'
import { useMemo } from 'react'
import { useTurnEvents } from '../event/turn/main'
import { SkillItem, useSkillItem } from '../skill/data'
import Timestamp from '@/app/component/timestamp'
import Skill from '../skill'
import Aptitude from '@/app/component/aptitude'
import Thumbnail from '@/app/component/thumbnail'

export type CostumeItem = {
  uid: number
  icon: JSX.Element
  costume: string
  name: string
  nameC: JSX.Element
  searchName: string
  rare: number
  rareText: string
  type: number
  hot: number
  cold: number
  sport: number
  aptC: JSX.Element
  skill1?: SkillItem
  skill2?: SkillItem
  skill3?: SkillItem
  skill1C: JSX.Element
  skill2C: JSX.Element
  skill3C: JSX.Element
  event: JSX.Element
  release: JSX.Element
}

export function useCostumes (lang: Locale) {
  const { data, l, e } = mergeMaster({
    card: useMaster<Card>(lang, 'card', 'id'),
    card_camp_property: useMaster<CardCampProperty>(
      lang,
      'card_camp_property',
      'card_id'
    ),
    camp_skill: useMaster<CampSkill>(lang, 'camp_skill', 'id'),
    // camp_skill_trick: useMaster<CampSkillTrick>(lang, 'camp_skill_trick', 'id'),
    camp_support_effect: useMaster<CampSupportEffect>(
      lang,
      'camp_support_effect',
      'id'
    ),
    camp_turn_event: useMaster<CampTurnEvent>(lang, 'camp_turn_event', 'id'),
    // home_member_clothes: useMaster<HomeMemberClothes>(lang, 'home_member_clothes', 'id'),
    member: useMaster<Member>(lang, 'member', 'id'),
    skill: useSkillItem(lang),
    text: useText(lang),
    turn_events: useTurnEvents(lang)
  })
  const textMap = data.text.map

  function toItem (o: Card): CostumeItem {
    const ccp = data.card_camp_property.get?.(o.id)

    const id = o.id
    const rare = o.rarity as (1 | 2 | 3)
    const type = ccp?.camp_action_type ?? 0
    const costume = textMap('CardText', o.name_prefix_text_id)
    const name = data.member.get?.(o.member_id)?.fullname ?? ''
    const nameC = (
      <div className='col-start-2 grid grid-cols-1'>
        <span>{costume}</span>
        <span>{name}</span>
      </div>
    )
    const eid = ccp?.camp_turn_event_id_slot1
    const event = eid == null ? <p></p> : data.turn_events.d[eid]?.descC

    const sgid1 = data.card_camp_property.get?.(o.id)?.camp_skill_group_id_slot1
    const skill1 = data.skill.d.find(s => s.sgid === sgid1 && s.level === 1)
    const sgid2 = data.card_camp_property.get?.(o.id)?.camp_skill_group_id_slot2
    const skill2 = data.skill.d.find(s => s.sgid === sgid2 && s.level === 1)
    const sgid3 = data.card_camp_property.get?.(o.id)?.camp_skill_group_id_slot3
    const skill3 = data.skill.d.find(s => s.sgid === sgid3 && s.level === 1)

    const hot = ccp?.hotness ?? 0
    const cold = ccp?.coldness ?? 0
    const sport = ccp?.sporty ?? 0

    return {
      uid: id,
      icon: (
        <Thumbnail
          bg={rare}
          rid={`210${id}`}
          frame={1}
          rare={rare}
          type={type}
        />
      ),
      costume,
      name,
      nameC,
      searchName: costume + name,
      rare,
      rareText: String(rare),
      type,
      skill1,
      skill2,
      skill3,
      skill1C: <Skill lang={lang} layout='full' skill={skill1} />,
      skill2C: <Skill lang={lang} layout='full' skill={skill2} />,
      skill3C: <Skill lang={lang} layout='full' skill={skill3} />,
      event,
      hot,
      cold,
      sport,
      aptC: <Aptitude type='costume' hot={hot} cold={cold} sport={sport} />,
      release: <Timestamp unix={o.open_date} />
    }
  }

  return {
    d: useMemo<CostumeItem[]>(() => {
      return (data.card.d ?? [])
        .filter((o): o is Card => (o!.type ?? 0) === 0 && o!.open_date < 4e9)
        .map(toItem)
    }, [l]),
    l,
    e
  }
}
