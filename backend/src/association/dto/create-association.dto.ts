import {
  IsAlpha,
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

/**
 * 협회 생성 정보를 담는 DTO 클래스
 */
export class CreateAssociationDTO {
  @IsNumber()
  @IsOptional()
  parentId?: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsAlphanumeric()
  @IsNotEmpty()
  globalName: string

  @IsAlpha()
  @IsNotEmpty()
  initial: string
}
