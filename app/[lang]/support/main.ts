import { Card } from '../card/main'
import { fetcher } from '../../util'
import useSWR from 'swr'
import { Locale } from '@/i18n-config'

export function useSupport(lang: Locale) {
  const { data, error, isLoading } = useSWR(`/${lang}/api/card`, fetcher)
  const supports = (<Card[]>(data ?? [])).filter(o => o.type === 14)

  return {
    supports,
    supportLoading: isLoading,
    supportError: error
  }
}
