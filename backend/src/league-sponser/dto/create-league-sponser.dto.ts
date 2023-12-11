import { IsNotEmpty, IsNumber } from 'class-validator'

/**
 * 리그와 스폰서 연결을 생성 정보를 담은 객체
 */
export class CreateLeagueSponserDTO {
  @IsNumber()
  @IsNotEmpty()
  leagueId: number

  @IsNumber()
  @IsNotEmpty()
  sponserId: number
}
