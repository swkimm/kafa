import { Type } from 'class-transformer'
import {
  IsAlpha,
  IsDate,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches
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

  @Matches(/^[A-Za-z][A-Za-z\s]*$/, {
    message:
      '영문 이름은 알파벳으로 시작하면서 알파벳과 공백 문자만 포함해야 합니다.'
  })
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
