import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { type Game, GameResult, Prisma } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { GetGameService } from '../interface/get-game.service.interface'
import { GetGameServiceImpl } from '../service/get-game.service'

describe('GetGameService', () => {
  const db = {
    game: {
      findUniqueOrThrow: sinon.stub(),
      findMany: sinon.stub()
    }
  }

  const games: Game[] = [
    {
      id: 1,
      homeTeamId: 1,
      awayTeamId: 2,
      leagueId: 1,
      result: GameResult.HomeWin,
      stadium: 'seoul',
      startedAt: new Date('2023-01-01'),
      name: 'game01'
    },
    {
      id: 2,
      homeTeamId: 1,
      awayTeamId: 2,
      leagueId: 1,
      result: GameResult.HomeWin,
      stadium: 'seoul',
      startedAt: new Date('2023-01-01'),
      name: 'game02'
    },
    {
      id: 3,
      homeTeamId: 1,
      awayTeamId: 2,
      leagueId: 1,
      result: GameResult.HomeWin,
      stadium: 'seoul',
      startedAt: new Date('2023-01-01'),
      name: 'game03'
    }
  ]

  const mockLeagueService = {
    getLeague: sinon.stub()
  }

  const mockTeamService = {
    getTeam: sinon.stub()
  }

  let service: GetGameService<Game>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'GetGameService', useClass: GetGameServiceImpl },
        { provide: 'LeagueService', useValue: mockLeagueService },
        { provide: 'TeamService', useValue: mockTeamService },
        { provide: PrismaService, useValue: db }
      ]
    }).compile()

    service = module.get<GetGameService<Game>>('GetGameService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defind', () => {
    expect(service).not.to.be.undefined
  })

  describe('GetGameService', () => {
    it('should return Game', async () => {
      // given
      db.game.findUniqueOrThrow.resolves(games[0])
      const gameId = 1

      // when
      const result = await service.getGame(gameId)

      // then
      expect(result).to.be.deep.equal(games[0])
      expect(
        db.game.findUniqueOrThrow.calledOnceWith({
          where: {
            id: gameId
          },
          select: {
            id: true,
            name: true,
            startedAt: true,
            stadium: true,
            homeTeam: {
              select: {
                id: true,
                name: true,
                profileImgUrl: true,
                initial: true
              }
            },
            awayTeam: {
              select: {
                id: true,
                name: true,
                profileImgUrl: true,
                initial: true
              }
            },
            League: {
              select: {
                id: true,
                name: true,
                Association: {
                  select: {
                    id: true,
                    name: true,
                    profileImgUrl: true
                  }
                }
              }
            },
            score: {
              select: {
                homeTeamScore: true,
                awayTeamScore: true
              }
            }
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid gameId passed', async () => {
      // given
      const gameId = 1
      db.game.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(service.getGame(gameId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw unexpected exception when unexpected error ocurrs', async () => {
      // given
      const gameId = 1
      db.game.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.getGame(gameId)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })

  describe('getGames', () => {
    it('should return games', async () => {
      // given
      db.game.findMany.resolves(games)

      // when
      const result = await service.getGames()

      // then
      expect(result).to.be.deep.equal(games)
      expect(
        db.game.findMany.calledOnceWith({
          take: 10,
          skip: 0,
          cursor: undefined,
          orderBy: { id: 'desc' }
        })
      ).to.be.true
    })

    it('should throw unexpected exception when unexpected error ocurrs', async () => {
      // given
      db.game.findMany.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.getGames()).to.be.rejectedWith(UnexpectedException)
    })
  })

  describe('getGamesByLeagueId', () => {
    it('should return games', async () => {
      // given
      const leagueId = 1
      mockLeagueService.getLeague.resolves()
      db.game.findMany.resolves(games)

      // when
      const result = await service.getGamesByLeagueId(leagueId)

      // then
      expect(result).to.be.deep.equal(games)
      expect(mockLeagueService.getLeague.calledOnceWith(leagueId)).to.be.true
      expect(
        db.game.findMany.calledOnceWith({
          take: 10,
          skip: 0,
          cursor: undefined,
          orderBy: { id: 'desc' },
          where: {
            leagueId
          }
        })
      ).to.be.true
    })

    it('should pass BusinessException', async () => {
      // given
      const leagueId = 1
      mockLeagueService.getLeague.rejects(new EntityNotExistException('test'))

      // then
      await expect(service.getGamesByLeagueId(leagueId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw unexpected exception when unexpected error ocurrs', async () => {
      // given
      const leagueId = 1
      mockLeagueService.getLeague.resolves()
      db.game.findMany.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.getGamesByLeagueId(leagueId)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
