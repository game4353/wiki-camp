'use client'

import {
  mergeMaster,
  useMasterNew,
  CampCondition,
  CampFriendship,
  CampTurnEvent,
  Member,
  useText
} from '@/app/master/main'
import { signed } from '@/app/util'
import { Locale } from '@/i18n-config'
import { LocalItem } from './item'
import { useMemo } from 'react'
import { i18n } from '../../main'
import Skill from '../../skill'

export default function TurnEvent ({
  lang,
  layout,
  item
}: {
  lang: Locale
  layout: 'list' | 'full'
  item?: LocalItem
}) {
  const { data, l, e } = mergeMaster({
    camp_condition: useMasterNew<CampCondition>(lang, 'camp_condition', 'id'),
    camp_friendship: useMasterNew<CampFriendship>(
      lang,
      'camp_friendship',
      'id'
    ),
    camp_turn_event: useMasterNew<CampTurnEvent>(lang, 'camp_turn_event', 'id'),
    member: useMasterNew<Member>(lang, 'member', 'id'),
    text: useText(lang)
  })
  const textMap = data.text.map

  if (item == null) return <div />

  const arr = []
  arr.push(
    ...item.params.map(([i, v]) => textMap('CampText', 410000 + i) + signed(v))
  )
  if (Boolean(item.motivation)) {
    arr.push(i18n(lang, 'やる気') + signed(item.motivation))
  }
  if (Boolean(item.sp)) {
    arr.push(i18n(lang, 'SP') + signed(item.sp))
  }
  if (Boolean(item.health)) {
    arr.push(i18n(lang, '体力') + signed(item.health))
  }
  if (Boolean(item.condition)) {
    const cond = data.camp_condition.get(item.condition)?.name_text_id
    arr.push(textMap('CampText', cond))
  }
  arr.push(
    ...item.friendship.map(([i, v]) => {
      let chara = i18n(lang, '全員')
      if (i > 0)
        chara = textMap('MemberText', data.member.get(i)?.firstname_text_id)
      return `${chara}${i18n(lang, 'のなかよし')}${signed(v)}`
    })
  )

  const event = (
    <div className='flex flex-col'>
      {arr.map((v, i) => (
        <span key={i}>{v}</span>
      ))}
    </div>
  )
  const name = textMap('CampText', item.name)

  if (layout === 'list') return event
  if (layout === 'full')
    return (
      <div className='grid grid-cols-9'>
        <div>{item.uid}</div>
        <div>{item.type}</div>
        <div>{name}</div>
        <div>{item.skill}</div>
        <div>{event}</div>
        <div>{item.priority}</div>
        <div>{item.weight}</div>
        <div>{item.repeat ? 'O' : 'X'}</div>
      </div>
    )
  return
}
