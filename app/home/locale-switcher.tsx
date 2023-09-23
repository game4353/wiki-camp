import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@nextui-org/react'
import { usePathname, useRouter } from 'next/navigation'
import { Locale, i18n } from '@/i18n-config'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { set } from '@/redux/features/languageSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

export default function LocaleSwitcher () {
  const pathName = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/'
    const segments = pathName.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  function handleLanguageChange (lang: Locale) {
    dispatch(set(lang))
    // ↓ not needed
    router.push(redirectedPathName(lang))
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant='light'>
          <FontAwesomeIcon icon={faLanguage} size='xl' />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Select language'
        onAction={key => handleLanguageChange(key as Locale)}
      >
        {Object.entries(i18n.languages).map(([locale, lang]) => (
          <DropdownItem key={locale}>{lang}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

export function useLanguage() {
  return useAppSelector(state => state.languageReducer.value)
}
