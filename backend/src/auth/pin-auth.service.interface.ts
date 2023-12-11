/**
 * 핀 번호 기반 인증 서비스 인터페이스
 */
export interface PinAuthService {
  /**
   * 식별자와 핀 번호를 입력으로 받아 유효한 핀 번호 여부를 반환합니다.
   * @param {number | string} identifier - 식별자 ex) username, email 등
   * @param {string} pin - 핀 번호
   * @returns {Promise<boolean>} 유효한 핀 번호 여부
   */
  verifyPin(identifier: number | string, pin: string): Promise<boolean>

  /**
   * 식별자에 핀 번호를 등록하고 성공여부를 반환합니다.
   * @param {number | string} identifier - 식별자 ex) username, email 등
   * @param {string} pin - 핀 번호
   * @returns {Promise<{result: string}>} 등록 성공 여부
   */
  registerPin(
    identifier: number | string,
    pin: string
  ): Promise<{ result: string }>

  /**
   * 식별자에 등록된 핀 번호를 삭제하고 성공여부를 반환합니다.
   * @param {number | string} identifier - 식별자 ex) username, email 등
   * @returns {Promise<{result: string}>} 삭제 성공 여부
   */
  deletePin(identifier: number | string): Promise<{ result: string }>
}
