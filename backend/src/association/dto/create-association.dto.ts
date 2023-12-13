import {
  IsAlpha,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUppercase
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

  @IsString()
  @IsNotEmpty()
  globalName: string

  @IsAlpha()
  @IsUppercase()
  @IsNotEmpty()
  initial: string
}
