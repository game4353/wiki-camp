import TurnEvent from '../event/turn'
import { Column } from '../main'
import { LocalItem } from './item'
import Timestamp from '@/app/component/timestamp'
import Thumbnail from '@/app/component/thumbnail'
import Skill from '../skill'
import Aptitude from '@/app/component/aptitude'

export const localColumns: Column<LocalItem>[] = [
  { name: 'ID', uid: 'uid', hide: true },
  {
    name: 'ICON',
    uid: 'icon',
    show: true,
    render (item, textMap) {
      return (
        <Thumbnail
          bg={item.rare}
          rid={item.rid}
          frame={1}
          rare={item.rare}
          type={item.type}
        />
      )
    }
  },
  {
    name: 'NAME',
    uid: 'nameC',
    show: true,
    render (item, textMap) {
      return (
        <div className='col-start-2 grid grid-cols-1'>
          <span>{item.costume}</span>
          <span>{item.name}</span>
        </div>
      )
    }
  },
  {
    name: 'APT',
    uid: 'aptC',
    show: true,
    render (item, textMap) {
      return (
        <Aptitude
          type='costume'
          hot={item.hot}
          cold={item.cold}
          sport={item.sport}
        />
      )
    }
  },
  ...[1, 2, 3].map(i => ({
    name: `SKILL${i}`,
    uid: `skill${i}`,
    show: true,
    render (item: LocalItem) {
      return <Skill lang={item.lang} layout='full' skill={item.skills[i - 1]} />
    }
  })),
  {
    name: 'EVENT',
    uid: 'event',
    show: true,
    render (item) {
      return <TurnEvent lang={item.lang} layout='list' item={item.event} />
    }
  },
  {
    name: 'RELEASE',
    uid: 'release',
    show: true,
    render (item) {
      return <Timestamp unix={item.open} />
    }
  }
]
