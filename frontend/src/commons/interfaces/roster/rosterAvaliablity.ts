// Enum for Roster Type
enum RosterType {
  Athlete = 'Athlete',
  Staff = 'Staff',
  Coach = 'Coach',
  HeadCoach = 'HeadCoach'
}

enum RosterAvailability {
  Verified = 'Verified',
  Unverified = 'Unverified',
  Exemption = 'Exemption'
}

// Interface for Position
interface Position {
  offence?: string
  defense?: string
  special?: string
}

// Interface for Roster
export interface RosterWithAvailability {
  name: string
  profileImgUrl?: string
  rosterType: RosterType
  position?: Position
  backNumber?: number
  avaliability: RosterAvailability
}

export interface ApiResponse {
  valid: boolean
  reasons: string[]
  rosters: RosterWithAvailability[]
}
