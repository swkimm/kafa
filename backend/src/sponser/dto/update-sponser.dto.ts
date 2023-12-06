import { IsOptional, IsString, IsUrl } from 'class-validator'

export class UpdateSponserDTO {
  @IsString()
  @IsOptional()
  name?: string

  @IsUrl()
  @IsOptional()
  websiteUrl?: string

  @IsUrl()
  @IsOptional()
  profileImgUrl?: string
}
