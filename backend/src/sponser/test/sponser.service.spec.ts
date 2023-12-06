import { Test, type TestingModule } from '@nestjs/testing'
import type { Sponser } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { SponserService } from '../abstract/sponser.service'
import type { CreateSponserDTO } from '../dto/create-sponser.dto'
import type { UpdateSponserDTO } from '../dto/update-sponser.dto'
import { SponserServiceImpl } from '../service/sponser.service'

describe('SponserService', () => {
  const sponsers: Sponser[] = [
    {
      id: 1,
      name: 'sponser01',
      websiteUrl: '',
      profileImgUrl: ''
    },
    {
      id: 2,
      name: 'sponser02',
      websiteUrl: '',
      profileImgUrl: ''
    },
    {
      id: 3,
      name: 'sponser03',
      websiteUrl: '',
      profileImgUrl: ''
    }
  ]

  const mockCreateSponserService = {
    createSponser: sinon.stub()
  }

  const mockGetSponserService = {
    getSponser: sinon.stub(),
    getSponsers: sinon.stub()
  }

  const mockUpdateSponserService = {
    updateSponser: sinon.stub()
  }

  const mockDeleteSponserService = {
    deleteSponser: sinon.stub()
  }

  let service: SponserService<Sponser>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'SponserService',
          useClass: SponserServiceImpl
        },
        {
          provide: 'GetSponserService',
          useValue: mockGetSponserService
        },
        {
          provide: 'UpdateSponserService',
          useValue: mockUpdateSponserService
        },
        {
          provide: 'CreateSponserService',
          useValue: mockCreateSponserService
        },
        {
          provide: 'DeleteSponserService',
          useValue: mockDeleteSponserService
        }
      ]
    }).compile()

    service = module.get<SponserService<Sponser>>('SponserService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('getSponser', () => {
    it('should return sponser', async () => {
      // given
      const sponserId = 1
      mockGetSponserService.getSponser.resolves(sponsers[0])

      // when
      const result = await service.getSponser(sponserId)

      // then
      expect(result).to.be.deep.equal(sponsers[0])
      expect(mockGetSponserService.getSponser.calledOnceWith(sponserId)).to.be
        .true
    })
  })

  describe('getSponsers', () => {
    it('should return sponsers', async () => {
      // given
      const page = 1
      const limit = 10
      mockGetSponserService.getSponsers.resolves(sponsers)

      // when
      const result = await service.getSponsers(page, limit)

      // then
      expect(result).to.be.deep.equal(sponsers)
      expect(mockGetSponserService.getSponsers.calledOnceWith(page, limit)).to
        .be.true
    })
  })

  describe('updateSponser', () => {
    it('should return sponser', async () => {
      // given
      const sponserId = 1
      const sponserDTO: UpdateSponserDTO = {
        name: 'test01',
        profileImgUrl: '',
        websiteUrl: ''
      }
      mockUpdateSponserService.updateSponser.resolves(sponsers[0])

      // when
      const result = await service.updateSponser(sponserId, sponserDTO)

      // then
      expect(result).to.be.deep.equal(sponsers[0])
      expect(
        mockUpdateSponserService.updateSponser.calledOnceWith(
          sponserId,
          sponserDTO
        )
      ).to.be.true
    })
  })

  describe('createSponser', () => {
    it('should return sponser', async () => {
      // given
      const sponserDTO: CreateSponserDTO = {
        name: 'test01',
        profileImgUrl: '',
        websiteUrl: ''
      }
      mockCreateSponserService.createSponser.resolves(sponsers[0])

      // when
      const result = await service.createSponser(sponserDTO)

      // then
      expect(result).to.be.deep.equal(sponsers[0])
      expect(mockCreateSponserService.createSponser.calledOnceWith(sponserDTO))
        .to.be.true
    })
  })

  describe('deleteSponser', () => {
    it('should return sponser', async () => {
      // given
      const sponserId = 1
      mockDeleteSponserService.deleteSponser.resolves(sponsers[0])

      // when
      const result = await service.deleteSponser(sponserId)

      // then
      expect(result).to.be.deep.equal(sponsers[0])
      expect(mockDeleteSponserService.deleteSponser.calledOnceWith(sponserId))
        .to.be.true
    })
  })
})
