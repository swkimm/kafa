import { Test, type TestingModule } from '@nestjs/testing'
import { PrismaService } from '@/prisma/prisma.service'
import {
  type Team,
  type TeamLeague,
  LeagueApplyStatus,
  TeamStatus,
  type RegisterTeamRequest,
  TeamEnrollStatus,
  type Account,
  AccountStatus,
  Role
} from '@prisma/client'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import type { TeamService } from '../abstract/team.service'
import type { RegisterTeamRequestDTO } from '../dto/register-team-request.dto'
import type { RegisterTeamDTO } from '../dto/register-team.dto'
import type { UpdateTeamDTO } from '../dto/update-team.dto'
import { DeleteTeamServiceImpl } from '../service/delete-team.service'
import { GetTeamServiceImpl } from '../service/get-team.service'
import { RegisterTeamServiceImpl } from '../service/register-team.service'
import { TeamServiceImpl } from '../service/team.service'
import { UpdateTeamServiceImpl } from '../service/update-team.service'

describe('TeamService', () => {
  const db = {
    team: {
      create: sinon.stub(),
      update: sinon.stub(),
      findUniqueOrThrow: sinon.stub(),
      findMany: sinon.stub()
    },
    registerTeamRequest: {
      findFirst: sinon.stub(),
      create: sinon.stub(),
      findMany: sinon.stub(),
      findUniqueOrThrow: sinon.stub(),
      update: sinon.stub()
    }
  }

  const mockGetTeamLeagueService = {
    getTeamLeaguesByLeagueId: sinon.stub()
  }

  const mockAccountService = {
    isVerifiedAccount: sinon.stub(),
    isAccountExist: sinon.stub(),
    isEmailExist: sinon.stub(),
    getAccountProfile: sinon.stub(),
    registerAccount: sinon.stub(),
    mappingManagerAccount: sinon.stub()
  }

  const mockEmailService = {
    sendTeamRegisterMail: sinon.stub()
  }

  const account: Account = {
    id: 1,
    status: AccountStatus.Enable,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date('2023-01-01'),
    password: 'password',
    birthday: new Date('2023-01-01'),
    role: Role.User,
    username: 'user01',
    email: 'example@example.com',
    lastPasswordChanged: new Date('2023-01-01'),
    name: 'user01',
    profileImgUrl: undefined,
    deletedAt: undefined,
    teamId: undefined
  }

  const team: Team = {
    id: 1,
    associationId: 1,
    backgroundImgUrl: '',
    color: '#123456',
    establishedAt: new Date('2023-01-01'),
    globalName: 'team',
    hometown: 'abc',
    initial: 'team',
    name: 'team01',
    profileImgUrl: '',
    status: TeamStatus.Enabled,
    rejectReason: '',
    subColor: '#123456',
    deletedAt: undefined,
    createdAt: new Date()
  }

  const registerTeamRequest: RegisterTeamRequest = {
    id: 1,
    accountId: 1,
    createdAt: new Date('2023-01-01'),
    data: {
      associationId: 1,
      name: team.name,
      color: team.color,
      establishedAt: team.establishedAt.toString(),
      globalName: team.globalName,
      hometown: team.hometown,
      initial: team.initial,
      subColor: team.subColor
    },
    rejectReason: '',
    status: TeamEnrollStatus.Received,
    username: 'team01'
  }

  const rejectedRegisterTeamRequest: RegisterTeamRequest = {
    id: 1,
    accountId: 1,
    createdAt: new Date('2023-01-01'),
    data: {
      associationId: 1,
      name: team.name,
      color: team.color,
      establishedAt: team.establishedAt.toString(),
      globalName: team.globalName,
      hometown: team.hometown,
      initial: team.initial,
      subColor: team.subColor
    },
    rejectReason: '',
    status: TeamEnrollStatus.Rejected,
    username: 'team01'
  }

  const teams: Team[] = [
    {
      id: 1,
      associationId: 1,
      backgroundImgUrl: '',
      color: '#123456',
      establishedAt: new Date('2023-01-01'),
      globalName: 'team01',
      hometown: 'abc',
      initial: 'team01',
      name: 'team01',
      profileImgUrl: '',
      status: TeamStatus.Enabled,
      rejectReason: '',
      subColor: '#123456',
      deletedAt: undefined,
      createdAt: new Date()
    },
    {
      id: 2,
      associationId: 1,
      backgroundImgUrl: '',
      color: '#123456',
      establishedAt: new Date('2023-01-01'),
      globalName: 'team02',
      hometown: 'abc',
      initial: 'team02',
      name: 'team02',
      profileImgUrl: '',
      status: TeamStatus.Enabled,
      rejectReason: '',
      subColor: '#123456',
      deletedAt: undefined,
      createdAt: new Date()
    },
    {
      id: 3,
      associationId: 1,
      backgroundImgUrl: '',
      color: '#123456',
      establishedAt: new Date('2023-01-01'),
      globalName: 'team03',
      hometown: 'abc',
      initial: 'team03',
      name: 'team03',
      profileImgUrl: '',
      status: TeamStatus.Enabled,
      rejectReason: '',
      subColor: '#123456',
      deletedAt: undefined,
      createdAt: new Date()
    }
  ]

  const teamLeagues: TeamLeague[] = [
    {
      leagueId: 1,
      rank: 1,
      teamId: 1,
      applyStatus: LeagueApplyStatus.Approved,
      rejectReason: ''
    },
    {
      leagueId: 1,
      rank: 2,
      teamId: 2,
      applyStatus: LeagueApplyStatus.Approved,
      rejectReason: ''
    },
    {
      leagueId: 1,
      rank: 2,
      teamId: 3,
      applyStatus: LeagueApplyStatus.Approved,
      rejectReason: ''
    }
  ]

  const registerTeamRequests: RegisterTeamRequest[] = [
    {
      id: 1,
      accountId: 1,
      createdAt: new Date(),
      data: {
        test: 'test'
      },
      rejectReason: undefined,
      status: TeamEnrollStatus.Received,
      username: 'test'
    }
  ]

  const mockAssociationService = {
    getAssociation: sinon.stub()
  }

  let service: TeamService<Team, { result: string }, RegisterTeamRequest>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'TeamService',
          useClass: TeamServiceImpl
        },
        { provide: 'DeleteTeamService', useClass: DeleteTeamServiceImpl },
        { provide: 'RegisterTeamService', useClass: RegisterTeamServiceImpl },
        { provide: 'UpdateTeamService', useClass: UpdateTeamServiceImpl },
        { provide: 'GetTeamService', useClass: GetTeamServiceImpl },
        {
          provide: 'TeamLeagueService',
          useValue: mockGetTeamLeagueService
        },
        {
          provide: 'AccountService',
          useValue: mockAccountService
        },
        {
          provide: PrismaService,
          useValue: db
        },
        {
          provide: 'EmailService',
          useValue: mockEmailService
        },
        {
          provide: 'AssociationService',
          useValue: mockAssociationService
        }
      ]
    }).compile()

    service =
      module.get<TeamService<Team, { result: string }, RegisterTeamRequest>>(
        'TeamService'
      )

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('deleteTeam', () => {
    it('should return registered team', async () => {
      // given
      db.team.update.resolves(team)

      // when
      const result = await service.deleteTeam(team.id)

      // then
      expect(result).to.be.deep.equal({ result: 'ok' })
      expect(
        db.team.update.calledWithMatch({
          where: {
            id: team.id
          },
          data: {
            status: TeamStatus.Disabled
          }
        })
      ).to.be.true
      expect(db.team.update.calledOnce).to.be.true
    })
  })

  describe('registerTeam', () => {
    it('should return registered team', async () => {
      // given
      const teamDTO: RegisterTeamDTO = {
        name: team.name,
        associationId: team.associationId,
        color: team.color,
        establishedAt: team.establishedAt,
        globalName: team.globalName,
        hometown: team.hometown,
        initial: team.initial,
        subColor: team.subColor
      }
      db.team.create.resolves(team)

      // when
      const result = await service.registerTeam(teamDTO)

      // then
      expect(result).to.be.deep.equal(team)
      expect(
        db.team.create.calledOnceWith({
          data: {
            ...teamDTO
          }
        })
      ).to.be.true
    })
  })

  describe('createRegisterTeamRequest', () => {
    it('should return register team request', async () => {
      // given
      const email = 'test@example.com'
      const returnValue: RegisterTeamRequest = {
        accountId: 1,
        createdAt: new Date('2023-01-01'),
        data: JSON.stringify({
          name: team.name,
          associationId: team.associationId,
          color: team.color,
          establishedAt: team.establishedAt,
          globalName: team.globalName,
          hometown: team.hometown,
          initial: team.initial,
          subColor: team.subColor
        }),
        rejectReason: '',
        status: TeamEnrollStatus.Received,
        username: 'team01',
        id: 1
      }
      const requestTeamDTO: RegisterTeamRequestDTO = {
        accountId: 1,
        data: {
          name: team.name,
          associationId: team.associationId,
          color: team.color,
          establishedAt: team.establishedAt,
          globalName: team.globalName,
          hometown: team.hometown,
          initial: team.initial,
          subColor: team.subColor
        },
        teamAccountUsername: 'team01'
      }
      mockAccountService.isAccountExist.resolves(false)
      mockAccountService.isEmailExist.resolves(false)
      mockAccountService.isVerifiedAccount.resolves(true)
      mockAccountService.getAccountProfile.resolves({
        email
      })
      db.registerTeamRequest.findFirst.resolves(null)
      db.registerTeamRequest.create.resolves(returnValue)

      // when
      const result = await service.createRegisterTeamRequest(requestTeamDTO)

      // then
      expect(result).to.be.deep.equal(returnValue)
      expect(
        db.registerTeamRequest.create.calledOnceWith({
          data: {
            data: {
              name: team.name,
              associationId: team.associationId,
              color: team.color,
              establishedAt: team.establishedAt,
              globalName: team.globalName,
              hometown: team.hometown,
              initial: team.initial,
              subColor: team.subColor
            },
            accountId: requestTeamDTO.accountId,
            status: TeamEnrollStatus.Received,
            username: requestTeamDTO.teamAccountUsername
          }
        })
      ).to.be.true
      expect(
        db.registerTeamRequest.findFirst.calledOnceWith({
          where: {
            accountId: requestTeamDTO.accountId,
            status: TeamEnrollStatus.Received
          }
        })
      ).to.be.true
    })
  })

  describe('updateTeamProfile', () => {
    it('should return registered team', async () => {
      // given
      const teamDTO: UpdateTeamDTO = {
        name: team.name,
        color: team.color,
        establishedAt: team.establishedAt,
        globalName: team.globalName,
        hometown: team.hometown,
        initial: team.initial,
        subColor: team.subColor
      }

      db.team.update.resolves(team)

      // when
      const result = await service.updateTeamProfile(teamDTO, team.id)

      // then
      expect(result).to.be.deep.equal(team)
      expect(
        db.team.update.calledOnceWith({
          where: {
            id: team.id
          },
          data: {
            ...teamDTO
          }
        })
      ).to.be.true
    })
  })

  describe('getTeam', () => {
    it('should return team', async () => {
      // given
      const teamId = 1
      db.team.findUniqueOrThrow.resolves(team)

      // when
      const result = await service.getTeam(teamId)

      // then
      expect(result).to.be.deep.equal(team)
    })
  })

  describe('getTeams', () => {
    it('should return teams', async () => {
      // given
      const limit = 10
      const page = 0
      db.team.findMany.resolves(teams)

      // when
      const result = await service.getTeams(page, limit)

      // then
      expect(result).to.be.deep.equal(
        teams.map((team) => {
          return {
            id: team.id,
            name: team.name,
            globalName: team.globalName,
            initial: team.initial,
            color: team.color,
            profileImgUrl: team.profileImgUrl
          }
        })
      )
    })
  })

  describe('getAssociationTeams', () => {
    it('should return teams', async () => {
      // given
      const associationId = 1
      db.team.findMany.resolves(teams)

      // when
      const result = await service.getAssociationTeams(associationId)

      // then
      expect(result).to.be.deep.equal(teams)
    })
  })

  describe('getLeagueTeams', () => {
    it('should return teams', async () => {
      // given
      const leagueId = 1
      mockGetTeamLeagueService.getTeamLeaguesByLeagueId.resolves(teamLeagues)
      db.team.findMany.resolves(teams)

      // when
      const result = await service.getLeagueTeams(leagueId)

      // then
      expect(result).to.be.deep.equal(teams)
    })
  })

  describe('getAccountRegisterTeamRequests', () => {
    it('should return register team requests', async () => {
      // given
      const accountId = 1
      db.registerTeamRequest.findMany.resolves(registerTeamRequests)

      // when
      const result = await service.getAccountRegisterTeamRequests(accountId)

      // then
      expect(result).to.be.deep.equal(registerTeamRequests)
    })
  })

  describe('approveRegisterTeamRequest', () => {
    it('should return approved team', async () => {
      // given
      const requestId = 1
      db.registerTeamRequest.findUniqueOrThrow.resolves(registerTeamRequest)
      db.registerTeamRequest.update.resolves()
      mockAccountService.getAccountProfile.resolves(account)
      mockAccountService.registerAccount.resolves(account)
      db.team.create.resolves(team)

      // when
      const result = await service.approveRegisterTeamRequest(requestId)

      // then
      expect(result).to.be.deep.equal(team)
    })
  })

  describe('rejectRegisterTeamRequest', () => {
    it('should return rejectedRegisterTeamRequest', async () => {
      // given
      const requestId = 1
      const reason = 'test'
      db.registerTeamRequest.update.resolves(rejectedRegisterTeamRequest)

      // when
      const result = await service.rejectRegisterTeamRequest(requestId, reason)

      // then
      expect(result).to.be.deep.equal(rejectedRegisterTeamRequest)
    })
  })
})
