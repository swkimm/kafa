import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { RegisterTeamDTO } from './register-team.dto'

export class RegisterTeamRequestDTO {
  @IsNotEmpty()
  @Type(() => RegisterTeamDTO)
  data: RegisterTeamDTO

  @IsNumber()
  @IsOptional()
  accountId?: number

  @IsString()
  @IsNotEmpty()
  teamAccountUsername: string
}
