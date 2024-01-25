import { GenderType } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator'

export class RosterCredentialDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: '생년월일은 yyyy-mm-dd 형식을 따라야 합니다'
  })
  @IsNotEmpty()
  birthday: string

  @IsEnum(GenderType)
  @IsNotEmpty()
  gender: GenderType
}
