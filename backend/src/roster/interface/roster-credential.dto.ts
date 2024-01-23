import { GenderType } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class RosterCredentialDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  birthday: Date

  @IsEnum(GenderType)
  @IsNotEmpty()
  gender: GenderType
}
