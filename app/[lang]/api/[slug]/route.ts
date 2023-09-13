import path from 'path'
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'

export async function GET (
  request: Request,
  { params: { lang, slug } }: { params: { lang: string, slug: string } }
) {
  if (lang === 'zh') lang = 'zh-TW'
  else if (lang === 'ja') lang = 'ja'
  let jsonPath = path.join(process.cwd(), 'data', 'master', lang, `${slug}.json`)
  if (lang === 'en') jsonPath = path.join(process.cwd(), 'data/master/en', `${slug}.json`)
  let jsonObj
  
  try {
    // method 1
    const fileContents = await fs.readFile(jsonPath, 'utf8')
    jsonObj = JSON.parse(fileContents)
    
    // method 2
    // const data = await import(`@/data/master/${lang}/${slug}.json`)
    // jsonObj = data.default    
  } catch (e) {
    console.error(e)
    jsonObj = {}
  }
  return NextResponse.json(jsonObj, { status: 200 })
}
