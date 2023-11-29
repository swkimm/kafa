import { LeagueApplyStatus } from '@prisma/client'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

export class UpdateTeamLeagueDTO {
  @IsNumber()
  @IsNotEmpty()
  teamId: number

  @IsNumber()
  @IsNotEmpty()
  leagueId: number

  @IsEnum(LeagueApplyStatus)
  @IsNotEmpty()
  applyStatus: LeagueApplyStatus

  @IsString()
  @IsOptional()
  rejectReason?: string
}
