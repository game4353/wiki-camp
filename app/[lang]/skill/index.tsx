import { Locale } from '@/i18n-config'
import { LocalItem } from './item'
import { Divider } from '@nextui-org/react'
import Icon from '@/app/component/icon/skill'
import { useText } from '@/app/master/main'

export default function Skill ({
  lang,
  layout,
  skill
}: {
  lang: Locale
  layout: 'full'
  skill?: LocalItem
}) {
  const text = useText(lang)
  if (skill == null) return <div></div>

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row gap-x-1'>
        <div className='max-w-[40px]'>
          <Icon rid={skill.rid} />
        </div>
        <div>
          <p>{text.map('CampText', skill?.tid.groupName)}</p>
          <div className='flex flex-row'>
            <p>{skill?.force ? '💯' : '🎲'}</p>
            <p>skill pt: {skill?.sp}</p>
          </div>
        </div>
      </div>
      <Divider className='my-1' />
      <pre>{text.map('CampText', skill?.tid.desc)}</pre>
    </div>
  )
}
