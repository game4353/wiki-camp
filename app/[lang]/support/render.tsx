import TurnEvent from '../event/turn'
import { Column } from '../main'
import { LocalItem } from './data'

export const localColumns: Column<LocalItem>[] = [
  { name: 'ID', uid: 'uid' },
  { name: 'ICON', uid: 'icon', show: true },
  { name: 'NAME', uid: 'name', show: true },
  { name: 'RARE', uid: 'rareText' },
  { name: 'SKILL', uid: 'skillC', show: true },
  { name: 'SUPPORT', uid: 'support', show: true },
  {
    name: 'EVENT',
    uid: 'event',
    show: true,
    render (item) {
      return <TurnEvent lang={item.lang} layout='list' item={item.event} />
    }
  },
  { name: 'RELEASE', uid: 'release', show: true }
]
