import useSWRImmutable from 'swr/immutable'
import { fetcher, isEmpty } from '../util'
import { Locale } from '@/i18n-config'
import { useMemo } from 'react'

function textMap (this: any, cat: string, id?: number) {
  const nil = '�'
  if (id == null) return nil
  const text = this?.[cat]?.map?.[id]
  if (typeof text !== 'string') return nil
  return text
}

export function useText (lang: Locale) {
  const o = useSWRImmutable(`/${lang}/api/text`, fetcher)
  return {
    map: textMap.bind(o.data),
    l: o.isLoading,
    e: o.error
  }
}

/** this key has to map to a number */
type ValidKey<T> = {
  [K in keyof T]: T[K] extends number ? K : never
}[keyof T]

const CACHE: Record<string, (x: number | undefined) => any> = {}

export function useMaster<T> (
  lang: Locale,
  database: string,
  idKey: ValidKey<T>
) {
  const { data, error, isLoading } = useSWRImmutable(
    `/${lang}/api/${database}`,
    fetcher
  )

  const key = `${lang}-${database}`
  if (CACHE[key] == null && data != null) {
    const dict = Object.fromEntries(data.map((o: T) => [o[idKey], o]))
    CACHE[key] = (id?: number) => (id == null ? id : dict[id])
  }

  return {
    get: CACHE[key] as ((x: number | undefined) => T | undefined) | undefined,
    d: data as T[] | undefined,
    l: isLoading,
    e: error
  }
}

interface FromSWR {
  e: any
  l: boolean
}

export function mergeError (...objs: FromSWR[]) {
  return objs.reduce((e, o) => e ?? o.e, null)
}

export function mergeLoading (...objs: FromSWR[]) {
  if (mergeError(...objs) != null) return false
  return objs.some(o => o.l)
}

export function mergeMaster<T extends Partial<Record<string, FromSWR>>> (
  data: T
) {
  const objs = Object.values(data).filter((v): v is FromSWR => v != null)
  const e = mergeError(...objs)
  const l = mergeLoading(...objs)
  return { data, e, l }
}

export type CampCondition = {
  id: number
  name_text_id: number
  condition_type?: number
  target_type?: number
  effect_ratio?: number
  display_type?: number
  require_season?: number
}
export type CampFriendship = {
  id: number
  group_id: number
  target: number
  chara_id?: number
  friendship_point: number
}
export type CampSkill = {
  id: number
  skill_group_id: number
  level: number
  name_text_id: number
  desc_text_id: number
  skill_effect_ids: string
}
export type CampSkillEffect = {
  id: number
  effect_target_type: number
  effect_target_param: number
  effect_calc_type: number
  effect_value: number
}
export type CampSkillGroup = {
  id: number
  skill_trick_event_id: number
  rarity: number
  icon_resource_id: number
  name_text_id: number
  is_force_active?: number
  special_costume_card_id?: number
  special_effect_motion_id?: string
}
export type CampSkillLottery = {
  id: number
  skill_group_id: number
  mission_phase_type: number
  is_repetable?: number
  case_leader_member?: number
  case_sub_member?: number
  case_join_member?: number
  case_member_num_greater_equal?: number
  case_member_num_less_equal?: number
  case_camp_action_type_member?: number
  case_camp_action_type?: number
  case_friendship_point_member?: number
  case_friendship_point_greater_equal?: number
  case_health_greater_equal?: number
  case_health_less_equal?: number
  case_motivation_greater_equal?: number
  case_motivation_less_equal?: number
  case_condition?: number
  case_camping_area?: number
  case_month?: number
  case_season?: number
  case_weather?: number
  case_wind?: number
  case_chance_of_rain_greater_equal?: number
  case_chance_of_rain_less_equal?: number
  case_temperature_greater_equal?: number
  case_temperature_less_equal?: number
  case_location?: number
  case_keyword1?: number
  case_keyword2?: number
  case_keyword3?: number
  case_costume_id?: number
  case_support_card_id?: number
  case_gear_id?: number
  case_mission_type_ids?: string
}
export type CampSkillTrick = {
  id: number
  name_text_id: number
  skill_group_id: number
  skill_level: number
  trick_level: number
  price_skill_point: number
}
export type CampSupportEffect = {
  id: number
  support_effect_group_id: number
  level: number
  name_text_id: number
  desc_text_id: number
  effect_value: number
}
export type CampSupportEffectGroup = {
  id: number
  rarity: number
  icon_resource_id: number
  name_text_id: number
  effect_target_type: number
  effect_target_param?: number
  case_event_flag_id?: number
}
export type CampTurnEvent = {
  id: number
  name_text_id: number
  icon_resource_id: number
  /** 10=nothing 2=costume 3=support? 5=gear? 6=fasion 8=special 9=? */
  event_type: number
  story_id?: number
  is_repetable?: 1
  motivation?: number
  condition_id?: number
  relationship?: number
  satisfaction?: number
  comfortableness?: number
  warmth?: number
  healing?: number
  skill_pt?: number
  health?: number
  receive_trick_camp_skill_group_id?: number
  receive_trick_camp_skill_level?: number
  receive_camp_skill_trick_level?: number
  camp_friendship_group_id?: number
  support_effect_flag_ids?: string
  priority: number
  weight: number
  order: number
}
export type CampTurnEventLottery = {
  id: number
  turn_event_id: number
  camp_mission_id?: number
  start_trun?: number
  end_turn: number
  case_support_card_id?: number
  case_costume_id?: number
  case_gear_id?: number
  case_meal_id?: number
  case_target_level?: number
  case_target_rank?: number
  case_mission_id?: number
  case_mission_rank?: number
  case_after_timeline_id?: number
  case_pre_turn_event_id?: number
  case_camp_id?: number
  case_camping_area_id?: number
  case_motivation?: number
  case_condition_id?: number
  case_season?: number
  case_weather?: number
  case_wind?: number
  case_temperature?: number
  case_location?: number
  case_keyword?: number
  case_invalid_turn_event_ids?: string
}

export type Card = {
  id: number
  member_id: number
  costume_id: number
  clothes_id: number
  // ...
  name_prefix_text_id: number
  // ...
  rarity: number
  max_level_id: number
  type?: number
  // ...
  card_content_id: number
  // ...
  limitbreak_id: number
  limitbreak_target_ids: string
  level_growth_id: number
  // ...
  book_growth_reward_group_id: number
  duplicate_reward_id: number
  description: string
  description_text_id: number
  // ...
  open_date: number
  // ...
  exchange_start_date: number
  // ...
}
export type CardCampLevelGrowth = {
  id: number
  group_id: number
  level: number
  relationship?: number
  satisfaction?: number
  comfortableness?: number
  warmth?: number
  healing?: number
  hotness?: number
  coldness?: number
  sporty?: number
  relaxing?: number
  playing?: number
  cooking?: number
  camp_skill_level_slot1?: number
  camp_skill_level_slot2?: number
  camp_support_effect_level_slot1?: number
  camp_support_effect_level_slot2?: number
  camp_support_effect_level_slot3?: number
  camp_support_effect_level_slot4?: number
  camp_support_effect_level_slot5?: number
}
export type CardCampProperty = {
  card_id: number
  camp_action_type: number
  relationship?: number
  satisfaction?: number
  comfortableness?: number
  warmth?: number
  healing?: number
  hotness?: number
  coldness?: number
  sporty?: number
  relaxing?: number
  playing?: number
  cooking?: number
  camp_skill_group_id_slot1: number
  camp_skill_level_slot1: number
  camp_skill_group_id_slot2?: number
  camp_skill_level_slot2?: number
  camp_skill_group_id_slot3?: number
  camp_skill_level_slot3?: number
  camp_support_effect_group_id_slot1?: number
  camp_support_effect_level_slot1?: number
  camp_support_effect_group_id_slot2?: number
  camp_support_effect_level_slot2?: number
  camp_support_effect_group_id_slot3?: number
  camp_support_effect_level_slot3?: number
  camp_support_effect_group_id_slot4?: number
  camp_support_effect_level_slot4?: number
  camp_support_effect_group_id_slot5?: number
  camp_support_effect_level_slot5?: number
  camp_support_effect_group_id_slot6?: number
  camp_support_effect_level_slot6?: number
  camp_turn_event_id_slot1: number
  camp_turn_event_id_slot2?: number
  camp_turn_event_id_slot3?: number
  level_growth_group_id: number
  rank_growth_group_id: number
}
export type CraftRecipe = {
  id: number
  type: number
  name_text_id: number
  attachment_id: number
  target_id: number
  another_target_id?: number
  resource: number
  material1: number
  material1_qty: number
  material2?: number
  material2_qty?: number
  material3?: number
  material3_qty?: number
  material4?: number
  material4_qty?: number
  material5?: number
  material5_qty?: number
  material6?: number
  material6_qty?: number
  material_gear_id?: number
  max_attachment_reward_id: number
  icon_resource_id: number
}
export type CraftSkill = {
  id: number
  group_id: number
  camp_skill_id: number
  weight: number
}
export type Gear = {
  id: number
  type: number
  rarity: number
  gear_text_id: number
  description_text_id: number
  size: number
  layout_size: number
  color: number
  category: number
  sub_category: number
  layout_category: number
  layout_sub_category: number
  // ...
  cost: number
  // ...
  prefab_name: number
  icon_resource_id: number
  // ...
  book_growth_reward_group_id: number
}
export type GearProperty = {
  gear_id: number
  // ...
  relaxing: number
  playing: number
  cooking: number
  camp_skill_id: number
  camp_turn_event_id: number
  forbidden_type_id?: number
  group_camp_passive_skill_id: number
  guild_camp_theme1: number
  // ...
}
export type Member = {
  id: number
  lastname: string
  lastname_text_id: number
  firstname: string
  firstname_text_id: number
  fullname: string
  fullname_text_id: number
  // ...
}
export type Item = {
  id: number
  sort_id: number
  name_text_id: number
  description_text_id: number
  type: number
  // ...
  resource_id: number
  // ...
}