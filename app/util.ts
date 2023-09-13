export const fetcher = async (
  ...args: Parameters<typeof fetch>
): Promise<any> => {
  const response = await fetch(...args)
  const data = await response.json()
  return data
}

/** 1=G, 2=F, ... */
export function map8score (num: number) {
  return '-GFEDCBAS'[num]
}

/** Convert Unix timestamp to Japan timestamp. */
export function unixToJst (unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000)
  const options = {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'
  } as const
  const formatter = new Intl.DateTimeFormat('ja', options)
  return formatter.format(date)
}

export function isEmpty (input: Record<any, any> | any[]) {
  return Object.keys(input).length === 0
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// add + sign to positive numbers, and turn to string
export function signed (num?: number) {
  num = num ?? 0
  return num < 0 ? String(num) : `+${num}`
}
