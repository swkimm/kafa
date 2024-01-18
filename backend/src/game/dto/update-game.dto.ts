import { GameResult } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

/**
 * 경기 변경 정보를 담는 DTO
 */
export class UpdateGameDTO {
  @IsNumber()
  @IsOptional()
  leagueId?: number

  @IsString()
  @IsOptional()
  name?: string

  @IsNumber()
  @IsOptional()
  homeTeamId?: number

  @IsNumber()
  @IsOptional()
  awayTeamId?: number

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startedAt?: Date

  @IsEnum(GameResult)
  @IsOptional()
  result?: GameResult

  @IsString()
  @IsOptional()
  stadium?: string
}
