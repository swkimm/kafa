import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty } from 'class-validator'

export class GetGameQuery {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date
}
