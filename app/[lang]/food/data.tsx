import { Locale } from '@/i18n-config'
import { Item, mergeMaster, useMaster, useText } from '@/app/master/main'
import type {
  CraftRecipe,
  Gear,
} from '@/app/master/main'
import { useMemo } from 'react'
import Thumbnail from './thumbnail'
import { useHeaders as useHeaders2 } from '../main'

export type FoodItem = {
  uid: number
  icon: JSX.Element
  name: string
  nameC: JSX.Element
  searchName: string
  rare: number
  rareText: string
  category: string
  subCategory: string
  recipe: JSX.Element
}

export function useFoods (lang: Locale) {
  const { data, l, e } = mergeMaster({
    craft_recipe: useMaster<CraftRecipe>(lang, 'craft_recipe', 'id'),
    gear: useMaster<Gear>(lang, 'gear', 'id'),
    item: useMaster<Item>(lang, 'item', 'id'),
    text: useText(lang)
  })
  const textMap = data.text.map

  function toItem (o: Gear): FoodItem {
    const rare = o.rarity
    const icon = Thumbnail({ id: o.icon_resource_id, rare })
    const name = textMap('GearText', o.gear_text_id)
    const category = textMap('GearText', parseInt(`10${o.category}0`))
    const subCategory = textMap(
      'GearText',
      parseInt(`10${o.category}${o.sub_category}`)
    )
    const nameC = (
      <div className='flex flex-col'>
        <p>{name}</p>
        <p className='text-default-400'>{`${category} > ${subCategory}`}</p>
      </div>
    )

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
      icon,
      name,
      nameC,
      searchName: name,
      rare,
      rareText: String(rare),
      category,
      subCategory,
      recipe
    }
  }

  return {
    d: useMemo<FoodItem[]>(() => {
      return (data.gear.d ?? []).filter(o => o.type === 2).map(toItem)
    }, [l]),
    l,
    e
  }
}

export function useHeaders () {
  return useHeaders2<FoodItem>([
    { name: 'ID', uid: 'uid' },
    { name: 'ICON', uid: 'icon', show: true },
    { name: 'NAME', uid: 'nameC', show: true },
    { name: 'RARE', uid: 'rareText' },
    { name: 'RECIPE', uid: 'recipe', show: true }
  ])
}
