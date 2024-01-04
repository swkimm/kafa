import { RecordType } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateRecordDTO {
  @IsString()
  @IsNotEmpty()
  unit: string

  @IsNumber()
  @IsNotEmpty()
  score: number

  @IsEnum(RecordType)
  @IsNotEmpty()
  type: RecordType
}
