'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Button,
  Card,
  CardBody,
  Link
} from '@nextui-org/react'
import { Tag } from 'primereact/tag'
import {
  Camp,
  CampCampingArea,
  CampLocation,
  CampMission,
  CampMissionLottery,
  CampTemperature,
  CampTimeline,
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
  faWind
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import Icon from '@/app/icon'
import { num } from '@/app/util'

export default function BasicDemo ({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  const camp = useMasterNew<Camp>(lang, 'camp', 'id')
  const campingArea = useMasterNew<CampCampingArea>(
    lang,
    'camp_camping_area',
    'id'
  )
  const cm = useMasterNew<CampMission>(lang, 'camp_mission', 'id')
  const cml = useMasterNew<CampMissionLottery>(
    lang,
    'camp_mission_lottery',
    'id'
  )
  const location = useMasterNew<CampLocation>(lang, 'camp_location', 'id')
  const temperature = useMasterNew<CampTemperature>(
    lang,
    'camp_temperature',
    'id'
  )
  const timeline = useMasterNew<CampTimeline>(lang, 'camp_timeline', 'id')
  const weather = useMasterNew<CampWeather>(lang, 'camp_weather', 'id')
  const wind = useMasterNew<CampWind>(lang, 'camp_wind', 'id')
  const text = useText(lang)
  const textMap = text.map

  const campsites = camp.get('all').filter(c => c.end_date * 1000 >= Date.now())

  const getName = (camp: Camp) => {
    return textMap('CampText', camp.name_text_id)
  }

  function getArea (camp: Camp) {
    const area = campingArea.get(camp.camping_area_id)
    const name = textMap('CampText', area?.name_text_id)
    const desc = textMap('CampText', area?.desc_text_id)
    const loca = textMap(
      'CampText',
      location.get(area?.location_id)?.name_text_id
    )
    const rid = area?.thumbnail_resource_id
    const src = `/images/assets/campsight/${rid}.png`
    return { name, desc, location: loca, src }
  }

  const getMissions = (camp: Camp) => {
    return timeline
      .get('all')
      .filter(o => o.camp_id === camp.id)
      .map(o => cml.get('all').find(v => v.camp_timeline_id === o.id))
      .map(o => cm.get(o?.camp_mission_id))
  }

  const missionTemplate = (camp: Camp) => {
    return (
      <div className='flex flex-row gap-2'>
        {getMissions(camp).map((o, i) => (
          <Icon
            key={i}
            name={
              (['relax', 'play', 'cook'] as const)[num(o?.mission_type) - 1]
            }
          />
        ))}
      </div>
    )
  }

  function chip (icon: IconProp, text: number | string) {
    return (
      <span className='p-flex p-align-items-center p-gap-2'>
        <FontAwesomeIcon icon={icon} />
        <span className='p-font-semibold'>{text}</span>
      </span>
    )
  }

  function itemTemplate (camp: Camp) {
    const area = getArea(camp)
    return (
      <Card as={Link} href={`./campsite/${camp.id}`}>
        <CardBody>
          <div className='p-flex p-flex-column xl:p-flex-row xl:p-align-items-start p-p-4 p-gap-4'>
            <img
              className='p-w-9 sm:p-w-16rem xl:p-w-10rem p-shadow-2 p-block xl:p-block p-mx-auto p-border-round'
              src={area.src}
              alt={getName(camp)}
            />
            <div className='p-flex p-flex-column sm:p-flex-row p-justify-content-between p-align-items-center xl:p-align-items-start p-flex-1 p-gap-4'>
              <div className='p-flex p-flex-column p-align-items-center sm:p-align-items-start p-gap-3'>
                <div className='p-text-2xl p-font-bold'>{getName(camp)}</div>
                <div className='p-flex p-align-items-center p-gap-3'>
                  {area.name}
                  <Tag value={area.location} />
                  {missionTemplate(camp)}
                </div>
                <div className='p-flex p-align-items-center p-gap-3'>
                  {chip(faCalendarDays, camp.month)}
                  {chip(
                    faCloudSun,
                    textMap('CampText', weather.get(camp.weather)?.name_text_id)
                  )}
                  {chip(faCloudShowersHeavy, `${camp.chance_of_rain ?? 0}%`)}
                  {chip(
                    faWind,
                    textMap('CampText', wind.get(camp.wind)?.name_text_id)
                  )}
                  {chip(
                    faTemperatureFull,
                    textMap(
                      'CampText',
                      temperature.get(camp.temperature)?.name_text_id
                    )
                  )}
                </div>
              </div>
              <div className='p-flex sm:p-flex-column p-align-items-center sm:p-align-items-end p-gap-3 sm:p-gap-2'>
                {/* <div className='p-flex p-justify-content-center'>
                  <Popup title={area.name} content={area.desc} />
                </div> */}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className='min-h-0 max-h-full overflow-auto'>
      <div className='flex flex-col gap-3 p-4'>
        {campsites.map(camp => (
          <div key={camp.id}>{itemTemplate(camp)}</div>
        ))}
      </div>
    </div>
  )
}

function Popup ({ title, content }: { title: string; content: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button onPress={onOpen} color='primary'>
        <FontAwesomeIcon icon={faCircleInfo} />
      </Button>
      <Modal
        size='3xl'
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior='inside'
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>
              <ModalBody>
                <pre>{content}</pre>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
