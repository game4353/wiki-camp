import Thumbnail from '@/app/component/thumbnail'
import { Column } from '../main'
import { LocalItem } from './item'
import Timestamp from '@/app/component/timestamp'
import SupportEffect from './effect'
import { CampSupportEffectGroup } from '@/app/master/main'
import Skill from '../skill'
import TurnEvent from '../event/turn'

export const localColumns: Column<LocalItem>[] = [
  { name: 'ID', uid: 'uid', hide: true },
  {
    name: 'ICON',
    uid: 'icon',
    show: true,
    render (item) {
      return (
        <Thumbnail
          rid={item.rid}
          frame={1}
          rare={(['n', 'r', 'sr'] as const)[item.rare - 1]}
          type={item.type}
        />
      )
    }
  },
  { name: 'NAME', uid: 'searchName', show: true },
  {
    name: 'RARE',
    uid: 'rareText',
    hide: true,
    render (item) {
      return ['', 'N', 'R', 'SR'][item.rare]
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
    name: 'SUPPORT',
    uid: 'support',
    show: true,
    render (item) {
      return (
        <div className='flex flex-col'>
          {item.ses
            .filter((o): o is CampSupportEffectGroup => o != null)
            .map((o, i) => (
              <SupportEffect lang={item.lang} gid={o.id} lv={1} key={i} format='simple-icon'/>
            ))}
        </div>
      )
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
    name: 'RELEASE',
    uid: 'release',
    show: true,
    render (item) {
      return <Timestamp unix={item.open} />
    }
  }
]
