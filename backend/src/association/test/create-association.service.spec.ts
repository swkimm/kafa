import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Association } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { CreateAssociationDTO } from '../dto/create-association.dto'
import type { CreateAssociationService } from '../interface/create-association.service.interface'
import { CreateAssociationServiceImpl } from '../service/create-association.service'

describe('CreateAssociationService', () => {
  const db = {
    association: {
      create: sinon.stub()
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

  const associationDTO: CreateAssociationDTO = {
    name: 'test01',
    globalName: 'test01',
    initial: 'test01',
    parentId: 2
  }

  let service: CreateAssociationService<Association>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'CreateAssociationService',
          useClass: CreateAssociationServiceImpl
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

    service = module.get<CreateAssociationService<Association>>(
      'CreateAssociationService'
    )

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('createAssociation', () => {
    it('should return association', async () => {
      // given
      db.association.create.resolves(associations[0])
      mockGetAssociationService.getAssociation.resolves()

      // when
      const result = await service.createAssociation(associationDTO)

      // then
      expect(result).to.be.deep.equal(associations[0])
      expect(
        db.association.create.calledOnceWith({
          data: {
            ...associationDTO
          }
        })
      ).to.be.true
      expect(
        mockGetAssociationService.getAssociation.calledOnceWith(
          associationDTO.parentId
        )
      ).to.be.true
    })

    it('should thorw BusinessException when instance of BusinessException occurs', async () => {
      // given
      mockGetAssociationService.getAssociation.rejects(
        new EntityNotExistException('test')
      )

      // then
      await expect(
        service.createAssociation(associationDTO)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      mockGetAssociationService.getAssociation.resolves()
      db.association.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(
        service.createAssociation(associationDTO)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })
})
