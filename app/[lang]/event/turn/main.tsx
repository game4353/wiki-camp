import {
  CampCondition,
  CampFriendship,
  CampTurnEvent,
  Member,
  mergeMaster,
  useMasterNew,
  useText
} from '@/app/master/main'
import { Locale } from '@/i18n-config'
import { useMemo } from 'react'


export function useTurnEventItem (lang: Locale) {
  const { data, l, e } = mergeMaster({
    camp_friendship: useMasterNew<CampFriendship>(lang, 'camp_friendship', 'id'),
    camp_turn_event: useMasterNew<CampTurnEvent>(lang, 'camp_turn_event', 'id'),
  })

  function toItem(o: CampTurnEvent) {
    const params = []
    if (o.relationship != null) params.push([1, o.relationship])
    if (o.satisfaction != null) params.push([2, o.satisfaction])
    if (o.comfortableness != null) params.push([3, o.comfortableness])
    if (o.warmth != null) params.push([4, o.warmth])
    if (o.healing != null) params.push([5, o.healing])
    
    const friendship = data.camp_friendship.get('all')
      .filter(v => v.group_id === o.camp_friendship_group_id)
      .map(v => [Number(v.chara_id), v.friendship_point])

    return {
      uid: o.id,
      params,
      motivation: o.motivation,
      sp: o.skill_pt,
      condition: o.condition_id,
      friendship,
      health: o.health
    }
  }

  return {
    d: useMemo<ReturnType<typeof toItem>[]>(() => {
      return (data.camp_turn_event.get('all'))
        .map(i => toItem(i))
    }, [l]),
    l,
    e
  }
}

export type CampTurnEventItem = ReturnType<typeof useTurnEventItem>['d'][number]
