import type { TeamLeague } from '@prisma/client'

/**
 * 팀과 리그의 연결정보를 생성하는 서비스 인터페이스
 * @template T - 'TeamLeague'를 확장하는 제네릭 타입
 */
export interface RegisterTeamLeagueService<T extends TeamLeague> {
  /**
   * 팀과 리그의 연결 정보를 생성하고 생성된 정보를 반환합니다.
   *
   * @param {number} teamId - 연결할 팀의 Id
   * @param {number} leagueId - 연결할 리그의 Id
   * @returns {Promise<T>}
   * @throws {ConflictFoundException} 이미 존재하는 연결을 중복으로 생성하려고 하는 경우 발생
   * @throws {EntityNotExistException} 존재하지 않는 팀 또는 리그의 Id를 전달한 경우 발생
   */
  registerTeamLeague(teamId: number, leagueId: number): Promise<T>
}
