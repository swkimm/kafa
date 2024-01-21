import type { RegisterTeamRequest, Team } from '@prisma/client'
import type { RegisterTeamRequestDTO } from '../dto/register-team-request.dto'
import type { RegisterTeamDTO } from '../dto/register-team.dto'
import type { TeamManyDTO } from '../dto/team-many.dto'
import type { UpdateTeamDTO } from '../dto/update-team.dto'
import type { DeleteTeamService } from '../interface/delete-team.service.interface'
import type { GetTeamService } from '../interface/get-team.service.interface'
import type { RegisterTeamService } from '../interface/register-team.service.interface'
import type { UpdateTeamService } from '../interface/update-team.service.interface'

/**
 * 팀 관련 비즈니스 로직을 모아주는 추상 클래스.
 * 템플릿 메서드 패턴을 사용하며, [GetTeamService], [CreateTeamService], [DeleteTeamService], [UpdateTeamService] 구현체를 생성자에서 주입받아 사용합니다.
 * @template T - 'TeamService'를 확장하는 제네릭 타입
 * @template U - '{ result:string }'를 확장하는 제네릭 타입
 * @template V - 'RegisterTeamRequest'를 확장하는 제네릭 타입
 */
export abstract class TeamService<
  T extends Team,
  U extends { result: string },
  V extends RegisterTeamRequest
> {
  constructor(
    private readonly registerTeamService: RegisterTeamService<T, V>,
    private readonly deleteTeamService: DeleteTeamService<U>,
    private readonly updateTeamService: UpdateTeamService<T, V>,
    private readonly getTeamService: GetTeamService<T, V>
  ) {}

  /**
   * 팀을 등록하고 등록된 팀 정보를 반환합니다.
   *
   * @param {registerTeam} teamDTO - 팀 생성 정보가 담긴 객체
   * @returns {Promise<T>} 등록된 팀
   * @throws {EntityNotExistException} 존재하지 않는 협회 Id를 전달할 경우 발생
   */
  async registerTeam(teamDTO: RegisterTeamDTO): Promise<T> {
    return await this.registerTeamService.registerTeam(teamDTO)
  }

  /**
   * 팀 등록을 요청을 생성하고 생성된 팀 등록 요청 정보를 반환합니다.
   *
   * @param {RegisterTeamRequestDTO} requestTeamDTO - 팀 등록 요청 정보가 담긴 객체
   * @returns {Promise<V>} 팀 등록 요청 정보
   * @throws {UnverifiedException} 인증을 완료하지 않은 계정으로 팀 등록을 요청할 경우 발생
   * @throws {EntityNotExistException} 존재하지 않는 협회 Id를 전달할 경우 발생
   * @throws {ParameterValidationException} 잘못된 팀 등록 요청 정보를 전달할 경우 발생
   * @throws {ConflictFoundException} 중복되는 팀 등록 요청 혹은 이미 존재하는 아이디나 이메일을 전달할 경우 발생
   */
  async createRegisterTeamRequest(
    requestTeamDTO: RegisterTeamRequestDTO
  ): Promise<V> {
    return await this.registerTeamService.createRegisterTeamRequest(
      requestTeamDTO
    )
  }

  /**
   * 팀을 삭제하고 삭제된 팀을 반환합니다.
   * soft delete
   *
   * @param {number} teamId
   * @returns {Promise<U>} 삭제된 팀
   * @throws {EntityNotExistException} 존재하지 않는 팀 Id를 전달할 경우 발생
   */
  async deleteTeam(teamId: number): Promise<U> {
    return await this.deleteTeamService.deleteTeam(teamId)
  }

  /**
   * 팀 정보를 업데이트 후 업데이트 된 팀 정보를 반환합니다.
   *
   * @param {UpdateTeamDTO} teamDTO - 팀 업데이트 정보가 담긴 객체
   * @param {number} teamId - 정보를 업데이트할 팀의 Id
   * @returns {Promise<T>} - 업데이트 된 팀 정보
   * @throws {EntityNotExistException} 존재하지 않는 팀의 Id를 전달할 경우 발생
   */
  async updateTeamProfile(teamDTO: UpdateTeamDTO, teamId: number): Promise<T> {
    return await this.updateTeamService.updateTeamProfile(teamDTO, teamId)
  }

  /**
   * 팀 등록 요청을 수락하고 팀을 등록한 다음 등록된 팀을 반환합니다.
   *
   * @param {number} requestId - 수락할 팀 등록 요청의 Id
   * @returns {Promise<T>} 등록된 팀
   * @throws {EntityNotExistException} 존재하지 않는 팀 등록 요청의 Id를 전달한 경우
   * @throws {ConflictFoundException} 이미 처리가 완료된 팀 등록 요청에 대해 중복 수락을 시도하는 경우
   */
  async approveRegisterTeamRequest(requestId: number): Promise<T> {
    return await this.updateTeamService.approveRegisterTeamRequest(requestId)
  }

  /**
   * 팀 등록 요청을 반려하고 처리된 팀 등록 요청을 반환합니다.
   *
   * @param {number} requestId - 반려할 팀 등록 요청의 Id
   * @param {string} reason - 반려 사유
   * @returns {Promise<V>} 반려된 팀 등록 요청
   * @throws {EntityNotExistException} 존재하지 않는 팀 등록 요청의 Id를 전달한 경우
   */
  async rejectRegisterTeamRequest(
    requestId: number,
    reason: string
  ): Promise<V> {
    return await this.updateTeamService.rejectRegisterTeamRequest(
      requestId,
      reason
    )
  }

  /**
   * 팀을 반환합니다.
   *
   * @param {number} teamId - 조회할 팀 Id
   * @returns {Promise<T>} 팀
   * @throws {EntityNotExistException} 존재하지 않는 팀 Id를 전달할 경우 발생
   */
  async getTeam(teamId: number): Promise<T> {
    return await this.getTeamService.getTeam(teamId)
  }

  /**
   * 팀 목록을 반환합니다.
   * offset based pagination
   *
   * @param {number} page - 페이지 번호
   * @param {number} [limit=10] - 한 번에 불러올 팀 수
   * @param {string} [option] - 불러올 팀의 상태
   * @returns {Promise<TeamManyDTO[]>} 팀 목록
   * @throws {ParameterValidationException} 잘못된 팀 상태를 전달한 경우 발생
   */
  async getTeams(
    page: number,
    limit?: number,
    option?: string
  ): Promise<TeamManyDTO[]> {
    const teams = await this.getTeamService.getTeams(page, limit, option)
    return teams.map((team) => {
      return {
        id: team.id,
        name: team.name,
        globalName: team.globalName,
        initial: team.initial,
        color: team.color,
        profileImgUrl: team.profileImgUrl
      }
    })
  }

  /**
   * 이름 또는 영문이름을 포함하는 팀들을 반홥합니다
   *
   * @param {string} searchTerm - 팀 이름 (국문 또는 영문)
   * @param {number} [limit=5] - 최대로 불러올 검색 수 (최대 10)
   */
  async getTeamsBySearch(
    searchTerm: string,
    limit?: number
  ): Promise<TeamManyDTO[]> {
    return await this.getTeamService.getTeamsBySearch(searchTerm, limit)
  }

  /**
   * 특정 협회에 속한 팀 목록을 반환합니다.
   *
   * @param {number} associationId - 소속 팀 목록을 조회할 협회의 Id
   * @returns {Promise<T[]>} 특정 협회에 속한 팀 목록
   * @throws {EntityNotExistException} 존재하지 않는 협회의 Id를 전달할 경우 발생
   */
  async getAssociationTeams(associationId: number): Promise<T[]> {
    return await this.getTeamService.getAssociationTeams(associationId)
  }

  /**
   * 특정 리그에 참여중인 팀 목록을 반환합니다.
   *
   * @param {number} leagueId - 참여중인 팀 목록을 조회할 리그의 Id
   * @returns {Promise<T[]>} 특정리그에 참여중인 팀 목록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  async getLeagueTeams(leagueId: number): Promise<T[]> {
    return await this.getTeamService.getLeagueTeams(leagueId)
  }

  /**
   * 특정 계정에서 요청한 팀 생성 요청 목록을 반환합니다.
   *
   * @param {number} accountId - 팀 생성 요청 목록을 조회할 계정의 Id
   * @returns {Promise<V[]>} 팀 생성 요청
   */
  async getAccountRegisterTeamRequests(accountId: number): Promise<V[]> {
    return await this.getTeamService.getAccountRegisterTeamRequests(accountId)
  }

  /**
   * 팀 생성 요청 목록을 반환합니다.
   * cursor based pagination
   *
   * @param {number} [limit=10] - 한 번에 불러올 요청 수
   * @param {number} [cursor] - 커서
   * @param {string} [option] - 불러올 팀의 상태
   * @returns {Promise<V[]>} 팀 생성 요청 목록
   * @throws {ParameterValidationException} 잘못된 팀 등록 상태를 전달할 경우 발생
   */
  async getRegisterTeamRequests(
    limit?: number,
    cursor?: number,
    option?: string
  ): Promise<V[]> {
    return await this.getTeamService.getRegisterTeamRequests(
      limit,
      cursor,
      option
    )
  }
}
