import { Type } from 'class-transformer'
import { IsDate, IsHexColor, IsOptional, IsString } from 'class-validator'

export class UpdateTeamDTO {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
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
