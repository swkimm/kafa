import type { RegisterTeamRequest, Team } from '@prisma/client'
import type { RegisterTeamRequestDTO } from '../dto/register-team-request.dto'
import type { RegisterTeamDTO } from '../dto/register-team.dto'

/**
 * 팀 등록과 관련된 서비스 인터페이스
 * @template T - 'Team' 클래스를 확장하는 제네릭 타입
 * @template U - 'RegisterTeamRequest' 클래스를 확장하는 제네릭 타입
 */
export interface RegisterTeamService<
  T extends Team,
  U extends RegisterTeamRequest
> {
  /**
   * 팀을 등록하고 등록된 팀 정보를 반환합니다.
   *
   * @param {registerTeam} teamDTO - 팀 생성 정보가 담긴 객체
   * @returns {Promise<T>} 등록된 팀
   * @throws {EntityNotExistException} 존재하지 않는 협회 Id를 전달할 경우 발생
   */
  registerTeam(teamDTO: RegisterTeamDTO): Promise<T>

  /**
   * 팀 등록을 요청을 생성하고 생성된 팀 등록 요청 정보를 반환합니다.
   *
   * @param {RegisterTeamRequestDTO} requestTeamDTO - 팀 등록 요청 정보가 담긴 객체
   * @returns {Promise<U>} 팀 등록 요청 정보
   * @throws {UnverifiedException} 인증을 완료하지 않은 계정으로 팀 등록을 요청할 경우 발생
   * @throws {EntityNotExistException} 존재하지 않는 협회 Id를 전달할 경우 발생
   * @throws {ParameterValidationException} 잘못된 팀 등록 요청 정보를 전달할 경우 발생
   * @throws {ConflictFoundException} 중복되는 팀 등록 요청 혹은 이미 존재하는 아이디나 이메일을 전달할 경우 발생
   */
  createRegisterTeamRequest(requestTeamDTO: RegisterTeamRequestDTO): Promise<U>
}
