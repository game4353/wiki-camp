import { Locale } from '@/i18n-config'
import { Item, mergeMaster, useMasterNew, useText } from '@/app/master/main'
import type { CraftRecipe, Gear, GearProperty } from '@/app/master/main'
import { useMemo } from 'react'
import { useSkillItem } from '../skill/data'
import { useTurnEventItem } from '../event/turn/main'

export function useGears (lang: Locale) {
  const { data, l, e } = mergeMaster({
    craft_recipe: useMasterNew<CraftRecipe>(lang, 'craft_recipe', 'id'),
    gear: useMasterNew<Gear>(lang, 'gear', 'id'),
    gear_property: useMasterNew<GearProperty>(lang, 'gear_property', 'gear_id'),
    item: useMasterNew<Item>(lang, 'item', 'id'),
    event: useTurnEventItem(lang),
    skill: useSkillItem(lang),
    text: useText(lang)
  })
  const textMap = data.text.map

  function toItem (o: Gear) {
    const gp = data.gear_property.get?.(o.id)

    const rare = o.rarity
    const name = textMap('GearText', o.gear_text_id)
    const category = o.category
    const categoryS = textMap('GearText', parseInt(`10${category}0`))
    const subCategoryS = textMap(
      'GearText',
      parseInt(`10${o.category}${o.sub_category}`)
    )

    const sid = gp?.camp_skill_id
    const skill = data.skill.d.find(s => s.uid === sid)

    const eid = gp?.camp_turn_event_id
    const event = data.event.d.find(e => e.uid === eid)

    const cr = data.craft_recipe.get?.(o.id)
    const recipe = (
      <div className='flex flex-col'>
        {([1, 2, 3, 4, 5, 6] as const).map(slot => {
          const matId = cr?.[`material${slot}`]
          const num = cr?.[`material${slot}_qty`]
          if (matId == null || Number(num) === 0)
            return <span key={slot}></span>
          const matTid = data.item.get?.(matId)?.name_text_id
          const text = textMap('ItemText', matTid)
          return (
            <span key={slot}>
              {text}×{num}
            </span>
          )
        })}
      </div>
    )

    return {
      uid: o.id,
      rid: o.icon_resource_id,
      name,
      lang,
      searchName: name,
      rare,
      rareText: String(rare),
      category,
      categoryS,
      subCategoryS,
      skill,
      event,
      relax: gp?.relaxing ?? 0,
      play: gp?.playing ?? 0,
      cook: gp?.cooking ?? 0,
      recipe
    }
  }

  return {
    d: useMemo<ReturnType<typeof toItem>[]>(() => {
      return data.gear
        .get('all')
        .filter(o => o.type === 1 && o.category !== 10)
        .map(toItem)
    }, [l]),
    l,
    e
  }
}

export type GearItem = ReturnType<typeof useGears>['d'][number]
