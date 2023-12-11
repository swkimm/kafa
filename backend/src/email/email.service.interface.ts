/**
 * 이메일 관련 비즈니스 로직들을 모으는 서비스 인터페이스
 */
export interface EmailService {
  /**
   * 인증번호를 포함한 인증메일을 전송합니다.
   *
   * @param {string} to 메일을 보낼 주소
   * @param {string} pin 인증메일에 담을 인증번호
   */
  sendVerificationEmail(to: string, pin: string): Promise<void>

  /**
   * 팀 계정 생성 메일을 전송합니다.
   *
   * @param {string} to 메일을 보낼 주소
   * @param {string} username 생성된 팀 계정 ID
   * @param {string} password 생성된 팀 계정 비밀번호
   */
  sendTeamRegisterMail(
    to: string,
    username: string,
    password: string
  ): Promise<void>
}
