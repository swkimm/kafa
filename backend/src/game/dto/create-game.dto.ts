import { GameResult } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'

/**
 * 경기 생성 정보를 담는 DTO
 */
export class CreateGameDTO {
  @IsNumber()
  @IsNotEmpty()
  leagueId: number

  @IsNumber()
  @IsNotEmpty()
  homeTeamId: number

  @IsNumber()
  @IsNotEmpty()
  awayTeamId: number

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startedAt: Date

  @IsEnum(GameResult)
  @IsNotEmpty()
  result: GameResult

  @IsString()
  @IsNotEmpty()
  stadium: string
}
