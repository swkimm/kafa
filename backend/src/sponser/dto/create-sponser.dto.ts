import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

export class CreateSponserDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsUrl()
  @IsNotEmpty()
  websiteUrl: string

  @IsUrl()
  @IsOptional()
  profileImgUrl?: string
}
