import type { GameWithLeagueDTO } from './game-with-league.dto'

export interface GameWithLeagueAndAssociationDTO extends GameWithLeagueDTO {
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
