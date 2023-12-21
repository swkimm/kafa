import { IsOptional, IsString, IsUrl } from 'class-validator'

export class UpdateAccountProfileDTO {
  @IsString()
  @IsOptional()
  name?: string

  @IsUrl()
  @IsOptional()
  profileImgUrl?: string
}
