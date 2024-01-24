import type { Game } from '@prisma/client'
import type { CreateGameDTO } from '../dto/create-game.dto'
import type { GameManyDTO } from '../dto/game-many.dto'
import type { GameWithLeagueAndAssociationDTO } from '../dto/game-with-league-association.dto'
import type { GameWithLeagueDTO } from '../dto/game-with-league.dto'
import type { UpdateGameDTO } from '../dto/update-game.dto'
import type { CreateGameService } from '../interface/create-game.service.interface'
import type { DeleteGameService } from '../interface/delete-game.service.interface'
import type { GetGameService } from '../interface/get-game.service.interface'
import type { UpdateGameService } from '../interface/update-game.service.interface'

/**
 * 경기관련 비즈니스 로직을 모아주는 추상 클래스.
 * 템플릿 메서드 패턴을 사용하며, [GetGameService], [CreateGameService], [DeleteGameService], [UpdateGameService] 구현체를 생성자에서 주입받아 사용합니다.
 * @template T - 'Game' 타입을 확장하는 제네릭 타입
 */
export abstract class GameService<T extends Game> {
  constructor(
    private readonly getGameService: GetGameService<T>,
    private readonly updateGameService: UpdateGameService<T>,
    private readonly createGameService: CreateGameService<T>,
    private readonly deleteGameService: DeleteGameService<T>
  ) {}

  /**
   * 경기 정보를 반환합니다.
   *
   * @param {number} gameId - 조회할 경기의 Id
   * @returns {Promise<T>} 경기정보
   * @throws {EntityNotExistException} 존재하지 않는 경기의 Id를 전달할 경우 발생
   */
  async getGame(gameId: number): Promise<T> {
    return await this.getGameService.getGame(gameId)
  }

  /**
   * 경기 목록을 조회합니다.
   * Cursor based pagination 을 사용합니다.
   *
   * @param {number} [cursor] - 현재 페이지의 커서
   * @param {number} [limit=10] - 한 번에 불러올 경기 수
   * @returns {Promise<T[]>} 경기 목록
   */
  async getGames(cursor?: number, limit?: number): Promise<T[]> {
    return await this.getGameService.getGames(cursor, limit)
  }

  /**
   * 특정 리그의 경기 목록을 조회합니다.
   * Cursor based pagination 을 사용합니다.
   *
   * @param {number} leagueId - 경기 목록을 불러올 리그의 Id
   * @param {number} [cursor] - 현재 페이지의 커서
   * @param {number} [limit=10] - 한 번에 불러올 경기 수
   * @returns {Promise<T[]>} 경기 목록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  async getGamesByLeagueId(
    leagueId: number,
    cursor?: number,
    limit?: number
  ): Promise<T[]> {
    return await this.getGameService.getGamesByLeagueId(leagueId, cursor, limit)
  }

  /**
   * 특정 리그의 날짜 범위에 해당하는 경기 목록을 반환합니다
   *
   * @param {number} leagueId - 리그 Id
   * @param {Date} startDate - 시작날짜
   * @param {Date} endDate - 종료날짜
   * @returns {Promise<GameWithLeagueAndAssociationDTO[]>}
   * @throws {BadRequestException} 시작날짜와 종료날짜가 역순인 경우 발생
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  async getGamesByLeagueIdAndDate(
    leagueId: number,
    startDate: Date,
    endDate: Date
  ): Promise<GameWithLeagueAndAssociationDTO[]> {
    return await this.getGameService.getGamesByLeagueIdAndDate(
      leagueId,
      startDate,
      endDate
    )
  }

  /**
   * 특정 팀의 특정 리그에서의 경기 목록을 반환합니다
   *
   * @param {number} leagueId - 경기 목록을 불러올 리그의 Id
   * @param {number} teamId - 경기 목록을 불러올 팀의 Id
   * @returns {Promise<GameManyDTO[]>} 경기 목록
   */
  async getGamesByLeagueIdAndTeamId(
    leagueId: number,
    teamId: number
  ): Promise<GameManyDTO[]> {
    return await this.getGameService.getGamesByLeagueIdAndTeamId(
      leagueId,
      teamId
    )
  }

  /**
   * 최근 종료된 경기목록을 반환합니다
   *
   * @returns {Promise<GameWithLeagueDTO[]>} 최근 종료된 경기 목록
   */
  async getCurrentlyEndedGames(): Promise<GameWithLeagueDTO[]> {
    return await this.getGameService.getCurrentlyEndedGames()
  }

  /**
   * 다가오는 경기목록을 반환합니다
   *
   * @returns {Promise<GameWithLeagueDTO[]>} 다가오는 경기 목록
   */
  async getUpcommingGames(): Promise<GameWithLeagueDTO[]> {
    return await this.getGameService.getUpcommingGames()
  }

  /**
   * 특정 팀의 경기 목록을 반환합니다
   *
   * @param {number} teamId - 경기 목록을 조회할 팀의 Id
   * @param {number} page - 불러올 페이지 번호
   * @param {number} [limit=5] - 한 번에 불러올 경기 수
   * @returns {Promise<GameWithLeagueDTO[]>} 팀의 경기 목록
   * @throws {EntityNotExistException} 존재하지 않는 팀의 Id를 전달할 경우 발생
   */
  async getGamesByTeamId(
    teamId: number,
    page: number,
    limit?: number
  ): Promise<GameWithLeagueDTO[]> {
    return await this.getGameService.getGamesByTeamId(teamId, page, limit)
  }

  /**
   * 경기를 정보를 변경하고 변경된 경기 정보를 반환합니다.
   *
   * @param {CreateGameDTO} gameDTO - 수정할 경기 정보를 담은 객체
   * @returns {Promise<T>} 변경된 경기 정보
   * @throws {EntityNotExistException} 존재하지 않는 경기나 리그, 팀의 id 값을 전달할 경우 발생
   * @throws {ParameterValidationException} 홈 팀과 어웨이 팀이 같을 경우 발생
   */
  async updateGame(gameId: number, gameDTO: UpdateGameDTO): Promise<T> {
    return await this.updateGameService.updateGame(gameId, gameDTO)
  }

  /**
   * 경기를 생성하고 생성한 경기를 반환합니다.
   *
   * @param {CreateGameDTO} gameDTO - 경기 생성 정보를 담은 객체
   * @returns {Promise<T>} 생성된 경기
   * @throws {EntityNotExistException} 존재하지 않는 리그나 팀의 id 값을 전달할 경우 발생
   * @throws {ParameterValidationException} 홈 팀과 어웨이 팀이 같을 경우 발생
   */
  async createGame(gameDTO: CreateGameDTO): Promise<T> {
    return await this.createGameService.createGame(gameDTO)
  }

  /**
   * 경기를 삭제 하고 삭제된 경기를 반환합니다.
   *
   * @param {number} gameId - 삭제할 경기의 Id
   * @returns {Promise<T>} 경기정보
   * @throws {EntityNotExistException} 존재하지 않는 경기의 Id를 전달할 경우 발생
   */
  async deleteGame(gameId: number): Promise<T> {
    return await this.deleteGameService.deleteGame(gameId)
  }
}
