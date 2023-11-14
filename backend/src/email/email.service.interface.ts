export interface EmailService {
  sendVerificationEmail(to: string, pin: string): Promise<void>
}
