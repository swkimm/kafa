import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { type Team, Prisma, TeamStatus } from '@prisma/client'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import type { DeleteTeamService } from '../interface/delete-team.service.interface'
import { DeleteTeamServiceImpl } from '../service/delete-team.service'

describe('DeleteTeamService', () => {
  const db = {
    team: {
      update: sinon.stub()
    }
  }

  let service: DeleteTeamService<Team>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'DeleteTeamService',
          useClass: DeleteTeamServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<DeleteTeamService<Team>>('DeleteTeamService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).to.be.ok
  })

  describe('deleteTeam', () => {
    it('it should return result: ok', async () => {
      // given
      const teamId = 1
      db.team.update.resolves()

      // when
      const result = await service.deleteTeam(teamId)

      // then
      expect(result).to.be.deep.equal({ result: 'ok' })
      expect(
        db.team.update.calledWithMatch({
          where: {
            id: teamId
          },
          data: {
            status: TeamStatus.Disabled
          }
        })
      ).to.be.true
      expect(db.team.update.calledOnce).to.be.true
    })

    it('should throw EntityNotExistException when invalid teamId passed', async () => {
      // given
      const teamId = 1
      db.team.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          code: 'P2025',
          clientVersion: '1.0.0'
        })
      )

      // then
      await expect(service.deleteTeam(teamId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const teamId = 1
      db.team.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          code: 'P1001',
          clientVersion: '1.0.0'
        })
      )

      // then
      await expect(service.deleteTeam(teamId)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
