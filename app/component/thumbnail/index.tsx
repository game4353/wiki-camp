import Image from 'next/image'
import rareSr from '@/public/images/atlas/rare_sr.png'
import rareR from '@/public/images/atlas/rare_r.png'
import rareN from '@/public/images/atlas/rare_n.png'
import rare3 from '@/public/images/atlas/rare_3.png'
import rare2 from '@/public/images/atlas/rare_2.png'
import rare1 from '@/public/images/atlas/rare_1.png'
import bgSr from '@/public/images/atlas/item_bg_sr.png'
import bgR from '@/public/images/atlas/item_bg_r.png'
import bgN from '@/public/images/atlas/item_bg_n.png'
import frame0 from '@/public/images/atlas/item_frame_stretched.png'
import frame1 from '@/public/images/atlas/card_frame_stretched_1.png'
import comfortableness from '@/public/images/atlas/comfortableness.png'
import healing from '@/public/images/atlas/healing.png'
import relationship from '@/public/images/atlas/relationship.png'
import satisfacation from '@/public/images/atlas/satisfacation.png'
import warmth from '@/public/images/atlas/warmth.png'

export default function Thumbnail ({
  bg,
  rid,
  frame,
  rare,
  type
}: {
  bg?: number
  rid: number | string
  frame: number
  rare: 1 | 2 | 3 | 'n' | 'r' | 'sr'
  type?: number
}) {
  return (
    <div className='w-16 h-16 relative'>
      <div className='absolute flex justify-center items-center w-32 h-32 scale-50 -top-8 -left-8'>
        {bg != null && (
          <Image
            className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            src={[bgN, bgR, bgSr][bg - 1]}
            alt=''
          />
        )}
        <Image
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
          src={`/images/assets/thumbnailn/${rid}.png`}
          alt=''
          width={112}
          height={112}
        />
        <Image
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
          src={[frame0, frame1][frame]}
          alt=''
        />
        <Image
          className='absolute top-[-2px] left-0'
          src={
            { 1: rare1, 2: rare2, 3: rare3, n: rareN, r: rareR, sr: rareSr }[
              rare
            ]
          }
          alt=''
        />
        {type != null && (
          <Image
            className='absolute top-[6px] left-[101px]'
            src={
              [relationship, satisfacation, comfortableness, warmth, healing][
                type - 1
              ]
            }
            alt=''
          />
        )}
      </div>
    </div>
  )
}
