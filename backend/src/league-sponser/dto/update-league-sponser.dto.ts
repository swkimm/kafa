import { IsNumber, IsOptional } from 'class-validator'

export class UpdateLeagueSponserDTO {
  @IsNumber()
  @IsOptional()
  leagueId?: number

  @IsNumber()
  @IsOptional()
  sponserId?: number
}
