import { LeagueApplyStatus } from '@prisma/client'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

/**
 * 팀과 리그의 연결을 수정하는 정보를 담은 객체
 */
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
