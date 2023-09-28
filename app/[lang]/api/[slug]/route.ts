import path from 'path'
import { promises, existsSync } from 'fs'
import { NextResponse } from 'next/server'
import { Locale } from '@/i18n-config'

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
  if (!existsSync(jsonPath)) jsonPath = path.join(process.cwd(), 'data/master/ja', `${slug}.json`)

  try {
    const fileContents = await promises.readFile(jsonPath, 'utf8')
    const jsonObj = JSON.parse(fileContents)    
    return NextResponse.json(jsonObj, { status: 200 })
  } catch (e) {
    console.error(e)  
    return NextResponse.json({}, { status: 200 })
  }
}
