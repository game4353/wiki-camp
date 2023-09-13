import { Locale } from '@/i18n-config'
import { Item, mergeMaster, useMaster, useText } from '@/app/master/main'
import type {
  CampSkill,
  CampSkillTrick,
  CampTurnEvent,
  CraftRecipe,
  Gear,
  GearProperty,
} from '@/app/master/main'
import { useMemo } from 'react'
import Thumbnail from './thumbnail'
import { useTurnEvents } from '../event/turn/main'
import { SkillItem, useSkillItem } from '../skill/data'
import Aptitude from '@/app/component/aptitude'
import Skill from '../skill'

export type GearItem = {
  uid: number
  icon: JSX.Element
  name: string
  nameC: JSX.Element
  searchName: string
  rare: number
  rareText: string
  category: string
  subCategory: string
  relax: number
  play: number
  cook: number
  skill?: SkillItem
  skillC: JSX.Element
  event: JSX.Element
  aptC: JSX.Element
  recipe: JSX.Element
}

export function useGears (lang: Locale) {
  const { data, l, e } = mergeMaster({
    camp_skill: useMaster<CampSkill>(lang, 'camp_skill', 'id'),
    camp_skill_trick: useMaster<CampSkillTrick>(lang, 'camp_skill_trick', 'id'),
    camp_turn_event: useMaster<CampTurnEvent>(lang, 'camp_turn_event', 'id'),
    craft_recipe: useMaster<CraftRecipe>(lang, 'craft_recipe', 'id'),
    gear: useMaster<Gear>(lang, 'gear', 'id'),
    gear_property: useMaster<GearProperty>(lang, 'gear_property', 'gear_id'),
    item: useMaster<Item>(lang, 'item', 'id'),
    skill: useSkillItem(lang),
    text: useText(lang),
    turn_events: useTurnEvents(lang)
  })
  const textMap = data.text.map
  

  function toItem (o: Gear): GearItem {
    const gp = data.gear_property.get?.(o.id)

    const rare = o.rarity
    const icon = Thumbnail({ id: o.icon_resource_id, rare })
    const name = textMap('GearText', o.gear_text_id)
    const category = textMap('GearText',  parseInt(`10${o.category}0`))
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
    const relax = (gp?.relaxing ?? 0)
    const play = (gp?.playing ?? 0)
    const cook = (gp?.cooking ?? 0)
    const eid = gp?.camp_turn_event_id
    const event = (eid == null) ? (<p></p>) : data.turn_events.d[eid]?.descC
    const sid = gp?.camp_skill_id
    const skill = data.skill.d.find(s => s.uid === sid)

    const cr = data.craft_recipe.get?.(o.id)
    const recipe = (
      <div className='flex flex-col'>
        {([1, 2, 3, 4, 5, 6] as const).map(slot => {
          const matId = cr?.[`material${slot}`]
          const num = cr?.[`material${slot}_qty`]
          if (matId == null || Number(num) === 0) return <span key={slot}></span>
          const matTid = data.item.get?.(matId)?.name_text_id
          const text = textMap('ItemText', matTid)
          return <span key={slot}>{text}×{num}</span>
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
      skill,
      skillC:  <Skill lang={lang} layout='full' skill={skill} />,
      event,
      relax,
      play,
      cook,
      aptC: <Aptitude type='mission' relax={relax} play={play} cook={cook}/>,
      recipe,
    }
  }

  return {
    d: useMemo<GearItem[]>(() => {
      return (data.gear.d ?? [])
        .filter(o => o.type === 1 && o.category !== 10)
        .map(toItem)
    }, [l]),
    l,
    e
  }
}
