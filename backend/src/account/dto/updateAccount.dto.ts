import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

export class UpdateAccountProfileDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  profileImgUrl?: string
}
