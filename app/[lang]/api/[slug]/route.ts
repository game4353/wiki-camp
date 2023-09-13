import path from 'path'
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'

// https://dev.to/martinratinaud/nextjs-on-vercel-missing-files-after-build-when-interpolating-file-names-40bl

export async function GET (
  request: Request,
  { params: { lang, slug } }: { params: { lang: string, slug: string } }
) {

  let jsonPath = ''
  if (lang === 'ja') jsonPath = path.join(process.cwd(), 'data/master/ja', `${slug}.json`)
  if (lang === 'zh') jsonPath = path.join(process.cwd(), 'data/master/zh-TW', `${slug}.json`)
  if (lang === 'en') jsonPath = path.join(process.cwd(), 'data/master/en', `${slug}.json`)
  if (lang === 'ko') jsonPath = path.join(process.cwd(), 'data/master/ko', `${slug}.json`)
 
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
