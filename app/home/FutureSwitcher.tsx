'use client'

import { Button, Tooltip } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function FutureSwitcher () {
  const [future, setfuture] = useState(false)

  useEffect(() => {
    const value = localStorage.getItem('future') || 'false'
    setfuture(value === 'true')
  }, [])

  function switchFuture () {
    if (future) {
      localStorage.setItem('future', 'false')
    } else {
      localStorage.setItem('future', 'true')
    }
    setfuture(b => !b)
    window.dispatchEvent( new Event('storage') )
  }

  if (future)
    return (
      <Tooltip color='danger' content='See Unreleased Data' placement='bottom'>
        <Button isIconOnly variant='light' onClick={switchFuture}>
          <FontAwesomeIcon icon={faEye} size='lg' />
        </Button>
      </Tooltip>
    )
  return (
    <Tooltip color='danger' content='See Unreleased Data' placement='bottom'>
      <Button isIconOnly variant='light' onClick={switchFuture}>
        <FontAwesomeIcon icon={faEyeSlash} size='lg' />
      </Button>
    </Tooltip>
  )
}

export function useFuture () {
  const [future, setfuture] = useState(false)

  useEffect(() => {
    const handleStorageChange = () => {
      const value = localStorage.getItem('future') || 'false'
      setfuture(value === 'true')
    }

    handleStorageChange()

    // Add the event listener when the component mounts
    window.addEventListener('storage', handleStorageChange)

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return future
}

