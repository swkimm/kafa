import type { AccountCredential } from '@prisma/client'
import type { CreateAccountCredentialDTO } from '../dto/createAccountCredential.dto'

/**
 * 계정의 개인 정보를 관리하는 서비스 인터페이스
 * @template T - 'AccountCredential' 타입을 확장하는 제네릭 타입
 */
export interface AccountCredentialService<T extends AccountCredential> {
  /**
   * 특정 계정의 개인 인증 여부를 반환합니다.
   *
   * @param {number} accountId - 개인 인증 여부를 조회할 계정의 Id
   * @returns {Promise<boolean>} 계정의 개인인증 여부
   */
  checkCredential(accountId: number): Promise<boolean>

  /**
   * 특정 계정의 개인 인증 정보를 반환합니다.
   *
   * @param {number} accountId - 개인 인증 정보를 조회할 계정의 Id
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id를 전달할 경우 발생
   */
  getCredential(accountId: number): Promise<T>

  /**
   * 특정 계정의 개인 인증 정보를 생성하고 생성된 정보를 반환합니다.
   *
   * @param {number} accountId - 개인 인증 정보를 설정할 계정의 Id
   * @param {CreateAccouncCredentialDTO} accountDTO - 설정할 개인 인증 정보가 담긴 객체
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id를 전달할 경우 발생
   */
  createCredential(
    accountId: number,
    accountDTO: CreateAccountCredentialDTO
  ): Promise<T>
}
