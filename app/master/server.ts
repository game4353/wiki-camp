import { Locale } from '@/i18n-config'
import path from 'path'
import { promises as fs } from 'fs'
import { textMap } from './text'

export async function serverMaster<T>(lang: Locale, database: string) {
  const l = lang === 'zh' ? 'zh-TW' : lang
  const filePath = path.join(process.cwd(), `data/master/${l}/${database}.json`)
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents) as T[]
}

export async function serverText (lang: Locale) {
  const data = await serverMaster(lang, 'text')
  return textMap.bind(data)
}
