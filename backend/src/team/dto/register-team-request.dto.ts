import { Type } from 'class-transformer'
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'
import { RegisterTeamDTO } from './register-team.dto'

/**
 * 팀 등록 요청 정보를 담는 객체
 */
export class RegisterTeamRequestDTO {
  @IsNotEmpty()
  @Type(() => RegisterTeamDTO)
  data: RegisterTeamDTO

  @IsNumber()
  @IsOptional()
  accountId?: number

  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  teamAccountUsername: string
}
