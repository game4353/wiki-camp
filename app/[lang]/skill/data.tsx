import { Locale } from '@/i18n-config'
import Image from 'next/image'
import { mergeMaster, useMaster, useText } from '@/app/master/main'
import type {
  CampSkill,
  CampSkillEffect,
  CampSkillGroup,
  CampSkillLottery,
  CampSkillTrick
} from '@/app/master/main'
import { useMemo } from 'react'

export type SkillItem = {
  uid: number
  sgid: number
  level: number
  name: string
  groupName: string
  desc: string
  icon: JSX.Element
  force: boolean
  sp: number
  skillEffects: CampSkillEffect[]
  skillLottery?: CampSkillLottery
}

type SkillEffectItem = {
  uid: number
  type: 1
  param: 1 | 2 | 3 | 4 | 5
  calc: 1 | 2
  value: number
  desc: string
}

export function useSkillItem (lang: Locale) {
  const { data, l, e } = mergeMaster({
    camp_skill: useMaster<CampSkill>(lang, 'camp_skill', 'id'),
    camp_skill_effect: useMaster<CampSkillEffect>(
      lang,
      'camp_skill_effect',
      'id'
    ),
    camp_skill_group: useMaster<CampSkillGroup>(
      lang,
      'camp_skill_group',
      'id'
    ),
    camp_skill_lottery: useMaster<CampSkillLottery>(
      lang,
      'camp_skill_lottery',
      'id'
    ),
    camp_skill_trick: useMaster<CampSkillTrick>(lang, 'camp_skill_trick', 'id'),
    text: useText(lang)
  })
  const textMap = data.text.map

  function toItem (o: CampSkill): SkillItem {
    const sgid = o.skill_group_id
    const level = o.level
    const csg = data.camp_skill_group.get?.(sgid)
    const skillEffects = o.skill_effect_ids
      ?.split(',')
      .map(v => data.camp_skill_effect.get?.(Number(v)))
      .filter((v): v is CampSkillEffect => v != null)
    const sp = data.camp_skill_trick.d?.find(
      o =>
        o.skill_group_id === sgid &&
        o.skill_level === level &&
        o.trick_level === 1
    )?.price_skill_point

    const icon = (
      <Image
        src={`/images/assets/campskillicon/${csg?.icon_resource_id}.png`}
        alt=''
        width={112}
        height={112}
      />
    )
    
    return {
      uid: o.id,
      sgid,
      level,
      groupName: textMap('CampText', csg?.name_text_id),
      name: textMap('CampText', o.name_text_id),
      desc: textMap('CampText', o.desc_text_id),
      icon,
      force: Boolean(csg?.is_force_active),
      sp: sp ?? -1,
      skillEffects,
      skillLottery: data.camp_skill_lottery.get?.(sgid)
    }
  }

  return {
    d: useMemo<SkillItem[]>(() => {
      return (data.camp_skill.d ?? []).map(toItem)
    }, [l]),
    l,
    e
  }
}
