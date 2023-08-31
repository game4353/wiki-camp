export const fetcher = async (...args: Parameters<typeof fetch>): Promise<any> => {
  const response = await fetch(...args);
  const data = await response.json();
  return data;
};

export function identity<T> (val: T): T {
  return val
}

export type Row<T> = {
  [title: string]: (o: T) => string | number
}

function str2num (str: string): number {
  if (str === '') return 0
  const num = Number(str)
  if (isNaN(num)) throw new Error(`${str} is not a number.`)
  return num
}

class CardCampProperty {
  card_id: number
  camp_action_type: number
  relationship: number
  satisfaction: number
  comfortableness: number
  warmth: number
  healing: number
  hotness: number
  coldness: number
  sporty: number
  relaxing: number
  playing: number
  cooking: number
  camp_skill_group_id_slot1: number
  camp_skill_level_slot1: number
  camp_skill_group_id_slot2: number
  camp_skill_level_slot2: number
  camp_skill_group_id_slot3: number
  camp_skill_level_slot3: number
  camp_support_effect_group_id_slot1: number
  camp_support_effect_level_slot1: number
  camp_support_effect_group_id_slot2: number
  camp_support_effect_level_slot2: number
  camp_support_effect_group_id_slot3: number
  camp_support_effect_level_slot3: number
  camp_support_effect_group_id_slot4: number
  camp_support_effect_level_slot4: number
  camp_support_effect_group_id_slot5: number
  camp_support_effect_level_slot5: number
  camp_support_effect_group_id_slot6: number
  camp_support_effect_level_slot6: number
  camp_turn_event_id_slot1: number
  camp_turn_event_id_slot2: number
  camp_turn_event_id_slot3: number
  level_growth_group_id: number
  rank_growth_group_id: number

  constructor (obj: Record<string, string>) {
    try {
      this.card_id = str2num(obj['card_id'])
      this.camp_action_type = str2num(obj['camp_action_type'])
      this.relationship = str2num(obj['relationship'])
      this.satisfaction = str2num(obj['satisfaction'])
      this.comfortableness = str2num(obj['comfortableness'])
      this.warmth = str2num(obj['warmth'])
      this.healing = str2num(obj['healing'])
      this.hotness = str2num(obj['hotness'])
      this.coldness = str2num(obj['coldness'])
      this.sporty = str2num(obj['sporty'])
      this.relaxing = str2num(obj['relaxing'])
      this.playing = str2num(obj['playing'])
      this.cooking = str2num(obj['cooking'])
      this.camp_skill_group_id_slot1 = str2num(obj['camp_skill_group_id_slot1'])
      this.camp_skill_level_slot1 = str2num(obj['camp_skill_level_slot1'])
      this.camp_skill_group_id_slot2 = str2num(obj['camp_skill_group_id_slot2'])
      this.camp_skill_level_slot2 = str2num(obj['camp_skill_level_slot2'])
      this.camp_skill_group_id_slot3 = str2num(obj['camp_skill_group_id_slot3'])
      this.camp_skill_level_slot3 = str2num(obj['camp_skill_level_slot3'])
      this.camp_support_effect_group_id_slot1 = str2num(
        obj['camp_support_effect_group_id_slot1']
      )
      this.camp_support_effect_level_slot1 = str2num(
        obj['camp_support_effect_level_slot1']
      )
      this.camp_support_effect_group_id_slot2 = str2num(
        obj['camp_support_effect_group_id_slot2']
      )
      this.camp_support_effect_level_slot2 = str2num(
        obj['camp_support_effect_level_slot2']
      )
      this.camp_support_effect_group_id_slot3 = str2num(
        obj['camp_support_effect_group_id_slot3']
      )
      this.camp_support_effect_level_slot3 = str2num(
        obj['camp_support_effect_level_slot3']
      )
      this.camp_support_effect_group_id_slot4 = str2num(
        obj['camp_support_effect_group_id_slot4']
      )
      this.camp_support_effect_level_slot4 = str2num(
        obj['camp_support_effect_level_slot4']
      )
      this.camp_support_effect_group_id_slot5 = str2num(
        obj['camp_support_effect_group_id_slot5']
      )
      this.camp_support_effect_level_slot5 = str2num(
        obj['camp_support_effect_level_slot5']
      )
      this.camp_support_effect_group_id_slot6 = str2num(
        obj['camp_support_effect_group_id_slot6']
      )
      this.camp_support_effect_level_slot6 = str2num(
        obj['camp_support_effect_level_slot6']
      )
      this.camp_turn_event_id_slot1 = str2num(obj['camp_turn_event_id_slot1'])
      this.camp_turn_event_id_slot2 = str2num(obj['camp_turn_event_id_slot2'])
      this.camp_turn_event_id_slot3 = str2num(obj['camp_turn_event_id_slot3'])
      this.level_growth_group_id = str2num(obj['level_growth_group_id'])
      this.rank_growth_group_id = str2num(obj['rank_growth_group_id'])
    } catch (e) {
      throw obj
    }
  }
}
// export async function readCard(): Promise<Card[]> {
//   const data = await readTsv('Card')
//   return data.filter(o => o.id !== '').map(o => new Card(o))
// }

// export async function readCardCampProperty(): Promise<CardCampProperty[]> {
//   const data = await readTsv('CardCampProperty')
//   return data.filter(o => o.card_id !== '').map(o => new CardCampProperty(o))
// }

export function getLocale(): string {
  return 'ja'
}

/** Convert Unix timestamp to Japan timestamp. */
export function unixToJst(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  const options = {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
  } as const;
  const formatter = new Intl.DateTimeFormat(getLocale(), options);
  return formatter.format(date);
}
