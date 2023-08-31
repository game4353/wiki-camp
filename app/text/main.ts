import useSWR from 'swr'
import { fetcher } from '../util'
import { Locale } from '@/i18n-config'

export function useText (lang: Locale) {
  const { data, error, isLoading } = useSWR(`/${lang}/api/text`, fetcher)
  const textMap = (cat: string, id: number) => data[cat]['map'][id] ?? '�'

  return {
    textMap,
    textLoading: isLoading,
    textError: error
  }
}
