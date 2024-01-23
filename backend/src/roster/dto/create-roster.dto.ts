import { GenderType, RosterStatus, RosterType } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min
} from 'class-validator'
import { Position } from '../types/position.type'

export class RequestRosterDTO {
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'globalName must only contain alphabetic characters and spaces'
  })
  @IsNotEmpty()
  globalName: string

  @IsNumber()
  @IsNotEmpty()
  teamId: number

  @IsNumber()
  @Min(1940)
  @Max(new Date().getFullYear())
  @IsNotEmpty()
  registerYear: number

  @IsEnum(RosterType)
  @IsNotEmpty()
  rosterType: RosterType

  @IsOptional()
  @Type(() => Object)
  position?: Position

  @IsNumber()
  @Min(0)
  @IsOptional()
  height?: number

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number

  @IsNumber()
  @Min(0)
  @Max(99)
  @IsOptional()
  backNumber?: number
}

export class CreateRosterDTO extends RequestRosterDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  birthday: Date

  @IsEnum(GenderType)
  @IsNotEmpty()
  gender: GenderType

  @IsEnum(RosterStatus)
  @IsOptional()
  status?: RosterStatus
}
