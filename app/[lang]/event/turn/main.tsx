import {
  CampCondition,
  CampFriendship,
  CampTurnEvent,
  Member,
  mergeMaster,
  useMaster,
  useText
} from '@/app/master/main'
import { signed } from '@/app/util'
import { Locale } from '@/i18n-config'
import { useMemo } from 'react'

type CampTurnEventMore = {
  desc: string
  descC: JSX.Element
}

function i18n (lang: Locale, text: string) {
  // TODO dummy function
  return text
}

export function useTurnEvents (lang: Locale) {
  const { data, l, e } = mergeMaster({
    camp_condition: useMaster<CampCondition>(lang, 'camp_condition', 'id'),
    camp_friendship: useMaster<CampFriendship>(lang, 'camp_friendship', 'id'),
    camp_turn_event: useMaster<CampTurnEvent>(lang, 'camp_turn_event', 'id'),
    member: useMaster<Member>(lang, 'member', 'id'),
    text: useText(lang)
  })
  const textMap = data.text.map

  function describe (lang: Locale, obj: CampTurnEvent) {
    const arr = []
    ;(
      [
        'relationship',
        'satisfaction',
        'comfortableness',
        'warmth',
        'healing'
      ] as const
    ).forEach((v, i) => {
      if (Boolean(obj[v]))
        arr.push(textMap('CampText', 410001 + i) + signed(obj[v]))
    })
    if (Boolean(obj.motivation)) {
      arr.push(i18n(lang, 'やる気') + signed(obj.motivation))
    }
    if (Boolean(obj.skill_pt)) {
      arr.push('SP' + signed(obj.skill_pt))
    }
    if (Boolean(obj.health)) {
      arr.push(i18n(lang, '体力') + signed(obj.health))
    }
    if (Boolean(obj.condition_id)) {
      const cid = obj.condition_id!
      const cond = data.camp_condition.get?.(cid)?.name_text_id
      arr.push(textMap('CampText', cond))
    }
    if (Boolean(obj.camp_friendship_group_id)) {
      const fid = obj.camp_friendship_group_id!
      ;(data.camp_friendship.d ?? [])
        .filter(o => o.group_id === fid)
        .forEach(o => {
          const cid = o.chara_id ?? 0
          const c =
            cid === 0 ? i18n(lang, '全員') : data.member.get?.(cid)?.firstname
          const fp = o.friendship_point
          arr.push(`${c}${i18n(lang, 'のなかよし')}${signed(fp)}`)
        })
    }
    return arr.join('\n')
  }

  const d = useMemo<Record<number, CampTurnEventMore>>(
    () =>
      Object.fromEntries(
        (data.camp_turn_event.d ?? []).map(obj => {
          const desc = describe(lang, obj)
          return [
            obj.id,
            {
              desc,
              descC: (
                <div className='flex flex-col'>
                  {desc.split('\n').map((t, i) => (
                    <div key={i}>{t}</div>
                  ))}
                </div>
              )
            }
          ]
        })
      ),
    [lang, l]
  )

  return { d, l, e }
}
