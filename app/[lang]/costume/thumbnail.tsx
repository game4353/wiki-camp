import Image from 'next/image'
import rare3 from '@/public/images/atlas/rare_3.png'
import rare2 from '@/public/images/atlas/rare_2.png'
import rare1 from '@/public/images/atlas/rare_1.png'
import bgSr from '@/public/images/atlas/item_bg_sr.png'
import bgR from '@/public/images/atlas/item_bg_r.png'
import bgN from '@/public/images/atlas/item_bg_n.png'
import frame from '@/public/images/atlas/card_frame_stretched_1.png'
import comfortableness from '@/public/images/atlas/comfortableness.png'
import healing from '@/public/images/atlas/healing.png'
import relationship from '@/public/images/atlas/relationship.png'
import satisfacation from '@/public/images/atlas/satisfacation.png'
import warmth from '@/public/images/atlas/warmth.png'


export default function Thumbnail ({
  id,
  rare,
  type,
}: {
  id: number
  rare: number
  type: number
}) {
  return (
    <div className='w-16 h-16 relative'>
      <div className='absolute flex justify-center items-center w-32 h-32 scale-50 -top-8 -left-8'>
          <Image
            className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            src={ [bgN, bgR, bgSr][rare - 1] }
            alt=""
          />
          <Image
            className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            src={`/images/assets/thumbnailn/210${id}.png`}
            alt=""
            width={112}
            height={112}
          />
          <Image
            className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            src={frame}
            alt=""
          />
          <Image
            className='absolute top-[-2px] left-0'
            src={ [rare1, rare2, rare3][rare - 1] }
            alt=""
          />
          <Image
            className='absolute top-[6px] left-[101px]'
            src={ [relationship, satisfacation, comfortableness, warmth, healing][type - 1] }
            alt=""
          />
      </div>
    </div>
  )
}
