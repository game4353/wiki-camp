import path from 'path'
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'

export async function GET (
  request: Request,
  { params: { lang, slug } }: { params: { lang: string, slug: string } }
) {
  if (lang === 'zh') lang = 'zh-TW'
  const jsonPath = path.join(process.cwd(), 'data', 'master', lang, `${slug}.json`)
  let jsonObj
  console.log(jsonPath)
  try {
    const data = await import(`@/data/master/${lang}/${slug}.json`)
    
    const fileContents = await fs.readFile(jsonPath, 'utf8')
    // jsonObj = JSON.parse(fileContents)
    jsonObj = data.default
  } catch (e) {
    console.error(e)
    jsonObj = {}
  }
  return NextResponse.json(jsonObj, { status: 200 })
}
