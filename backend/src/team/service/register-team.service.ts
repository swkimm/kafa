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

/**
 * 팀 등록과 관련된 서비스 인터페이스 [RegisterTeamService] 구현체
 */
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

  /**
   * 팀 등록 정보의 타입과 값을 검사하는 private 메서드
   *
   * @param {RegisterTeamDTO} registerTeamDTO - 등록할 팀 정보가 담긴 객체
   * @returns {Promise<void>}
   * @throws {ParameterValidationException} 유효하지 않은 값이 팀 등록 정보 객체에 있을 경우 발생
   */
  private async checkParameterType(
    registerTeamDTO: RegisterTeamDTO
  ): Promise<void> {
    const target = plainToClass(RegisterTeamDTO, registerTeamDTO)
    const errors = await validate(target)

    if (errors.length > 0) {
      throw new ParameterValidationException(errors)
    }
  }

  /**
   * 팀 생성 요청 정보에 포함된 아이디와 이메일의 중복 여부를 확인하는 private 메서드.
   * 이메일의 경우 Manager 권한에서 중복되는 email이 있는지 검사한다.
   *
   *
   * @param {string} username - 중복을 확인할 username
   * @param {stirng} email - 중복을 확인할 email
   * @returns {Promise<void>}
   * @throws {ConflictFoundException} 중복되는 username이나 email을 전달할 경우 발생
   */
  private async checkDuplicateAccount(
    username: string,
    email: string
  ): Promise<void> {
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

  /**
   * 개인 계정에서 중복되는 팀 등록 요청이 있는지 검사하는 private 메서드
   *
   * @param {number} accountId - 팀 등록을 요청하는 개인 계정의 Id
   * @returns {Promise<void>}
   * @throws {ConflictFoundException} 중복되는 팀 등록 요청이 존재할 경우 발생
   */
  private async checkDuplicateRequest(accountId: number): Promise<void> {
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
