import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator'

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
