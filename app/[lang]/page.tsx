import { Locale } from '@/i18n-config'
import Image from 'next/image'

export default function Home ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  return (
    <div className='flex flex-col justify-center px-[10%]'>
      <Image
        src='https://yurucamp-game.enish.com/img/logo_w.png?202304260727'
        alt=''
        width={640}
        height={260}
        className='self-center'
      />
      <div className='flex flex-row justify-center gap-4'>
        <p>▲ 解析wiki</p>
        <p>▲ 開発中</p>
      </div>
    </div>
  )
}
