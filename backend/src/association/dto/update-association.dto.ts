import {
  IsAlpha,
  IsAlphanumeric,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

/**
 * 업데이트할 협회 정보를 담는 DTO 클래스
 */
export class UpdateAssociationDTO {
  @IsNumber()
  @IsOptional()
  parentId?: number

  @IsString()
  @IsOptional()
  name?: string

  @IsAlphanumeric()
  @IsOptional()
  globalName?: string

  @IsAlpha()
  @IsOptional()
  initial?: string
}
