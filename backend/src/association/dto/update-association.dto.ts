import {
  IsAlpha,
  IsAlphanumeric,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

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
