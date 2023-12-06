import { Inject, Injectable } from '@nestjs/common'
import { AccountService } from '@/account/account.service.interface'
import type { RegisterAccountDTO } from '@/account/dto/registerAccount.dto'
import {
  BusinessException,
  ConflictFoundException,
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { generatePassword } from '@/common/password/generate-password'
import { EmailService } from '@/email/email.service.interface'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Prisma,
  TeamEnrollStatus,
  type RegisterTeamRequest,
  type Team,
  Role
} from '@prisma/client'
import { plainToClass } from 'class-transformer'
import { RegisterTeamDTO } from '../dto/register-team.dto'
import type { UpdateTeamDTO } from '../dto/update-team.dto'
import { RegisterTeamService } from '../interface/register-team.service.interface'
import type { UpdateTeamService } from '../interface/update-team.service.interface'

@Injectable()
export class UpdateTeamServiceImpl
  implements UpdateTeamService<Team, RegisterTeamRequest>
{
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('EmailService') private readonly emailService: EmailService,
    @Inject('AccountService') private readonly accountService: AccountService,
    @Inject('RegisterTeamService')
    private readonly registerTeamService: RegisterTeamService<
      Team,
      RegisterTeamRequest
    >
  ) {}

  async updateTeamProfile(
    teamDTO: UpdateTeamDTO,
    teamId: number
  ): Promise<Team> {
    try {
      return await this.prismaService.team.update({
        where: {
          id: teamId
        },
        data: {
          ...teamDTO
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('teamId')
      }
      throw new UnexpectedException(error)
    }
  }

  async approveRegisterTeamRequest(requestId: number): Promise<Team> {
    try {
      const { accountId, data, username, status } =
        await this.prismaService.registerTeamRequest.findUniqueOrThrow({
          where: {
            id: requestId
          }
        })

      if (status !== TeamEnrollStatus.Received) {
        throw new ConflictFoundException('request already processed')
      }

      const registerTeamRequest = this.jsonDataParser(data)
      const requestAccount =
        await this.accountService.getAccountProfile(accountId)

      const password = generatePassword()
      const accountDTO: RegisterAccountDTO = {
        name: registerTeamRequest.name,
        email: requestAccount.email,
        password,
        username
      }

      const managerAccount = await this.accountService.registerAccount(
        accountDTO,
        Role.Manager
      )

      const team =
        await this.registerTeamService.registerTeam(registerTeamRequest)

      await this.emailService.sendTeamRegisterMail(
        managerAccount.email,
        username,
        password
      )

      await this.accountService.mappingManagerAccount(
        managerAccount.id,
        team.id
      )

      await this.prismaService.registerTeamRequest.update({
        where: {
          id: requestId
        },
        data: {
          status: TeamEnrollStatus.Approved
        }
      })

      return team
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('requestId')
      }
      throw new UnexpectedException(error)
    }
  }

  async rejectRegisterTeamRequest(
    requestId: number,
    reason: string
  ): Promise<RegisterTeamRequest> {
    try {
      return await this.prismaService.registerTeamRequest.update({
        where: {
          id: requestId
        },
        data: {
          status: TeamEnrollStatus.Rejected,
          rejectReason: reason
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('requestId')
      }
      throw new UnexpectedException(error)
    }
  }

  private jsonDataParser(data: Prisma.JsonValue): RegisterTeamDTO {
    return plainToClass(RegisterTeamDTO, data)
  }
}
