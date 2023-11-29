export interface EmailService {
  sendVerificationEmail(to: string, pin: string): Promise<void>

  sendTeamRegisterMail(
    to: string,
    username: string,
    password: string
  ): Promise<void>
}
