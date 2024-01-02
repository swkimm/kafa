import type { AccountCertification } from '@prisma/client'

/**
 * 계정의 인증서를 관리하는 서비스 인터페이스
 * @template T - 'AccountCertification' 타입을 확장하는 제네릭 타입
 */
export interface AccountCertificationService<T extends AccountCertification> {
  /**
   * 특정 계정에 인증서를 등록하고 등록된 인증서 정보를 반환합니다.
   *
   * @param {Express.Multer.File} file - 등록할 인증서 파일
   * @param accountId - 인증서를 등록할 계정의 Id
   * @returns {T} 등록된 인증서 정보
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id를 전달할 경우 발생
   * @throws {UnverifiedException} 개인 정보 인증이 완료되지 않은 계정에 해당 요청을 보낼 시 발생
   */
  upsertCertification(file: Express.Multer.File, accountId: number): Promise<T>

  /**
   * 특정 계정의 인증서 정보를 반환합니다.
   *
   * @param {number} accountId - 인증서 정보를 조회할 계정의 Id
   * @returns {T} 계정의 인증서 정보
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id를 전달할 경우 발생
   */
  getCertification(accountId: number): Promise<T>

  /**
   * 특정 계정의 인증서 존재 여부를 반환합니다.
   * @param {number} accountId - 인증서 존재 여부를 확인할 계정의 Id
   * @returns {boolean} 계정의 인증서 존재 여부
   */
  checkCertification(accountId: number): Promise<boolean>
}
