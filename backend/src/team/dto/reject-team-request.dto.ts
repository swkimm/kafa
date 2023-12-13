import { IsNotEmpty, IsString } from 'class-validator'

export class RejectTeamRequestDTO {
  @IsString()
  @IsNotEmpty()
  reason: string
}
