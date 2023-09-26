import { Locale } from '@/i18n-config'
import { getItems } from './item'
import { ClientComponent } from './client'
import { getFilterProps } from './filter'

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
  const fp = await getFilterProps(lang)

  return <ClientComponent lang={lang} items={items} filterProp={fp} />
}
