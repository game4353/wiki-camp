import Image from 'next/image'

export default function Icon ({ rid }: { rid?: number }) {
  return (
    rid && (
      <Image
        src={`/images/assets/campskillicon/${rid}.png`}
        alt=''
        width={112}
        height={112}
      />
    )
  )
}
