import { Locale } from '@/i18n-config'
import type { FilterMeta } from '@/app/component/filter'
import { kitRare } from '@/app/component/filter/kits'

export async function getFilterMeta (lang: Locale): Promise<FilterMeta> {
  return {
    uid: 'food',
    cats: [
      {
        title: 'General',
        kits: [kitRare()]
      }
    ]
  }
}
