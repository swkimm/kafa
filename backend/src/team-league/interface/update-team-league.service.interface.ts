import type { UpdateTeamLeagueDTO } from '../dto/updateTeamLeague.dto'

/**
 * 팀과 리그의 연결정보를 업데이트하는 서비스 인터페이스
 * @template T - 'TeamLeague'를 확장하는 제네릭 타입
 */
export interface UpdateTeamLeagueService<T> {
  /**
   * 팀과 리그의 연결 정보를 업데이트 하고 업데이트 된 팀과 리그의 연결 정보를 반환합니다.
   *
   * @param {UpdateTeamLeagueDTO} teamLeagueDTO - 업데이트할 팀과 리그의 연결정보를 담은 객체
   * @returns {Promise<T>} 업데이트된 팀과 리그의 연결 정보
   * @throws {ParameterValidationException} 업데이트할 내용이 담긴 객체의 타입 또는 값이 부적절할 경우 발생
   * @throws {EntityNotExistException} 존재하지 않는 팀과 리그의 연결 정보를 전달할 경우 발생
   */
  updateTeamLeague(teamLeagueDTO: UpdateTeamLeagueDTO): Promise<T>
}
