import { Locale } from '@/i18n-config'
import type {
  CampSkill,
  CampSkillEffect,
  CampSkillGroup,
  CampSkillLottery,
  CampSkillTrick
} from '@/app/master/main'
import { serverMaster, serverText } from '@/app/master/server'

export async function localItems (lang: Locale) {
  const data = {
    camp_skill: await serverMaster<CampSkill>(lang, 'camp_skill'),
    camp_skill_effect: await serverMaster<CampSkillEffect>(
      lang,
      'camp_skill_effect'
    ),
    camp_skill_group: await serverMaster<CampSkillGroup>(
      lang,
      'camp_skill_group'
    ),
    camp_skill_lottery: await serverMaster<CampSkillLottery>(
      lang,
      'camp_skill_lottery'
    ),
    camp_skill_trick: await serverMaster<CampSkillTrick>(
      lang,
      'camp_skill_trick'
    )
  }
  const textMap = await serverText(lang)

  function toItem (o: CampSkill) {
    const sgid = o.skill_group_id
    const level = o.level
    const csg = data.camp_skill_group.find(v => v.id === sgid)
    if (csg == null) {
      throw new Error(`unable to find camp skill group ${sgid}`)
    }
    const skillEffects = o.skill_effect_ids
      ?.split(',')
      .map(id => data.camp_skill_effect.find(v => v.id === Number(id)))
      .filter((v): v is CampSkillEffect => v != null)
    const cst = data.camp_skill_trick.find(
      o =>
        o.skill_group_id === sgid &&
        o.skill_level === level &&
        o.trick_level === 1
    )
    if (cst == null) {
      throw new Error(
        `unable to find camp skill trick (skill group id: ${sgid})`
      )
    }
    const sp = cst.price_skill_point
    const sl = data.camp_skill_lottery.find(v => v.skill_group_id === sgid)
    if (sl == null) {
      throw new Error(`unable to find camp skill lottery ${sgid}`)
    }

    return {
      uid: o.id,
      sgid,
      level,
      tid: {
        groupName: csg.name_text_id,
        desc: o.desc_text_id,
        name: o.name_text_id
      },
      rid: csg.icon_resource_id,
      force: Boolean(csg.is_force_active),
      sp,
      skillEffects,
      skillLottery: sl
    }
  }

  return Object.values(data.camp_skill).map(toItem)
}

export type LocalItem = Awaited<ReturnType<typeof localItems>>[number]
