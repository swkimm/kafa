import type { PositionType } from '@/commons/interfaces/roster/roster'

export const printPosition = (position?: PositionType): string => {
  if (!position) return ''

  const positionArray: string[] = []

  if (position.offence) {
    positionArray.push(position.offence)
  }

  if (position.defense) {
    positionArray.push(position.defense)
  }

  if (position.special) {
    positionArray.push(position.special)
  }

  return positionArray.join('/')
}
