import TurnEvent from '../event/turn'
import { Column } from '../main'
import { CostumeItem } from './data'

export const columns: Column<CostumeItem>[] = [
  { name: 'ID', uid: 'uid' },
  { name: 'ICON', uid: 'icon', show: true },
  { name: 'NAME', uid: 'nameC', show: true },
  { name: 'APT', uid: 'aptC', show: true },
  { name: 'SKILL1', uid: 'skill1C', show: true },
  { name: 'SKILL2', uid: 'skill2C', show: true },
  { name: 'SKILL3', uid: 'skill3C', show: true },
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
