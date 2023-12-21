import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  ForbiddenAccessException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { Role } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { TeamProfileServiceImpl } from '../service/team-profile.service'

describe('TeamProfileService', () => {
  const mockTeamService = {
    getTeam: sinon.stub(),
    updateTeamProfile: sinon.stub()
  }

  const mockAccountService = {
    getAccountRole: sinon.stub(),
    getAccountProfile: sinon.stub()
  }

  const mockImageStorageService = {
    uploadObject: sinon.stub(),
    deleteObject: sinon.stub()
  }

  const dummyFile: Express.Multer.File = {
    fieldname: 'dummy',
    originalname: 'dummy.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from(''),
    size: 1024,
    stream: null,
    destination: 'uploads/',
    filename: 'dummy.jpg',
    path: 'uploads/dummy.jpg'
  }

  let service: TeamProfileServiceImpl

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'TeamProfileService',
          useClass: TeamProfileServiceImpl
        },
        {
          provide: 'TeamService',
          useValue: mockTeamService
        },
        {
          provide: 'AccountService',
          useValue: mockAccountService
        },
        {
          provide: 'ImageStorageService',
          useValue: mockImageStorageService
        }
      ]
    }).compile()

    service = module.get<TeamProfileServiceImpl>('TeamProfileService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('upsertProfile', () => {
    it('should return url [1]', async () => {
      // given
      const teamId = 1
      mockTeamService.getTeam.resolves({ profileImgUrl: 'test' })
      mockImageStorageService.uploadObject.resolves({ url: 'test' })

      // when
      const result = await service.upsertProfile(dummyFile, teamId)

      // then
      expect(result).to.be.deep.equal('test')
      expect(mockTeamService.getTeam.calledOnceWith(teamId)).to.be.true
      expect(mockImageStorageService.deleteObject.calledOnceWith('test')).to.be
        .true
      expect(
        mockImageStorageService.uploadObject.calledOnceWith(
          dummyFile,
          `team/${teamId}/profile`
        )
      ).to.be.true
      expect(
        mockTeamService.updateTeamProfile.calledOnceWith(
          { profileImgUrl: 'test' },
          teamId
        )
      ).to.be.true
    })

    it('should return url [2]', async () => {
      // given
      const teamId = 1
      mockTeamService.getTeam.resolves({ profileImgUrl: undefined })
      mockImageStorageService.uploadObject.resolves({ url: 'test' })

      // when
      const result = await service.upsertProfile(dummyFile, teamId)

      // then
      expect(result).to.be.deep.equal('test')
      expect(mockTeamService.getTeam.calledOnceWith(teamId)).to.be.true
      expect(mockImageStorageService.deleteObject.notCalled).to.be.true
      expect(
        mockImageStorageService.uploadObject.calledOnceWith(
          dummyFile,
          `team/${teamId}/profile`
        )
      ).to.be.true
      expect(
        mockTeamService.updateTeamProfile.calledOnceWith(
          { profileImgUrl: 'test' },
          teamId
        )
      ).to.be.true
    })

    it('should pass BusinessException', async () => {
      // given
      const teamId = 1
      mockTeamService.getTeam.rejects(new EntityNotExistException('test'))

      // then
      await expect(service.upsertProfile(dummyFile, teamId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const teamId = 1
      mockTeamService.getTeam.resolves({ profileImgUrl: undefined })
      mockImageStorageService.uploadObject.rejects(new Error('test'))

      // then
      await expect(service.upsertProfile(dummyFile, teamId)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })

  describe('upsertTeamProfile', () => {
    it('should return url [1]', async () => {
      // given
      const teamId = 1
      const accountId = 1
      const mock = sinon.stub(service, 'upsertProfile').resolves('test')
      mockAccountService.getAccountRole.resolves({ role: Role.Manager })
      mockAccountService.getAccountProfile.resolves({ teamId: 1 })

      // when
      const result = await service.upsertTeamProfile(
        dummyFile,
        teamId,
        accountId
      )

      // then
      expect(result).to.be.deep.equal('test')
      expect(mock.calledOnceWith(dummyFile, teamId)).to.be.true
      expect(mockAccountService.getAccountRole.calledOnceWith(accountId)).to.be
        .true
      expect(mockAccountService.getAccountProfile.calledOnceWith(accountId)).to
        .be.true
    })

    it('should return url [2]', async () => {
      // given
      const teamId = 1
      const accountId = 1
      const mock = sinon.stub(service, 'upsertProfile').resolves('test')
      mockAccountService.getAccountRole.resolves({ role: Role.Admin })

      // when
      const result = await service.upsertTeamProfile(
        dummyFile,
        teamId,
        accountId
      )

      // then
      expect(result).to.be.deep.equal('test')
      expect(mock.calledOnceWith(dummyFile, teamId)).to.be.true
      expect(mockAccountService.getAccountRole.calledOnceWith(accountId)).to.be
        .true
      expect(mockAccountService.getAccountProfile.notCalled).to.be.true
    })

    it('should throw ForbiddenAccessException', async () => {
      // given
      const teamId = 1
      const accountId = 1
      mockAccountService.getAccountRole.resolves({ role: Role.Manager })
      mockAccountService.getAccountProfile.resolves({ teamId: 2 })

      // then
      await expect(
        service.upsertTeamProfile(dummyFile, teamId, accountId)
      ).to.be.rejectedWith(ForbiddenAccessException)
    })

    it('should pass BusinessException', async () => {
      // given
      const teamId = 1
      const accountId = 1
      sinon
        .stub(service, 'upsertProfile')
        .rejects(new EntityNotExistException('test'))
      mockAccountService.getAccountRole.resolves({ role: Role.Admin })

      // then
      await expect(
        service.upsertTeamProfile(dummyFile, teamId, accountId)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const teamId = 1
      const accountId = 1
      mockAccountService.getAccountRole.rejects(new Error('test'))

      // then
      await expect(
        service.upsertTeamProfile(dummyFile, teamId, accountId)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })
})
