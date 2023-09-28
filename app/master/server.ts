import { Locale } from '@/i18n-config'
import path from 'path'
import { promises, existsSync } from 'fs'
import { textMap } from './text'

export async function serverMaster<T>(lang: Locale, database: string) {
  const l = lang === 'zh' ? 'zh-TW' : lang
  const filePath = path.join(process.cwd(), `data/master/${l}/${database}.json`)
  if (!existsSync(filePath)) return serverMaster<T>('ja', database)
  const fileContents = await promises.readFile(filePath, 'utf8')
  return JSON.parse(fileContents) as T[]
}

export async function serverText (lang: Locale) {
  const data = await serverMaster(lang, 'text')
  return textMap.bind(data)
}
