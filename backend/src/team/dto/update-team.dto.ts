import { Type } from 'class-transformer'
import {
  IsDate,
  IsHexColor,
  IsOptional,
  IsString,
  Matches
} from 'class-validator'

/**
 * 수정할 팀 정보를 담는 객체
 */
export class UpdateTeamDTO {
  @IsString()
  @IsOptional()
  name?: string

  @Matches(/^[A-Za-z][A-Za-z\s]*$/, {
    message:
      '영문 이름은 알파벳으로 시작하면서 알파벳과 공백 문자만 포함해야 합니다.'
  })
  @IsOptional()
  globalName?: string

  @IsString()
  @IsOptional()
  hometown?: string

  @IsString()
  @IsOptional()
  initial?: string

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  establishedAt?: Date

  @IsHexColor()
  @IsOptional()
  color?: string

  @IsHexColor()
  @IsOptional()
  subColor?: string
}
