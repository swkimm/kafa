import type { RegisterTeamRequest, Team } from '@prisma/client'
import type { UpdateTeamDTO } from '../dto/update-team.dto'

/**
 * 팀 정보 업데이트와 관련된 서비스 인터페이스
 * @template T - 'Team' 클래스를 확장하는 제네릭 타입
 * @template U - 'RegisterTeamRequest' 클래스를 확장하는 제네릭 타입
 */
export interface UpdateTeamService<
  T extends Team,
  U extends RegisterTeamRequest
> {
  /**
   * 팀 정보를 업데이트 후 업데이트 된 팀 정보를 반환합니다.
   *
   * @param {UpdateTeamDTO} teamDTO - 팀 업데이트 정보가 담긴 객체
   * @param {number} teamId - 정보를 업데이트할 팀의 Id
   * @returns {Promise<T>} - 업데이트 된 팀 정보
   * @throws {EntityNotExistException} 존재하지 않는 팀의 Id를 전달할 경우 발생
   */
  updateTeamProfile(teamDTO: UpdateTeamDTO, teamId: number): Promise<T>

  /**
   * 팀 등록 요청을 수락하고 팀을 등록한 다음 등록된 팀을 반환합니다.
   *
   * @param {number} requestId - 수락할 팀 등록 요청의 Id
   * @returns {Promise<T>} 등록된 팀
   * @throws {EntityNotExistException} 존재하지 않는 팀 등록 요청의 Id를 전달한 경우
   * @throws {ConflictFoundException} 이미 처리가 완료된 팀 등록 요청에 대해 중복 수락을 시도하는 경우
   */
  approveRegisterTeamRequest(requestId: number): Promise<T>

  /**
   * 팀 등록 요청을 반려하고 처리된 팀 등록 요청을 반환합니다.
   *
   * @param {number} requestId - 반려할 팀 등록 요청의 Id
   * @param {string} reason - 반려 사유
   * @returns {Promise<U>} 반려된 팀 등록 요청
   * @throws {EntityNotExistException} 존재하지 않는 팀 등록 요청의 Id를 전달한 경우
   */
  rejectRegisterTeamRequest(requestId: number, reason: string): Promise<U>
}
