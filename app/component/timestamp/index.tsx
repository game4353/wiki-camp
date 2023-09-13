import { Tooltip } from '@nextui-org/react'

export default function Timestamp ({ unix }: { unix: number }) {
  const date = new Date(unix * 1000)
  const options = {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  } as const
  const formatter = new Intl.DateTimeFormat('ja', options)
  const jpTime = formatter.format(date)

  return (
    <Tooltip content={date.toString()}>
      <span className='cursor-help border-b-2 border-dashed border-blue-500'>
        {jpTime}
      </span>
    </Tooltip>
  )
}
