import Image from 'next/image'
import rareSr from '@/public/images/atlas/rare_sr.png'
import rareR from '@/public/images/atlas/rare_r.png'
import rareN from '@/public/images/atlas/rare_n.png'
import bgSr from '@/public/images/atlas/item_bg_sr.png'
import bgR from '@/public/images/atlas/item_bg_r.png'
import bgN from '@/public/images/atlas/item_bg_n.png'
import frame from '@/public/images/atlas/item_frame_stretched.png'

export default function Thumbnail ({
  id,
  rare,
}: {
  id: number
  rare: number
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
            src={`/images/assets/thumbnailn/${id}.png`}
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
            src={ [rareN, rareR, rareSr][rare - 1] }
            alt=""
          />
      </div>
    </div>
  )
}
