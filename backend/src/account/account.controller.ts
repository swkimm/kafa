import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthenticatedRequest } from '@/common/class/authenticated-request.interface'
import { Public } from '@/common/decorator/guard.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import { FILE_OPTIONS } from '@/storage/option/file-option'
import {
  type AccountCertification,
  Role,
  type AccountCredential
} from '@prisma/client'
import { AccountService } from './account.service.interface'
import type { AccountDTO } from './dto/account.dto'
import type { AccountCertificateStatus } from './dto/accountStatus.dto'
import { RegisterAccountDTO } from './dto/registerAccount.dto'
import { UpdateAccountProfileDTO } from './dto/updateAccount.dto'
import { UpdateEmailDTO } from './dto/updateEmail.dto'
import { UpdatePasswordDTO } from './dto/updatePassword.dto'
import { AccountCertificationService } from './interface/account-certification.service.interface'
import { AccountCredentialService } from './interface/account-credential.service.interface'

@Controller('account')
export class AccountController {
  constructor(
    @Inject('AccountService') private readonly accountService: AccountService,
    @Inject('AccountCertificationService')
    private readonly accountCertificationService: AccountCertificationService<AccountCertification>,
    @Inject('AccountCredentialService')
    private readonly accountCredentialService: AccountCredentialService<AccountCredential>
  ) {}

  @Get('role')
  async getAccountRole(
    @Req() req: AuthenticatedRequest
  ): Promise<{ role: Role }> {
    try {
      return await this.accountService.getAccountRole(req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get('status')
  async getAccountCertificateStatus(
    @Req() req: AuthenticatedRequest
  ): Promise<AccountCertificateStatus> {
    try {
      return await this.accountCertificationService.checkAccountStatus(
        req.user.id
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get('profile')
  async getAccountProfile(
    @Req() req: AuthenticatedRequest
  ): Promise<AccountDTO> {
    try {
      return await this.accountService.getAccountProfile(req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Post()
  async registerAccount(
    @Body() accountDTO: RegisterAccountDTO
  ): Promise<AccountDTO> {
    try {
      const result = await this.accountService.registerAccount(
        accountDTO,
        Role.User
      )
      return result
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post('email/verify/resend')
  async requestCertificationMail(
    @Req() req: AuthenticatedRequest
  ): Promise<string> {
    try {
      return await this.accountService.requestCertificationMail(req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post('email/verify')
  async verifyEmail(
    @Req() req: AuthenticatedRequest,
    @Query('pin') pin: string
  ): Promise<{ result: string }> {
    try {
      return await this.accountService.verifyEmail(req.user.id, pin)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post('email/update/verify')
  async verifyUpdateEmail(
    @Req() req: AuthenticatedRequest,
    @Query('pin') pin: string
  ): Promise<{ result: string }> {
    try {
      return await this.accountService.verifyUpdateEmail(req.user.id, pin)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Put('email')
  async updateEmail(
    @Body() accountDTO: UpdateEmailDTO,
    @Req() req: AuthenticatedRequest
  ): Promise<{ result: string }> {
    try {
      return await this.accountService.updateEmail(accountDTO, req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Put('profile')
  async updateAccountProfile(
    @Body() accountDTO: UpdateAccountProfileDTO,
    @Req() req: AuthenticatedRequest
  ): Promise<AccountDTO> {
    try {
      return await this.accountService.updateAccountProfile(
        accountDTO,
        req.user.id
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Put('password')
  async updatePassword(
    @Body() accountDTO: UpdatePasswordDTO,
    @Req() req: AuthenticatedRequest
  ): Promise<{ result: string }> {
    try {
      return await this.accountService.updatePassword(accountDTO, req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Delete()
  async withdrawAccount(@Req() req: AuthenticatedRequest): Promise<AccountDTO> {
    try {
      return await this.accountService.withdrawAccount(req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  /**
   * Certification and Credential
   */

  @Get('credential')
  async getAccountCredential(@Req() req: AuthenticatedRequest) {
    try {
      return await this.accountCredentialService.getCredential(req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Get('certification')
  async getAccountCertificaion(@Req() req: AuthenticatedRequest) {
    try {
      return await this.accountCertificationService.getCertification(
        req.user.id
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post('certification')
  @UseInterceptors(FileInterceptor('file', FILE_OPTIONS))
  async upsertAccountCertification0(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest
  ): Promise<AccountCertification> {
    if (!file) {
      throw new BadRequestException('Invalid file format or size')
    }

    try {
      return await this.accountCertificationService.upsertCertification(
        file,
        req.user.id
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
