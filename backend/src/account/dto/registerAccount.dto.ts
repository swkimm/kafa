import { Type } from 'class-transformer'
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword
} from 'class-validator'

export class RegisterAccountDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  username: string

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minLowercase: 1,
    minUppercase: 0
  })
  @IsNotEmpty()
  password: string

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  birthday: Date

  @IsEmail()
  @IsNotEmpty()
  email: string
}
