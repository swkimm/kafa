import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateAccountProfileDTO {
  @IsString()
  @IsNotEmpty()
  name: string
}
