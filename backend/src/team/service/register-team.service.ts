import { Inject, Injectable } from '@nestjs/common'
import { AccountService } from '@/account/account.service.interface'
import { AssociationService } from '@/association/abstract/association.service'
import {
  BusinessException,
  ConflictFoundException,
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Role,
  type RegisterTeamRequest,
  type Team,
  TeamEnrollStatus,
  Prisma,
  type Association
} from '@prisma/client'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import type { RegisterTeamRequestDTO } from '../dto/register-team-request.dto'
import { RegisterTeamDTO } from '../dto/register-team.dto'
import type { RegisterTeamService } from '../interface/register-team.service.interface'

@Injectable()
export class RegisterTeamServiceImpl
  implements RegisterTeamService<Team, RegisterTeamRequest>
{
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('AccountService') private readonly accountService: AccountService,
    @Inject('AssociationService')
    private readonly associationService: AssociationService<Association>
  ) {}

  async registerTeam(teamDTO: RegisterTeamDTO): Promise<Team> {
    try {
      await this.checkParameterType(teamDTO)

      return await this.prismaService.team.create({
        data: {
          ...teamDTO
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new EntityNotExistException('associationId')
      }
      throw new UnexpectedException(error)
    }
  }

  async createRegisterTeamRequest(
    requestTeamDTO: RegisterTeamRequestDTO
  ): Promise<RegisterTeamRequest> {
    try {
      await this.checkParameterType(requestTeamDTO.data)

      const { accountId, teamAccountUsername } = requestTeamDTO
      await this.accountService.isVerifiedAccount(accountId)
      const { email } = await this.accountService.getAccountProfile(accountId)

      await this.checkDuplicateRequest(accountId)
      await this.checkDuplicateAccount(teamAccountUsername, email)
      await this.associationService.getAssociation(
        requestTeamDTO.data.associationId
      )

      return await this.prismaService.registerTeamRequest.create({
        data: {
          data: {
            ...requestTeamDTO.data
          },
          accountId: requestTeamDTO.accountId,
          status: TeamEnrollStatus.Received,
          username: teamAccountUsername
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('associationId')
      }
      throw new UnexpectedException(error)
    }
  }

  private async checkParameterType(registerTeamDTO: RegisterTeamDTO) {
    const target = plainToClass(RegisterTeamDTO, registerTeamDTO)
    const errors = await validate(target)

    if (errors.length > 0) {
      throw new ParameterValidationException(errors)
    }
  }

  private async checkDuplicateAccount(username: string, email: string) {
    const checkId = await this.accountService.isAccountExist(
      'username',
      username
    )

    if (checkId) {
      throw new ConflictFoundException('username')
    }

    const checkEmail = await this.accountService.isEmailExist(
      email,
      Role.Manager
    )

    if (checkEmail) {
      throw new ConflictFoundException('email')
    }
  }

  private async checkDuplicateRequest(accountId: number) {
    const checkAccount = await this.prismaService.registerTeamRequest.findFirst(
      {
        where: {
          accountId,
          status: TeamEnrollStatus.Received
        }
      }
    )

    if (checkAccount) {
      throw new ConflictFoundException('register team request')
    }
  }
}
