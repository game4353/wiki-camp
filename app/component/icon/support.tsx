import Image from 'next/image'

export default function Icon ({ rid }: { rid?: number }) {
  return (
    rid && (
      <div>
        <Image
          src={`/images/assets/campsupporticon/${rid}.png`}
          alt=''
          width={18}
          height={18}
        />
      </div>
    )
  )
}
