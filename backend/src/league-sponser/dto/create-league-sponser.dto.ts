import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateLeagueSponserDTO {
  @IsNumber()
  @IsNotEmpty()
  leagueId: number

  @IsNumber()
  @IsNotEmpty()
  sponserId: number
}
