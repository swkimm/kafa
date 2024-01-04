import type { Record } from '@prisma/client'
import type { CreateRecordDTO } from '../dto/create-record.dto'
import type { RecordDTO } from '../dto/record.dto'
import type { UpdateRecordDTO } from '../dto/update-record.dto'
import type { CreateRecordService } from '../interface/create-record.service.interface'
import type { DeleteRecordService } from '../interface/delete-record.service.interface'
import type { GetRecordService } from '../interface/get-record.service.interface'
import type { UpdateRecordService } from '../interface/update-record.service.interface'

export abstract class RecordService<T extends Record> {
  constructor(
    private readonly getRecordService: GetRecordService,
    private readonly createRecordService: CreateRecordService<T>,
    private readonly updateRecordService: UpdateRecordService<T>,
    private readonly deleteRecordService: DeleteRecordService<T>
  ) {}

  /**
   * 경기 기록을 반환합니다
   *
   * @param {number} gameId - 조회할 경기의 Id
   * @returns {Promise<RecordDTO[]>} 경기 기록
   * @throws {EntityNotExistException} 존재하지 않는 경기의 Id를 전달할 경우 발생
   */
  async getGameRecords(gameId: number): Promise<RecordDTO[]> {
    return await this.getRecordService.getGameRecords(gameId)
  }

  /**
   * 리그의 경기 기록을 반환합니다
   *
   * @param {number} leagueId - 조회할 리그의 Id
   * @returns {Promise<RecordDTO[]>} 경기 기록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  async getLeagueRecords(leagueId: number): Promise<RecordDTO[]> {
    return await this.getRecordService.getLeagueRecords(leagueId)
  }

  /**
   * 개인의 경기 기록을 반환합니다
   *
   * @param {number} rosterId - 조회할 로스터의 Id
   * @returns {Promise<RecordDTO[]>} 경기 기록
   * @throws {EntityNotExistException} 존재하지 않는 로스터의 Id를 전달할 경우 발생
   * @throws {UnprocessableDataException} 선수 로스터가 아닌 로스터에 해당 요청을 보낼 경우 발생
   */
  async getPersonalRecords(rosterId: number): Promise<RecordDTO[]> {
    return await this.getRecordService.getPersonalRecords(rosterId)
  }

  /**
   * 기록을 생성하고 생성된 기록을 반환합니다
   *
   * @param {number} rosterId - 기록 대상이 되는 로스터의 Id
   * @param {number} gameId - 기록 대상이 되는 경기의 Id
   * @param {CreateRecordDTO} recordDTO - 생성할 기록 정보가 담긴 객체
   * @returns {Promise<T>} 생성된 기록
   * @throws {EntityNotExistException} 존재하지 않는 로스터 또는 경기의 Id를 전달할 경우 발생
   * @throws {UnprocessableDataException} 해당 경기에 참여한 팀 또는 리그에 소속된 로스터가 아닌 로스터의 Id를 전달할 경우 발생
   */
  async createRecord(
    rosterId: number,
    gameId: number,
    recordDTO: CreateRecordDTO
  ): Promise<T> {
    return await this.createRecordService.createRecord(
      rosterId,
      gameId,
      recordDTO
    )
  }

  /**
   * 경기 기록을 수정하고 수정된 기록을 반환합니다
   *
   * @param recordId - 수정할 기록의 Id
   * @param recordDTO - 수정할 기록 정보가 담긴 객체
   * @returns {Promise<T>} 수정된 기록
   * @throws {EntityNotExistException} 존재하지 않는 기록의 Id를 전달할 경우 발생
   */
  async updateRecord(recordId: number, recordDTO: UpdateRecordDTO): Promise<T> {
    return await this.updateRecordService.updateRecord(recordId, recordDTO)
  }

  /**
   * 경기 기록을 삭제하고 삭제된 기록을 반환합니다
   *
   * @param {number} recordId - 삭제할 기록의 Id
   * @returns {Promise<T>} 삭제된 기록
   * @throws {EntityNotExistException} 존재하지 않는 기록의 Id를 전달할 경우 발생
   */
  async deleteRecord(recordId: number): Promise<T> {
    return await this.deleteRecordService.deleteRecord(recordId)
  }
}
