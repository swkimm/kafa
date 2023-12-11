import type { Role } from '@prisma/client'
import type { AccountDTO } from './dto/account.dto'
import type { RegisterAccountDTO } from './dto/registerAccount.dto'
import type { UpdateAccountProfileDTO } from './dto/updateAccount.dto'
import type { UpdateEmailDTO } from './dto/updateEmail.dto'
import type { UpdatePasswordDTO } from './dto/updatePassword.dto'

/**
 * 계정 관리 서비스 인터페이스
 */
export interface AccountService {
  /**
   * 특정 계정의 권한을 반환합니다.
   *
   * @param {number} accountId - 권한을 찾을 계정의 Id
   * @returns {Promise<Role>} 계정의 권한 (ENUM)
   * @throws {EntityNotExistException} 존재하지 않는 계정 Id를 전달할 경우 발생
   */
  getAccountRole(accountId: number): Promise<{
    role: Role
  }>

  /**
   * 특정 계정의 비밀번호 업데이트 날짜를 현재 시간으로 변경합니다.
   *
   * @param {number} accountId - 비밀번호 업데이트 날짜를 바꿀 계정의 Id
   * @returns {Promise<void>}
   * @throws {EntityNotExistException} 존재하지 않는 계정 Id를 전달할 경우 발생
   */
  updateLastPasswordChanged(accountId: number): Promise<void>

  /**
   * 특정 권한으로 계정을 생성하고 생성된 계정의 기본 정보를 반환합니다.
   *
   * @param {RegisterAccountDTO} accountDTO - 등록할 계정의 정보를 담은 객체
   * @param {Role} role - 계정에 할당할 권한
   * @returns {Promise<AccountDTO>} 생성된 계정의 기본 정보
   * @throws {ConflictFoundException} 이미 존재하는 이메일 주소나 username을 전달한 경우 발생
   */
  registerAccount(
    accountDTO: RegisterAccountDTO,
    role: Role
  ): Promise<AccountDTO>

  /**
   * 팀과 매니저 계정을 연결하고 연결된 계정의 기본 정보를 반환합니다.
   *
   * @param {number} accountId - 연결할 계정의 Id
   * @param {number} teamId - 연결할 팀의 Id
   * @returns {Promise<AccountDTO>} 연결된 계정의 기본 정보
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id 나 팀의 Id 값을 전달한 경우 발생
   */
  mappingManagerAccount(accountId: number, teamId: number): Promise<AccountDTO>

  /**
   * 이메일 주소로 전송된 인증번호를 검증하고 결과를 반환합니다.
   *
   * @param {string | number} accountId - 이메일 주소를 인증할 계정의 Id
   * @param {string} code - 인증번호
   * @returns {Promise<{result: string}>} 인증결과
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id 나 팀의 Id 값을 전달한 경우 발생
   */
  verifyEmail(
    accountId: string | number,
    code?: string
  ): Promise<{ result: string }>

  /**
   * 계정의 이메일 변경 요청을 생성합니다.
   *
   * @param {UpdateEmailDTO} accountDTO - 변경할 이메일에 대한 정보를 담은 객체
   * @param {number} accountId - 이메일을 변경할 계정의 Id
   * @returns {Promise<{result: string}>} 요청 결과
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id 값을 전달한 경우 발생
   */
  updateEmail(
    accountDTO: UpdateEmailDTO,
    accountId: number
  ): Promise<{ result: string }>

  /**
   * 변경할 이메일 주소로 전송된 인증번호를 검증하고 결과를 반환합니다.
   *
   * @param {string | number} accountId - 업데이트할 이메일 주소를 인증할 계정의 Id
   * @param {string} code - 인증번호
   * @returns {Promise<{result: string}>} 인증결과
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id 나 팀의 Id 값을 전달한 경우 발생
   */
  verifyUpdateEmail(
    accountId: string | number,
    code?: string
  ): Promise<{ result: string }>

  /**
   * 특정 계정의 프로필 정보를 반홥합니다.
   *
   * @param {number} accountId - 프로필 정보를 불러올 계정의 Id
   * @returns {Promise<AccoundDTO>} 계정의 프로필 정보
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id를 전달했을 때 발생
   */
  getAccountProfile(accountId: number): Promise<AccountDTO>

  /**
   * 특정 계정의 프로필 정보를 변경하고 변경된 프로필 정보를 반홥합니다.
   *
   * @param {UpdateAccountProfileDTO} accountDTO - 계정 업데이트 정보를 담은 객체
   * @param {number} accountId - 프로필 정보
   * @returns {Promise<AccoundDTO>} 계정의 프로필 정보
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id를 전달했을 때 발생
   */
  updateAccountProfile(
    accountDTO: UpdateAccountProfileDTO,
    accountId: number
  ): Promise<AccountDTO>

  /**
   * [미구현] 비밀번호 초기화 기능
   */
  requestUpdatePassword(accountId: number): Promise<{ result: string }>

  /**
   * 특정 계정의 프로필 정보를 변경하고 변경된 프로필 정보를 반홥합니다.
   *
   * @param {UpdatePasswordDTO} accountDTO - 현재 비밀번호와 변경할 비밀번호를 담은 객체
   * @param {number} accountId - 비밀번호를 변경할 계정의 Id
   * @returns {Promise<{result: string}>} 비밀번호 변경 결과
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id를 전달했을 때 발생
   */
  updatePassword(
    accountDTO: UpdatePasswordDTO,
    accountId: number
  ): Promise<{ result: string }>

  /**
   * 특정 계정을 삭제하고 삭제된 계정의 프로필 정보를 반환합니다. (Soft Delete)
   *
   * @param {number} accountId - 삭제할 계정의 Id
   * @returns {Promise<AccountDTO>} 삭제된 계정의 기본 정보
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id를 전달했을 때 발생
   */
  withdrawAccount(accountId: number): Promise<AccountDTO>

  /**
   * 특정 계정이 인증된 계정[이메일 또는 본인인증]인지 확인합니다.
   *
   * @param {number} accountId - 인증 정보를 확인할 계정의 Id
   * @returns {Promise<void>}
   * @throws {UnverifiedException} 존재하지 않는 계정의 Id를 전달하거나, 인증되지 않은 계정의 Id를 전달할 경우 발생
   */
  isVerifiedAccount(accountId: number): Promise<void>

  /**
   * 중복 불가능한 계정 정보[id, username]의 존재 여부를 반환합니다.
   *
   * @param {'id' | 'username'} key - 확인할 정보의 종륲
   * @param {string | number} value - 확인할 정보
   * @returns {Promise<boolean>} 존재여부 [true: 존재함]
   */
  isAccountExist(
    key: 'id' | 'username',
    value: string | number
  ): Promise<boolean>

  /**
   * 특정 권한을 가진 계정 이메일의 존재여부를 반환합니다.
   *
   * @param {string} email - 확인할 이메일
   * @param {Role} role - 권한
   * @returns {Promise<boolean>} 존재여부 [true: 존재함]
   */
  isEmailExist(email: string, role: Role): Promise<boolean>
}
