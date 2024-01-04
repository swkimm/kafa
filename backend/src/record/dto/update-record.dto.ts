import { RecordType } from '@prisma/client'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateRecordDTO {
  @IsString()
  @IsOptional()
  unit?: string

  @IsNumber()
  @IsOptional()
  score?: number

  @IsEnum(RecordType)
  @IsOptional()
  type?: RecordType
}
