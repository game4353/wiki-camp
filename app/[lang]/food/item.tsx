import { FilterItem } from '@/app/component/filter'
import { CraftRecipe, Gear, Item } from '@/app/master/main'
import { serverMaster, serverText } from '@/app/master/server'
import { num } from '@/app/util'
import { Locale } from '@/i18n-config'

export async function localItems (lang: Locale) {
  const data = {
    cr: await serverMaster<CraftRecipe>(lang, 'craft_recipe'),
    gear: await serverMaster<Gear>(lang, 'gear'),
    item: await serverMaster<Item>(lang, 'item')
  }
  const textMap = await serverText(lang)

  function toItem (o: Gear) {
    const name = textMap('GearText', o.gear_text_id)

    const cr = data.cr.find(v => v.id === o.id)

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
      General: {
        rare: o.rarity,
        category: o.category
      }
    }

    return {
      uid: o.id,
      searchName: name,
      filters,
      tid: {
        category: 1000 + o.category * 10,
        subCategory: 1000 + o.category * 10 + o.sub_category,
        requireGear
      },
      rid: o.icon_resource_id,
      rare: o.rarity,
      materials
    }
  }

  return Object.values(data.gear)
    .filter(o => o.type === 2)
    .map(toItem)
}

export type LocalItem = Awaited<ReturnType<typeof localItems>>[number]
