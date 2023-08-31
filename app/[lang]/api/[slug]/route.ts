import path from 'path'
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'

export async function GET (
  request: Request,
  { params: { lang, slug } }: { params: { lang: string, slug: string } }
) {
  if (lang === 'zh') lang = 'zh-TW'
  const jsonPath = path.join(process.cwd(), 'data', lang, `${slug}.json`)
  let jsonObj
  try {
    const fileContents = await fs.readFile(jsonPath, 'utf8')
    jsonObj = JSON.parse(fileContents)
  } catch (e) {
    jsonObj = {}
  }
  return NextResponse.json(jsonObj, { status: 200 })
}
