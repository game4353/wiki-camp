import React from 'react'
import { NavItem } from './sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCampground,
  faHandPointUp,
  faImage,
  faKitchenSet,
  faLightbulb,
  faScrewdriverWrench,
  faShirt
} from '@fortawesome/free-solid-svg-icons'

export const defaultNavItems: NavItem[] = [
  // {
  //   label: 'Campsite',
  //   href: '/campsite',
  //   icon: <FontAwesomeIcon icon={faCampground} size='lg' />
  // },
  {
    label: 'Costume',
    href: '/costume',
    icon: <FontAwesomeIcon icon={faShirt} size='lg' />
  },
  {
    label: 'Support card',
    href: '/support',
    icon: <FontAwesomeIcon icon={faImage} size='lg' />
  },
  {
    label: 'Gear',
    href: '/gear',
    icon: <FontAwesomeIcon icon={faScrewdriverWrench} size='lg' />
  },
  {
    label: 'Food',
    href: '/food',
    icon: <FontAwesomeIcon icon={faKitchenSet} size='lg' />
  },
  // {
  //   label: 'Tip',
  //   href: '/tip',
  //   icon: <FontAwesomeIcon icon={faHandPointUp} size='lg' />
  // },
]
