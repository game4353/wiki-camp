import type { CampFriendship, CampTurnEvent } from '@/app/master/main'
import type { Locale } from '@/i18n-config'
import { STATS, num } from '@/app/util'
import { serverMaster } from '@/app/master/server'
import type { FilterItem } from '@/app/component/filter'

import { cache } from 'react'
import 'server-only'
 
export const preload = (lang: Locale) => {
  void getItems(lang)
}
 
export const getItems = cache(localItems)

export async function localItems (lang: Locale) {
  const data = {
    camp_friendship: await serverMaster<CampFriendship>(
      lang,
      'camp_friendship'
    ),
    camp_turn_event: await serverMaster<CampTurnEvent>(lang, 'camp_turn_event')
  }

  function toItem (o: CampTurnEvent) {
    const params: number[][] = []
    STATS.forEach((v, i) => {
      if (num(o[v]) !== 0) params.push([i + 1, o[v]!])
    })
    const friendship = Object.values(data.camp_friendship)
      .filter(v => v.group_id === o.camp_friendship_group_id)
      .map(v => [num(v.chara_id), v.friendship_point])

    const filters: FilterItem['filters'] = {
      skillPt: num(o.skill_pt),
      condition: num(o.condition_id),
      motivation: num(o.motivation),
      friendship: friendship.map(([c]) => c)
    }
    STATS.forEach(v => (filters[v] = num(o[v])))

    return {
      uid: o.id,
      filters,
      name: o.name_text_id,
      type: o.event_type,
      repeat: Boolean(o.is_repetable),
      params,
      motivation: o.motivation,
      sp: o.skill_pt,
      condition: o.condition_id,
      friendship,
      health: o.health,
      skill: o.receive_trick_camp_skill_group_id,
      priority: o.priority,
      weight: o.weight
    }
  }
  return Object.values(data.camp_turn_event).map(toItem)
}

export type LocalItem = Awaited<ReturnType<typeof localItems>>[number]
