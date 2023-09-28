import Aptitude from '@/app/component/aptitude'
import Thumbnail from '@/app/component/thumbnail'
import { Column } from '../main'
import Skill from '../skill'
import { LocalItem } from './item'
import TurnEvent from '../event/turn'
import { rare2text } from '@/app/util'

export const localColumns: Column<LocalItem>[] = [
  { name: 'ID', uid: 'uid', hide: true },
  {
    name: 'ICON',
    uid: 'icon',
    show: true,
    render (item) {
      return (
        <Thumbnail
          unoptimized
          bg={item.rare}
          rid={item.rid}
          frame={0}
          rare={(['n', 'r', 'sr'] as const)[item.rare - 1]}
        />
      )
    }
  },
  {
    name: 'NAME',
    uid: 'nameC',
    show: true,
    render (item, textMap) {
      const cat = textMap('GearText', item.tid.category)
      const subCat = textMap('GearText', item.tid.subCategory)
      return (
        <div className='flex flex-col'>
          <p>{item.searchName}</p>
          <p className='text-default-400'>{`${cat} > ${subCat}`}</p>
        </div>
      )
    }
  },
  {
    name: 'RARE',
    uid: 'rare',
    hide: true,
    render (item) {
      return rare2text(item.rare)
    }
  },
  {
    name: 'APT',
    uid: 'aptC',
    show: true,
    render (item) {
      return (
        <Aptitude
          type='mission'
          relax={item.relax}
          play={item.play}
          cook={item.cook}
        />
      )
    }
  },
  {
    name: 'SKILL',
    uid: 'skillC',
    show: true,
    render (item) {
      return <Skill lang={item.lang} layout='full' skill={item.skill} />
    }
  },
  {
    name: 'EVENT',
    uid: 'event',
    show: true,
    render (item) {
      return <TurnEvent lang={item.lang} layout='list' item={item.event} />
    }
  },
  {
    name: 'RECIPE',
    uid: 'recipe',
    show: true,
    render (item, textMap) {
      return (
        <div className='flex flex-col'>
          {item.tid.requireGear != null &&
            textMap('GearText', item.tid.requireGear)}
          {item.materials.map(({ id, name, n }) => (
            <p key={id}>
              {textMap('ItemText', name)} x{n}
            </p>
          ))}
        </div>
      )
    }
  }
]
