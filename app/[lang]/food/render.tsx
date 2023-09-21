import Thumbnail from '@/app/component/thumbnail'
import type { Column } from '../main'
import type { LocalItem } from './item'

export const localColumns: Column<LocalItem>[] = [
  { name: 'ID', uid: 'uid', hide: true },
  {
    name: 'ICON',
    uid: 'icon',
    show: true,
    render (item) {
      return (
        <Thumbnail
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
    uid: 'name',
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
      return ['', 'N', 'R', 'SR'][item.rare]
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
