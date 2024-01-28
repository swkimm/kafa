interface GameBase {
  id: number
  name: string
  startedAt: string
  stadium: string
}

export interface Game extends GameBase {
  homeTeamId: number
  awayTeamId: number
  result?: string | null
}

export interface GameMany extends GameBase {
  homeTeam: {
    id: number
    name: string
    profileImgUrl: string
  }
  awayTeam: {
    id: number
    name: string
    profileImgUrl: string
  }
  League: {
    id: number
    name: string
  }
  score: {
    homeTeamScore: number
    awayTeamScore: number
  }
}

export interface GameWithLeagueAndAssociation extends GameMany {
  League: {
    id: number
    name: string
    Association: {
      id: number
      name: string
      profileImgUrl: string
    }
  }
}
