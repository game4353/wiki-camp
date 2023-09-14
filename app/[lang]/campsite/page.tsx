'use client'

import React, { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Chip } from 'primereact/chip'
import { DataView } from 'primereact/dataview'
import { Dialog } from 'primereact/dialog'
import { Rating } from 'primereact/rating'
import { Tag } from 'primereact/tag'
import {
  Camp,
  CampCampingArea,
  CampLocation,
  CampTemperature,
  CampWeather,
  CampWind,
  useMasterNew,
  useText
} from '@/app/master/main'
import { Locale } from '@/i18n-config'
import '@/app/style.scss'
import {
  faCalendarDays,
  faCircleInfo,
  faCloudShowersHeavy,
  faCloudSun,
  faTemperatureFull,
  faTemperatureHalf,
  faWind
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { formatText } from '@/app/util'

interface Product {
  id: string
  code: string
  name: string
  description: string
  image: string
  price: number
  category: string
  quantity: number
  inventoryStatus: string
  rating: number
}

export default function BasicDemo ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  const [visible, setVisible] = useState<number | undefined>(undefined)
  const [products, setProducts] = useState<Camp[]>([])
  const camp = useMasterNew<Camp>(lang, 'camp', 'id')
  const campingArea = useMasterNew<CampCampingArea>(
    lang,
    'camp_camping_area',
    'id'
  )
  const location = useMasterNew<CampLocation>(lang, 'camp_location', 'id')
  const temperature = useMasterNew<CampTemperature>(
    lang,
    'camp_temperature',
    'id'
  )
  const weather = useMasterNew<CampWeather>(lang, 'camp_weather', 'id')
  const wind = useMasterNew<CampWind>(lang, 'camp_wind', 'id')
  const text = useText(lang)

  useEffect(() => {
    setProducts(camp.get('all'))
  }, [camp.l])

  const campsites = camp.get('all').filter(c => c.end_date * 1000 >= Date.now())

  const getName = (camp: Camp) => {
    return text.map('CampText', camp.name_text_id)
  }

  function getArea (camp: Camp) {
    const area = campingArea.get(camp.camping_area_id)
    const name = text.map('CampText', area?.name_text_id)
    const desc = text.map('CampText', area?.desc_text_id)
    const loca = text.map(
      'CampText',
      location.get(area?.location_id)?.name_text_id
    )
    const rid = area?.thumbnail_resource_id
    const src = `/images/assets/campsight/${rid}.png`
    return { name, desc, location: loca, src }
  }

  function chip (icon: IconProp, text: number | string) {
    return (
      <span className='p-flex p-align-items-center p-gap-2'>
        <FontAwesomeIcon icon={icon} />
        <span className='p-font-semibold'>{text}</span>
      </span>
    )
  }

  const itemTemplate = (camp: Camp) => {
    const area = getArea(camp)
    return (
      <div className='p-col-12'>
        <div className='p-flex p-flex-column xl:p-flex-row xl:p-align-items-start p-p-4 p-gap-4'>
          <img
            className='p-w-9 sm:p-w-16rem xl:p-w-10rem p-shadow-2 p-block xl:p-block p-mx-auto p-border-round'
            src={area.src}
            alt={getName(camp)}
          />
          <div className='p-flex p-flex-column sm:p-flex-row p-justify-content-between p-align-items-center xl:p-align-items-start p-flex-1 p-gap-4'>
            <div className='p-flex p-flex-column p-align-items-center sm:p-align-items-start p-gap-3'>
              <div className='p-text-2xl p-font-bold p-text-900'>
                {getName(camp)}
              </div>
              <div className='p-flex p-align-items-center p-gap-3'>
                {area.name}
                <Tag value={area.location} />
              </div>
              <div className='p-flex p-align-items-center p-gap-3'>
                {chip(faCalendarDays, camp.month)}
                {chip(
                  faCloudSun,
                  text.map('CampText', weather.get(camp.weather)?.name_text_id)
                )}
                {chip(faCloudShowersHeavy, `${camp.chance_of_rain ?? 0}%`)}
                {chip(
                  faWind,
                  text.map('CampText', wind.get(camp.wind)?.name_text_id)
                )}
                {chip(
                  faTemperatureFull,
                  text.map(
                    'CampText',
                    temperature.get(camp.temperature)?.name_text_id
                  )
                )}
              </div>
            </div>
            <div className='p-flex sm:p-flex-column p-align-items-center sm:p-align-items-end p-gap-3 sm:p-gap-2'>
              <div className='p-card p-flex p-justify-content-center'>
                <Button onClick={() => setVisible(camp.id)}>
                  <FontAwesomeIcon icon={faCircleInfo} />
                </Button>
                <Dialog
                  header={area.name}
                  visible={visible === camp.id}
                  style={{ width: '50vw' }}
                  onHide={() => setVisible(undefined)}
                >
                  {/* {area.desc.split('\n').map((t, i) => (<p key={i} className='p-m-0'>{t}</p>))} */}
                  <p className='p-m-0'>{formatText(area.desc)}</p>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-4 bg-stone-300'>
      <DataView value={campsites} itemTemplate={itemTemplate} />
    </div>
  )
}
