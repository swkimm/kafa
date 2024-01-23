import type { ProfileService } from './profile.service.interface'

/**
 * 로스터 프로필 이미지를 관리하는 서비스 인터페이스
 * @extends {ProfileService} 이미지를 관리하는 기본 인터페이스
 */
export interface RosterProfileService extends ProfileService {
  /**
   * 로스터 프로필 이미지를 등록 또는 업데이트하고 프로필 이미지가 저장된 url을 반환합니다.
   *
   * @param {Express.Multer.File} image - 이미지 파일
   * @param {number | string} rosterId  - 프로필 이미지를 등록할 엔티티의 식별자
   * @param {number | string} accountId  - 프로필 이미지를 등록을 요청하는 계정의 식별자
   * @returns {string} 프로필 이미지가 저장된 url
   * @throws {EntityNotExistException} 전달한 식별자에 해당되는 엔티티가 존재하지 않는 경우 발생
   * @throws {ForbiddenAccessException} 매니저 계정으로 요청할 때, 계정에 연결 된 팀이 아닌 다른 팀에 요청을 전달하면 발생
   */
  upsertRosterProfile(
    image: Express.Multer.File,
    rosterId: number | string,
    accountId: number | string
  ): Promise<string>
}
