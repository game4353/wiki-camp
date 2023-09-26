import { Locale } from '@/i18n-config'
import { getItems } from './item'
import { ClientComponent } from './client'
import { filterProp } from './filter'

export async function generateStaticParams () {
  return [{ lang: 'ja' }]
}

export default async function ServerComponent ({
  params: { lang },
  searchParams
}: {
  params: { lang: Locale }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const items = await getItems(lang)
  return <ClientComponent lang={lang} items={items} filterProp={filterProp} />
}
