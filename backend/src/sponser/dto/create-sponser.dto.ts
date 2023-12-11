import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

/**
 * 생성할 스폰서 정보를 담는 객체
 */
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
