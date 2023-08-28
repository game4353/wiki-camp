'use client'
import React, { useState, useEffect, ChangeEventHandler } from 'react'
import { Card, useUser } from '../util'

const Cards: React.FC = () => {
  const { cards, isLoading, isError } = useUser(1)

  console.log(cards, isLoading, isError)

  const columnWidths: Partial<Record<keyof Card, string>> = {
    id: 'w-20',
    rarity: 'w-20'
  }
  const css1 = 'border-r border-black p-2'

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Failed to load</div>

  return (
    <div className='flex flex-col border border-black'>
      <div className='flex flex-row font-bold border-b border-black p-2'>
        {Object.entries(columnWidths).map(([k, v]) => (
          <div className={`${css1} ${v}`} key={k}>
            {k}
          </div>
        ))}
      </div>
      {cards.map(card => (
        <div key={card.id} className='flex flex-row border-b border-black p-2'>
          {Object.entries(columnWidths).map(([k, v]) => (
            <div className={`${css1} ${v}`} key={k}>
              {card[k as keyof Card]}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Cards
