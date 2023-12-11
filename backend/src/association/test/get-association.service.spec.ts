import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { calculateOffset } from '@/common/pagination/calculate-offset'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Association } from '@prisma/client'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import type { GetAssociationService } from '../interface/get-association.service.interface'
import { GetAssociationServiceImpl } from '../service/get-association.service'

describe('GetAssociationService', () => {
  const db = {
    association: {
      findUniqueOrThrow: sinon.stub(),
      findMany: sinon.stub()
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
    }
  ]

  let service: GetAssociationService<Association>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'GetAssociationService',
          useClass: GetAssociationServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<GetAssociationService<Association>>(
      'GetAssociationService'
    )

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).to.be.ok
  })

  describe('getAssociation', () => {
    it('should return association', async () => {
      // given
      const associationId = 1
      db.association.findUniqueOrThrow.resolves(associations[0])

      // when
      const result = await service.getAssociation(associationId)

      // then
      expect(result).to.be.deep.equal(associations[0])
    })

    it('should throw EntityNotExistException when invalid associationId passed', async () => {
      // given
      const associationId = 1
      db.association.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(service.getAssociation(associationId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const associationId = 1
      db.association.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.getAssociation(associationId)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })

  describe('getAssociations', () => {
    it('should return associations', async () => {
      // given
      const page = 1
      const limit = 10
      db.association.findMany.resolves(associations)

      // when
      const result = await service.getAssociations(page, limit)

      // then
      expect(result).to.be.deep.equal(associations)
      expect(
        db.association.findMany.calledOnceWith({
          take: limit,
          skip: calculateOffset(page, limit),
          orderBy: {
            name: 'asc'
          }
        })
      ).to.be.true
    })

    it('should throw Unexpected Exception when unexpected error occurs', async () => {
      // given
      const page = 1
      const limit = 10
      db.association.findMany.rejects(new Error('test'))

      // then
      await expect(service.getAssociations(page, limit)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
