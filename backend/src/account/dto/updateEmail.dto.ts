import { IsEmail, IsNotEmpty } from 'class-validator'

export class UpdateEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string
}
