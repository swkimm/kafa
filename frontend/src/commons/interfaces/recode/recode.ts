export enum RecordType {
  Passer = 'Passer',
  Rusher = 'Rusher',
  Receiver = 'Receiver',
  Kicker = 'Kicker',
  Safety = 'Safety'
}

export enum UnitType {
  TouchDown = 'TouchDown',
  PAT = 'PAT',
  FieldGoal = 'FieldGoal'
}

interface Game {
  id: number
  homeTeam: Team
  awayTeam: Team
}

interface Team {
  id: number
  name: string
  profileImgUrl?: string
}

interface Athlete {
  position: Position
  Roster: Roster
}

interface Position {
  offence?: string
  defense?: string
  special?: string
}

interface Roster {
  id: number
  name: string
  profileImgUrl?: string
}

// Record 인터페이스 정의
export interface Record {
  id: number
  type: RecordType
  score: number
  unit: string
  Game: Game
  Athlete: Athlete
}
