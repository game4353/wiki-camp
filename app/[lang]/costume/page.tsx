'use client'

import React from 'react'
import { Row, unixToJst } from '../../util'
import { useText } from '../../text/main'
import { useCostume } from './main'
import { Card } from '../card/main'
import { Locale, i18n } from '@/i18n-config'

export async function generateStaticParams () {
  return i18n.locales.map(lang => {
    lang
  })
}

export default function Costumes ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  var { costumes, costumeLoading, costumeError } = useCostume(lang)
  var { textMap, textLoading, textError } = useText(lang)

  if (costumeLoading || textLoading) return <div>Loading...</div>
  if (costumeError || textError) return <div>Failed to load</div>

  // console.log(cards, isLoading, isError)

  const rows: Row<Card>[] = [
    { ID: o => o.id },
    { Icon: o => `210${o.id}` },
    { Costume: o => textMap('CardText', o.name_prefix_text_id) },
    { Name: o => o.member_id },
    { Rare: o => o.rarity },
    { Type: o => o.id },
    { Release: o => unixToJst(o.open_date) }
  ]

  return (
    <div className={'grid border border-black'}>
      {rows.map((d, i) => (
        <div
          className={'border-r border-orange p-2'}
          key={i}
          style={{ ['grid-column' as any]: `${i + 1}` }}
        >
          {Object.keys(d)[0]}
        </div>
      ))}
      {costumes.map(costume =>
        Object.entries(rows).map(([i, d]) => (
          <div className={'border-r border-orange p-2'} key={i}>
            {Object.values(d)[0](costume)}
          </div>
        ))
      )}
    </div>
  )
}
