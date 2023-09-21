'use client'

import { Locale } from '@/i18n-config'
import { useSkillItem } from './data'
import { useMyPage } from '../myTemplate'
import Skill from '.'

export default function Costumes ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  const skills = useSkillItem(lang)
  return (
    <div className='flex flex-row flex-wrap gap-4'>
      {skills.d.map((v, i) => (
        <Skill lang={lang} layout='full' skill={v} key={i} />
      ))}
    </div>
  )
}
