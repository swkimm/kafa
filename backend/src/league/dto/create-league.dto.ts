import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator'

/**
 * 협회 생성 정보를 담는 DTO
 */
export class CreateLeagueDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startedAt: Date

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endedAt: Date

  @IsNumber()
  @IsNotEmpty()
  associationId: number
}
