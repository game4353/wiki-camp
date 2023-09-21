import { Locale } from '@/i18n-config'
import { localItems } from './item'
import { ClientComponent } from './client'
import { getFilterProps } from './filter'

export default async function ServerComponent ({
  params: { lang },
  searchParams
}: {
  params: { lang: Locale }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const items = await localItems(lang)
  const fp = await getFilterProps(lang)
  
  return (
    <ClientComponent lang={lang} items={items} filterProp={fp}/>
  )
}
