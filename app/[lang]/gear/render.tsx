import Aptitude from '@/app/component/aptitude'
import Thumbnail from '@/app/component/thumbnail'
import { Column } from '../main'
import Skill from '../skill'
import { GearItem } from './data'
import TurnEvent from '../event/turn'

export const columns: Column<GearItem>[] = [
  { name: 'ID', uid: 'uid' },
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
    uid: 'nameC',
    show: true,
    render (item) {
      return (
        <div className='flex flex-col'>
          <p>{item.name}</p>
          <p className='text-default-400'>{`${item.categoryS} > ${item.subCategoryS}`}</p>
        </div>
      )
    }
  },
  { name: 'RARE', uid: 'rareText' },
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
    render (item) {
      return item.recipe
    }
  }
]
