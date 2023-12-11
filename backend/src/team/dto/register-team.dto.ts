import { Type } from 'class-transformer'
import {
  IsAlpha,
  IsDate,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

/**
 * 팀 생성 정보를 담는 객체
 */
export class RegisterTeamDTO {
  @IsNumber()
  @IsNotEmpty()
  associationId: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsAlpha()
  @IsNotEmpty()
  globalName: string

  @IsString()
  @IsNotEmpty()
  hometown: string

  @IsAlpha()
  @IsNotEmpty()
  initial: string

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  establishedAt: Date

  @IsHexColor()
  @IsNotEmpty()
  color: string

  @IsHexColor()
  @IsOptional()
  subColor?: string
}
