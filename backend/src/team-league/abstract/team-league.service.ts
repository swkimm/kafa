import type { TeamLeague } from '@prisma/client'
import type { UpdateTeamLeagueDTO } from '../dto/updateTeamLeague.dto'
import type { GetTeamLeagueService } from '../interface/get-team-league.service.interface'
import type { RegisterTeamLeagueService } from '../interface/register-team-league.service.interface'
import type { UpdateTeamLeagueService } from '../interface/update-team-league.service.interface'

/**
 * 팀과 리그를 중계하는 서브 모듈
 * 템플릿 메서드 패턴을 사용하며, [GetTeamLeagueService], [CreateTeamLeagueService], [UpdateTeamLeagueService] 구현체를 생성자에서 주입받아 사용합니다.
 * @template T - 'TeamLeague' 클래스를 확장하는 제네릭 타입
 */
export abstract class TeamLeagueService<T extends TeamLeague> {
  constructor(
    private readonly getTeamLeagueService: GetTeamLeagueService<T>,
    private readonly registerTeamLeagueService: RegisterTeamLeagueService<T>,
    private readonly updateTeamLeagueService: UpdateTeamLeagueService<T>
  ) {}

  /**
   * 팀과 리그의 연결 정보를 반환합니다.
   *
   * @param {number} teamId - 연결 정보를 조회할 팀의 Id
   * @param {number} leagueId - 연결 정보를 조회할 리그의 Id
   * @returns {T} 팀과 리그의 연결 정보
   * @throws {EntityNotExistException} 해당하는 연결 정보가 없을 경우 발생
   */
  async getTeamLeague(teamId: number, leagueId: number): Promise<T> {
    return await this.getTeamLeagueService.getTeamLeague(teamId, leagueId)
  }

  /**
   * 특정 리그의 팀과 리그 연결 정보 목록을 반환합니다.
   *
   * @param {number} leagueId - 조회할 리그의 Id
   * @param {string} [option='Approved'] - 조회할 연결 정보의 리그 등록 승인 상태
   * @returns {Promise<T[]>} 해당 리그의 팀과 리그의 연결 정보 목록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달한 경우 발생
   * @throws {ParamterValidationException} 유효하지 않은 옵션 값을 전달할 경우 발생
   */
  async getTeamLeaguesByLeagueId(
    leagueId: number,
    option?: string
  ): Promise<T[]> {
    return await this.getTeamLeagueService.getTeamLeaguesByLeagueId(
      leagueId,
      option
    )
  }

  /**
   * 특정 팀의 팀과 리그 연결 정보 목록을 반환합니다.
   *
   * @param {number} teamId - 조회할 팀의 Id
   * @param {string} [option='Approved'] - 조회할 연결 정보의 리그 등록 승인 상태
   * @returns {Promise<T[]>} 해당 팀의 팀과 리그의 연결 정보 목록
   * @throws {EntityNotExistException} 존재하지 않는 팀의 Id를 전달한 경우 발생
   * @throws {ParamterValidationException} 유효하지 않은 옵션 값을 전달할 경우 발생
   */
  async getTeamLeaguesByTeamId(teamId: number, option?: string): Promise<T[]> {
    return await this.getTeamLeagueService.getTeamLeaguesByTeamId(
      teamId,
      option
    )
  }

  /**
   * 팀과 리그의 연결 정보를 생성하고 생성된 정보를 반환합니다.
   *
   * @param {number} teamId - 연결할 팀의 Id
   * @param {number} leagueId - 연결할 리그의 Id
   * @returns {Promise<T>}
   * @throws {ConflictFoundException} 이미 존재하는 연결을 중복으로 생성하려고 하는 경우 발생
   * @throws {EntityNotExistException} 존재하지 않는 팀 또는 리그의 Id를 전달한 경우 발생
   */
  async registerTeamLeague(teamId: number, leagueId: number): Promise<T> {
    return await this.registerTeamLeagueService.registerTeamLeague(
      teamId,
      leagueId
    )
  }

  /**
   * 팀과 리그의 연결 정보를 업데이트 하고 업데이트 된 팀과 리그의 연결 정보를 반환합니다.
   *
   * @param {UpdateTeamLeagueDTO} teamLeagueDTO - 업데이트할 팀과 리그의 연결정보를 담은 객체
   * @returns {Promise<T>} 업데이트된 팀과 리그의 연결 정보
   * @throws {ParameterValidationException} 업데이트할 내용이 담긴 객체의 타입 또는 값이 부적절할 경우 발생
   * @throws {EntityNotExistException} 존재하지 않는 팀과 리그의 연결 정보를 전달할 경우 발생
   */
  async updateTeamLeague(teamLeagueDTO: UpdateTeamLeagueDTO): Promise<T> {
    return await this.updateTeamLeagueService.updateTeamLeague(teamLeagueDTO)
  }
}
