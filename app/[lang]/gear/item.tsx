import type { Locale } from '@/i18n-config'
import type { Item } from '@/app/master/main'
import type { CraftRecipe, Gear, GearProperty } from '@/app/master/main'
import { serverMaster, serverText } from '@/app/master/server'
import { num, rare2text } from '@/app/util'
import { localItems as skillItems } from '../skill/item'
import { localItems as turnEventItems } from '../event/turn/item'
import type { FilterItem } from '@/app/component/filter'

export async function localItems (lang: Locale) {
  const data = {
    craft_recipe: await serverMaster<CraftRecipe>(lang, 'craft_recipe'),
    gear: await serverMaster<Gear>(lang, 'gear'),
    gear_property: await serverMaster<GearProperty>(lang, 'gear_property'),
    item: await serverMaster<Item>(lang, 'item'),
    skill: await skillItems(lang),
    event: await turnEventItems(lang)
  }
  const textMap = await serverText(lang)

  function toItem (o: Gear) {
    const gp = data.gear_property.find(v => v.gear_id === o.id)
    if (gp == null) {
      throw new Error(`unable to find gear property (gear_id: ${o.id})`)
    }
    // possible empty
    const cr = data.craft_recipe.find(v => v.id === o.id)

    const name = textMap('GearText', o.gear_text_id)
    const category = 1000 + o.category * 10
    const relax = num(gp.relaxing)
    const play = num(gp.playing)
    const cook = num(gp.cooking)

    const sid = gp.camp_skill_id
    const skill = data.skill.find(s => s.uid === sid)
    if (skill == null) {
      throw new Error(`unable to find skill ${sid}`)
    }
    const eid = gp.camp_turn_event_id
    const event = data.event.find(e => e.uid === eid)
    if (event == null) {
      throw new Error(`unable to find turn event ${eid}`)
    }

    const materials = ([1, 2, 3, 4, 5, 6] as const)
      .map(slot => {
        const id = cr?.[`material${slot}`]
        const n = num(cr?.[`material${slot}_qty`])
        if (id == null || n === 0) return null
        const item = data.item.find(v => v.id === id)
        return { id, n, name: item?.name_text_id }
      })
      .filter((v): v is { id: number; n: number; name: number } => v != null)
    const requireGear = data.gear.find(
      v => v.id === cr?.material_gear_id
    )?.gear_text_id

    const filters: FilterItem['filters'] = {
      rare: [rare2text(o.rarity)],
      skillType: skill.skillEffects.map(v => v.effect_target_param.toString()),
      skillPhase: [String(skill.skillLottery.mission_phase_type)],
      skillMission: skill.skillLottery.case_mission_type_ids?.split(',') ?? [],
      relax: [relax.toString()],
      play: [play.toString()],
      cook: [cook.toString()],
      category: [o.category.toString()],
      ...event.filters
    }

    return {
      lang,
      uid: o.id,
      searchName: name,
      filters,
      tid: {
        category,
        subCategory: 1000 + o.category * 10 + o.sub_category,
        requireGear
      },
      rid: o.icon_resource_id,
      rare: o.rarity,
      skill,
      event,
      relax,
      play,
      cook,
      materials
    }
  }
  return Object.values(data.gear)
    .filter(o => o.type === 1 && o.category !== 10)
    .map(toItem)
}

export type LocalItem = Awaited<ReturnType<typeof localItems>>[number]
