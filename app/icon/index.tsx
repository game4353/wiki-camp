// https://fontawesome.com/search?o=r&m=free
// https://react-icons.github.io/react-icons/

import Image from 'next/image'
import hot from '@/public/images/atlas/hotness.png'
import cold from '@/public/images/atlas/coldness.png'
import sport from '@/public/images/atlas/sporty.png'
import relax from '@/public/images/atlas/relaxing.png'
import play from '@/public/images/atlas/playing.png'
import cook from '@/public/images/atlas/cooking.png'

export default function Icon ({
  name
}: {
  name: 'hot' | 'cold' | 'sport' | 'relax' | 'play' | 'cook'
}) {
  return (
    <div className='relative flex justify-center items-center'>
      <Image
        src={{ hot, cold, sport, relax, play, cook }[name]}
        alt={name}
      />
    </div>
  )
}
