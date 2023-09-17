import path from 'path'
import { promises as fs } from 'fs'
import { Locale } from '@/i18n-config'
import { NgWordClient } from './page2'
import { toHira } from '@/app/util'

export default async function NgWord( {
  params: {lang}
}: {
  params: {lang: Locale}
}) {  
  const ngPath = path.join(process.cwd(), 'data/ngwords.txt')
  const fileContents = await fs.readFile(ngPath, 'utf8')
  const ngList = fileContents.split(/\r?\n/).map(toHira)
  const ngSet = new Set(ngList)
  
  return <NgWordClient lang={lang} ngSet={ngSet}/>
} 
