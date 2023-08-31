'use client'
import React, { useState, useEffect, ChangeEventHandler } from 'react'
import { Row, unixToJst } from '../../util'
import { useText } from '../../text/main'
import { useSupport } from './main'
import { Card } from '../card/main'
import { Locale } from '@/i18n-config'

export default function Supports ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  var { supports, supportLoading, supportError } = useSupport(lang)
  var { textMap, textLoading, textError } = useText(lang)

  if (supportLoading || textLoading) return <div>Loading...</div>
  if (supportError || textError) return <div>Failed to load</div>

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

  const css1 = 'border-r border-orange p-2'
  return (
    <div className={'grid border border-black'}>
      {rows.map((d, i) => (
        <div className={`${css1}`} key={i} style={{ ['grid-column' as any]: `${i + 1}` }}>
          {Object.keys(d)[0]}
        </div>
      ))}
      {supports.map(support => (
        Object.entries(rows).map(([i, d]) => (
          <div className={`${css1}`} key={i}>
            {Object.values(d)[0](support)}
          </div>
        ))
      ))}
    </div>
  )
}
