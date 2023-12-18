import type { Score } from '@prisma/client'
import type { CreateScoreDTO } from '../dto/create-score.dto'
import type { UpdateScoreDTO } from '../dto/update-score.dto'
import type { CreateScoreService } from '../interface/create-score.service.interface'
import type { GetScoreService } from '../interface/get-scores.service.interface'
import type { UpdateScoreService } from '../interface/update-score.service.interface'

/**
 * 점수관련 비즈니스 로직을 모아주는 추상 클래스.
 * 템플릿 메서드 패턴을 사용하며, [GetScoreService], [CreateScoreService], [UpdateScoreService] 구현체를 생성자에서 주입받아 사용합니다.
 * @template T - 'Score' 타입을 확장하는 제네릭 타입
 */
export abstract class ScoreService<T extends Score> {
  constructor(
    private readonly getScoreService: GetScoreService<T>,
    private readonly updateScoreService: UpdateScoreService<T>,
    private readonly createScoreService: CreateScoreService<T>
  ) {}

  /**
   * 경기의 점수를 반환합니다.
   *
   * @param {number} gameId -점수를 조회할 경기의 Id
   * @returns {T} 경기의 점수
   * @throws {EntityNotExistException} 존재하지 않는 경기의 Id를 전달할 경우 발생
   */
  async getScore(gameId: number): Promise<T> {
    return await this.getScoreService.getScore(gameId)
  }

  /**
   * 경기의 점수를 업데이트하고 변경된 점수를 반환합니다.
   * 전달한 점수 배열로 부터 총점을 계산하여 등록합니다.
   *
   * @param {number} gameId - 점수를 업데이트 할 경기의 Id
   * @param {UpdateScoreDTO} scoreDTO - 업데이트할 점수 정보가 담긴 객체
   * @returns {T} 업데이트 된 점수
   * @throws {EntityNotExistException} 존재하지 않는 경기의 Id를 전달할 경우 발생
   * @throws {ParameterValidationException} 잘못된 연장여부 또는 스코어 정보를 전달할 경우 발생
   */
  async updateScore(gameId: number, scoreDTO: UpdateScoreDTO): Promise<T> {
    return await this.updateScoreService.updateScore(gameId, scoreDTO)
  }

  /**
   * 경기의 점수를 생성하고 생성한 점수를 반환합니다.
   *
   * @param {number} gameId - 점수를 생성할 게임의 Id
   * @param {CreateScoreDTO} scoreDTO - 생성할 점수 정보가 담긴 객체
   * @returns {T} 생성한 점수
   * @throws {EntityNotExistException} 존재하지 않는 경기의 Id를 전달할 경우 발생
   * @throws {ConflictFoundException} 이미 스코어가 존재하는 경기에 새로 스코어를 생성 하려고 하는 경우 발생
   */
  async createScore(gameId: number, scoreDTO: CreateScoreDTO): Promise<T> {
    return await this.createScoreService.createScore(gameId, scoreDTO)
  }
}
