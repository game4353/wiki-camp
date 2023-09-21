import {
  CampSupportEffect,
  CampSupportEffectGroup,
  useMasterNew,
  useText
} from '@/app/master/main'
import { Locale } from '@/i18n-config'
import { Tooltip } from '@nextui-org/react'
import Icon from '@/app/component/icon/support'

export default function SupportEffect ({
  lang,
  gid,
  lv,
  format
}: {
  lang: Locale
  gid: number
  lv: number
  format: 'simple' | 'simple-icon'
}) {
  const cse = useMasterNew<CampSupportEffect>(lang, 'camp_support_effect', 'id')
  const cseg = useMasterNew<CampSupportEffectGroup>(
    lang,
    'camp_support_effect_group',
    'id'
  )
  const text = useText(lang)

  const obj = cse
    .get('all')
    .find(v => v.support_effect_group_id === gid && v.level === lv)
  const name = text.map('CampText', obj?.name_text_id)
  const desc = text.map('CampText', obj?.desc_text_id)
  const value = obj?.effect_value

  const obj2 = cseg.get(gid)
  const rid = obj2?.icon_resource_id
  const name2 = text.map('CampText', obj2?.name_text_id)
  const target = obj2?.effect_target_type
  const param = obj2?.effect_target_param
  const event = obj2?.case_event_flag_id

  const icon = <Icon rid={rid} />

  const tip = (
    <div className='flex flex-col'>
      {/* <pre>{gid}</pre>
      <pre>{rid}</pre>
      <pre>{name}</pre> */}
      <pre>{desc}</pre>
      {/* <pre>target={target}</pre>
      <pre>param={param}</pre>
      <pre>value={value}</pre>
      <pre>event={event}</pre> */}
    </div>
  )

  const display = (
    <div className='flex flex-row gap-1'>
      {format.endsWith('-icon') && icon}
      <span>{name2}</span>
    </div>
  )

  return format.startsWith('simple-') ? (
    display
  ) : (
    <Tooltip content={tip} placement='top' showArrow={true}>
      {display}
    </Tooltip>
  )
}
