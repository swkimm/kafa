import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Association } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { UpdateAssociationDTO } from '../dto/update-association.dto'
import type { UpdateAssociationService } from '../interface/update-association.service.interface'
import { UpdateAssociationServiceImpl } from '../service/update-association.service'

describe('UpdateAssociationService', () => {
  const db = {
    association: {
      update: sinon.stub()
    }
  }

  const associations: Association[] = [
    {
      id: 1,
      name: 'association01',
      globalName: 'association01',
      initial: 'AONE',
      parentId: null,
      profileImgUrl: null
    },
    {
      id: 2,
      name: 'association02',
      globalName: 'association02',
      initial: 'ATWO',
      parentId: null,
      profileImgUrl: null
    },
    {
      id: 3,
      name: 'association03',
      globalName: 'association03',
      initial: 'ATHREE',
      parentId: 1,
      profileImgUrl: null
    }
  ]

  const mockGetAssociationService = {
    getAssociation: sinon.stub()
  }

  const associationDTO: UpdateAssociationDTO = {
    name: 'test01',
    globalName: 'test01',
    initial: 'test01',
    parentId: 2
  }

  let service: UpdateAssociationService<Association>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UpdateAssociationService',
          useClass: UpdateAssociationServiceImpl
        },
        {
          provide: 'GetAssociationService',
          useValue: mockGetAssociationService
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<UpdateAssociationService<Association>>(
      'UpdateAssociationService'
    )

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('updateAssociation', () => {
    it('should return association', async () => {
      // given
      const associationId = 1
      mockGetAssociationService.getAssociation.resolves()
      db.association.update.resolves(associations[0])

      // when
      const result = await service.updateAssociation(
        associationId,
        associationDTO
      )

      // then
      expect(result).to.be.deep.equal(associations[0])
      expect(
        mockGetAssociationService.getAssociation.calledOnceWith(
          associationDTO.parentId
        )
      ).to.be.true
      expect(
        db.association.update.calledOnceWith({
          where: {
            id: associationId
          },
          data: {
            ...associationDTO
          }
        })
      ).to.be.true
    })

    it('should pass BusinessException when instance of BusinessException occurs', async () => {
      // given
      const associationId = 2

      // then
      await expect(
        service.updateAssociation(associationId, associationDTO)
      ).to.be.rejectedWith(ParameterValidationException)
    })

    it('should throw EntityNotExistException when invalid associtationId passed', async () => {
      // given
      const associationId = 1
      db.association.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(
        service.updateAssociation(associationId, associationDTO)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const associationId = 1
      db.association.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(
        service.updateAssociation(associationId, associationDTO)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })
})
