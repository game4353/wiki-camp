import type { Locale } from '@/i18n-config'
import { type FilterProp } from '@/app/component/filter'
import { serverText } from '@/app/master/server'
import { STATS, num } from '@/app/util'

export async function getFilterProps (lang: Locale): Promise<FilterProp> {
  const textMap = await serverText(lang)
  return [    
    {
      title: 'Event',
      kits: [
        {
          subtitle: 'fff',
          v: [
            {
              name: '< 0',
              value: '-1'
            }
          ],
          filterKey: 'adas'
        }
      ]
    }
  ]
}