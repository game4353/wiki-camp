import { Locale } from '@/i18n-config'
import { mergeMaster, useMaster, useText } from '@/app/master/main'
import type {
  CampSkill,
  CampSupportEffect,
  CampTurnEvent,
  Card,
  CardCampProperty
} from '@/app/master/main'
import { useMemo } from 'react'
import { useTurnEventItem } from '../event/turn/main'
import { SkillItem, useSkillItem } from '../skill/data'
import Skill from '../skill'
import Timestamp from '@/app/component/timestamp'
import Thumbnail from '@/app/component/thumbnail'

export type SupportItem = {
  uid: number
  icon: JSX.Element
  name: string
  searchName: string
  rare: number
  rareText: string
  type: number
  skill?: SkillItem
  skillC: JSX.Element
  support: JSX.Element
  event: JSX.Element
  release: JSX.Element
}

export function useLocalItem (lang: Locale) {
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
    skill: useSkillItem(lang),
    text: useText(lang),
    event: useTurnEventItem(lang)
  })
  const textMap = data.text.map
  const cses = data.camp_support_effect.d

  function toItem (o: Card) {
    const ccp = data.card_camp_property.get?.(o.id)

    const id = o.id
    const rare = o.rarity
    const type = ccp?.camp_action_type ?? 0
    const name = textMap('CardText', o.name_prefix_text_id)
    const support = (
      <div className='flex flex-col'>
        {([1, 2, 3, 4, 5, 6] as const).map(slot => {
          const sgid1 = ccp?.[`camp_support_effect_group_id_slot${slot}`]
          const stid1 = cses?.find(
            v => v?.support_effect_group_id === sgid1 && v?.level === 1
          )?.name_text_id
          const text =
            stid1 == null ? '' : textMap('CampText', stid1).replace(' Lv1', '')
          return <span key={slot}>{text}</span>
        })}
      </div>
    )
    const sgid = data.card_camp_property.get?.(o.id)?.camp_skill_group_id_slot1
    const skill = data.skill.d.find(s => s.sgid === sgid && s.level === 1)
    const eid = ccp?.camp_turn_event_id_slot1
    const event = data.event.d.find(e => e.uid === eid)

    return {
      uid: id,
      lang,
      icon: (
        <Thumbnail
          rid={`220${id}`}
          frame={1}
          rare={(['n', 'r', 'sr'] as const)[rare - 1]}
          type={type}
        />
      ),
      name,
      searchName: name,
      rare,
      rareText: ['', 'N', 'R', 'SR'][rare],
      type,
      skill,
      skillC: <Skill lang={lang} layout='full' skill={skill} />,
      support,
      event,
      release: <Timestamp unix={o.open_date} />
    }
  }

  return {
    d: useMemo<ReturnType<typeof toItem>[]>(() => {
      return (data.card.d ?? [])
        .filter((o): o is Card => o!.type === 14 && o!.open_date < 4e9)
        .map(toItem)
    }, [l]),
    l,
    e
  }
}

export type LocalItem = ReturnType<typeof useLocalItem>['d'][number]