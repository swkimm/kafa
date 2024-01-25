import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty } from 'class-validator'

export class GameQueryDTO {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  start: Date

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  end: Date
}
