import { IsNumber, IsOptional } from 'class-validator'

/**
 * 리그와 스폰서 연결 정보 수정 내용을 담은 객체
 */
export class UpdateLeagueSponserDTO {
  @IsNumber()
  @IsOptional()
  leagueId?: number

  @IsNumber()
  @IsOptional()
  sponserId?: number
}
