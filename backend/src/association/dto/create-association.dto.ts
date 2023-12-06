import {
  IsAlpha,
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

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
