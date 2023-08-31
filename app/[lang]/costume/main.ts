import { Card } from '../card/main'
import { fetcher } from '../../util'
import useSWR from 'swr'
import { Locale } from '@/i18n-config'

export function useCostume(lang: Locale) {
  const { data, error, isLoading } = useSWR(`/${lang}/api/card`, fetcher)
  const costumes = (<Card[]>(data ?? [])).filter(o => (o.type ?? 0) === 0)

  return {
    costumes,
    costumeLoading: isLoading,
    costumeError: error
  }
}
