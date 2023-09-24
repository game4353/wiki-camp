import { faPersonDigging } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function WIP () {
  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      <FontAwesomeIcon icon={faPersonDigging} size='10x' />
      <p className='text-6xl font-mono'>W I P</p>
    </div>
  )
}
