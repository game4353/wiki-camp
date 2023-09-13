import { Locale } from '@/i18n-config'
import { SkillItem } from './data'
import { Divider } from '@nextui-org/react'

export default function Skill ({
  lang,
  layout,
  skill
}: {
  lang: Locale
  layout: 'full'
  skill?: SkillItem
}) {
  if (skill == null) return <div></div>
  
  return (
    <div className='flex flex-col'>
      <div className='flex flex-row gap-x-1'>
        <div className='max-w-[40px]'>
        {skill.icon}</div>
      <div>
        <p>{skill?.groupName}</p>
        <div className='flex flex-row'>
          <p>{skill?.force ? '💯' : '🎲'}</p>
          <p>skill pt: {skill?.sp}</p>
        </div>
      </div></div>
      <Divider className='my-1' />
      {(skill?.desc?.split('\n') ?? []).map((t, i) => (
        <p key={i}>{t}</p>
      ))}
    </div>
  )
}
