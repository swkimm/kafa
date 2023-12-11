import { Type } from 'class-transformer'
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

/**
 * 업데이트할 협회 정보를 담는 DTO
 */
export class UpdateLeagueDTO {
  @IsString()
  @IsOptional()
  name?: string

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startedAt?: Date

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endedAt?: Date

  @IsNumber()
  @IsOptional()
  associationId?: number
}
