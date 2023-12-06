import { Type } from 'class-transformer'
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

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
