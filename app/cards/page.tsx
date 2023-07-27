"use client"
import { useState, useEffect, ChangeEventHandler } from 'react';
import { Card, readCard, readCardCampProperty } from '../util';

const Cards = () => {
  const [cards, setCards] = useState<Card[]>([]);  
  
  useEffect(() => {
    // Fetch the book data from the URL and update the state
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const data = await readCard()
      const cardProp = await readCardCampProperty()
      console.log(data, cardProp)
      setCards(data);
    } catch (error) {
      console.error('Error fetching book data:', error);
    }
  };

  const columnWidths: Partial<Record<keyof Card, string>> = {
    id: 'w-20',
    rarity: 'w-20'
  }
  const css1 = 'border-r border-black p-2'

  return (
    <div className="flex flex-col border border-black">
      <div className="flex flex-row font-bold border-b border-black p-2">
        {Object.entries(columnWidths).map(([k, v]) => (
          <div className={`${css1} ${v}`}>{k}</div>
        ))}
      </div>
      {cards.map((card) => (
        <div key={card.id} className="flex flex-row border-b border-black p-2">
          {Object.entries(columnWidths).map(([k, v]) => (
            <div className={`${css1} ${v}`}>{card[k as keyof Card]}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Cards;