import type { Column, ValidColumnKey } from '@/app/[lang]/main'
import { useText } from '@/app/master/main'
import type { Locale } from '@/i18n-config'
import type { ReactNode } from 'react'

export function MyCell<T> ({
  lang,
  item,
  columnKey,
  columns
}: {
  lang: Locale
  item: T
  columnKey: keyof T
  columns: Column<T>[]
}) {
  const text = useText(lang)
  const render = columns.find(o => o.uid === columnKey)?.render
  if (render != null) return render(item, text.map)
  else {
    return item[columnKey as ValidColumnKey<T>] as ReactNode
  }
}
