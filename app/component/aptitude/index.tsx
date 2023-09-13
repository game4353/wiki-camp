import Icon from '@/app/icon'

/** 1=G, 2=F, ... */
export function map8score (num: number) {
  return '-GFEDCBAS'[num]
}

export default function Aptitude ({ 
  type, hot, cold, sport, relax, play, cook
}: { 
  type: 'costume' | 'mission'
  hot?: number 
  cold?: number
  sport?: number
  relax?: number
  play?: number
  cook?: number
}) {
  if (type === 'costume') return (
    <div className='max-w-[42px] grid grid-rows-3 grid-flow-col gap-x-1 items-center'>
      <Icon name='hot' />
      <Icon name='cold' />
      <Icon name='sport' />
      <p>{map8score(hot ?? 0)}</p>
      <p>{map8score(cold ?? 0)}</p>
      <p>{map8score(sport ?? 0)}</p>
    </div>
  )
  
  if (type === 'mission') return (
    <div className='max-w-[42px] grid grid-rows-3 grid-flow-col gap-x-1 items-center'>
      <Icon name='relax' />
      <Icon name='play' />
      <Icon name='cook' />
      <p>{map8score(relax ?? 0)}</p>
      <p>{map8score(play ?? 0)}</p>
      <p>{map8score(cook ?? 0)}</p>
    </div>
  )
}
