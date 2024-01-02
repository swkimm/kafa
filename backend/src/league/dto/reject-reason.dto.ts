import { LeagueApplyStatus } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class RejectReasonDTO {
  @IsString()
  @IsNotEmpty()
  reason: string

  @IsEnum(LeagueApplyStatus)
  @IsOptional()
  type?: LeagueApplyStatus
}
