import path from 'path'
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'

export async function GET (
  request: Request,
  { params }: { params: { lan: string, slug: string } }
) {
  const jsonPath = path.join(process.cwd(), 'data', params.lan, `${params.slug}.json`)
  const fileContents = await fs.readFile(jsonPath, 'utf8')
  const jsonObj = JSON.parse(fileContents)
  return NextResponse.json(jsonObj, { status: 200 })
}
