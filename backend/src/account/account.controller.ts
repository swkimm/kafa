import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
  Put,
  Query,
  Req
} from '@nestjs/common'
import { AuthenticatedRequest } from '@/common/class/authenticated-request.interface'
import { Public } from '@/common/decorator/guard.decorator'
import {
  CacheException,
  ConflictFoundException,
  EntityNotExistException,
  UnidentifiedException
} from '@/common/exception/business.exception'
import type { Role } from '@prisma/client'
import { AccountService } from './account.service.interface'
import type { AccountDTO } from './dto/account.dto'
import { RegisterAccountDTO } from './dto/registerAccount.dto'
import { UpdateAccountProfileDTO } from './dto/updateAccount.dto'
import { UpdateEmailDTO } from './dto/updateEmail.dto'
import { UpdatePasswordDTO } from './dto/updatePassword.dto'

@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name)

  constructor(
    @Inject('AccountService') private readonly accountService: AccountService
  ) {}

  @Get('role')
  async getAccountRole(
    @Req() req: AuthenticatedRequest
  ): Promise<{ role: Role }> {
    try {
      return await this.accountService.getAccountRole(req.user.id)
    } catch (error) {
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException('account does not exists')
      } else {
        this.logger.error(error.message, error.stack)
        throw new InternalServerErrorException(error)
      }
    }
  }

  @Get('profile')
  async getAccountProfile(
    @Req() req: AuthenticatedRequest
  ): Promise<AccountDTO> {
    try {
      return await this.accountService.getAccountProfile(req.user.id)
    } catch (error) {
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException('account does not exists')
      } else {
        this.logger.error(error.message, error.stack)
        throw new InternalServerErrorException(error)
      }
    }
  }

  @Public()
  @Post()
  async registerAccount(
    @Body() accountDTO: RegisterAccountDTO
  ): Promise<AccountDTO> {
    try {
      const result = await this.accountService.registerAccount(accountDTO)
      return result
    } catch (error) {
      if (error instanceof ConflictFoundException) {
        throw new ConflictException(
          error.message.includes('email')
            ? 'duplicate email'
            : 'duplicate username'
        )
      } else {
        this.logger.error(error.message, error.stack)
        throw new InternalServerErrorException(error)
      }
    }
  }

  @Post('email/verify')
  async verifyEmail(
    @Req() req: AuthenticatedRequest,
    @Query() pin: string
  ): Promise<{ result: string }> {
    try {
      return await this.accountService.verifyEmail(req.user.id, pin)
    } catch (error) {
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException('account does not exists')
      } else if (error instanceof UnidentifiedException) {
        throw new BadRequestException('Invalid email pin code')
      } else if (error instanceof CacheException) {
        this.logger.error(error.message, error.stack)
        throw new InternalServerErrorException('cache error')
      } else {
        this.logger.error(error.message, error.stack)
        throw new InternalServerErrorException(error)
      }
    }
  }

  @Post('email/update/verify')
  async verifyUpdateEmail(
    @Req() req: AuthenticatedRequest,
    @Query() pin: string
  ): Promise<{ result: string }> {
    try {
      return await this.accountService.verifyUpdateEmail(req.user.id, pin)
    } catch (error) {
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException('account does not exists')
      } else if (error instanceof UnidentifiedException) {
        throw new BadRequestException('Invalid email pin code')
      } else if (error instanceof CacheException) {
        this.logger.error(error.message, error.stack)
        throw new InternalServerErrorException('cache error')
      } else {
        this.logger.error(error.message, error.stack)
        throw new InternalServerErrorException(error)
      }
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
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException('account does not exists')
      } else if (error instanceof CacheException) {
        this.logger.error(error.message, error.stack)
        throw new InternalServerErrorException('cache error')
      } else {
        this.logger.error(error.message, error.stack)
        throw new InternalServerErrorException(error)
      }
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
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException('account does not exists')
      } else {
        this.logger.error(error.message, error.stack)
        throw new InternalServerErrorException(error)
      }
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
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException('account does not exists')
      } else if (error instanceof UnidentifiedException) {
        throw new BadRequestException('Invalid password')
      } else {
        this.logger.error(error.message, error.stack)
        throw new InternalServerErrorException(error)
      }
    }
  }

  @Delete()
  async withdrawAccount(@Req() req: AuthenticatedRequest): Promise<AccountDTO> {
    try {
      return await this.accountService.withdrawAccount(req.user.id)
    } catch (error) {
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException('account does not exists')
      } else {
        this.logger.error(error.message, error.stack)
        throw new InternalServerErrorException(error)
      }
    }
  }
}
