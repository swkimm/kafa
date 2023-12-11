import { IsOptional, IsString, IsUrl } from 'class-validator'

/**
 * 스폰서 업데이트 정보를 담는 객체
 */
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
