import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Association } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { DeleteAssociationService } from '../interface/delete-association.service.interface'
import { DeleteAssociationServiceImpl } from '../service/delete-association.service'

describe('DeleteAssociationService', () => {
  const db = {
    association: {
      delete: sinon.stub()
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

  let service: DeleteAssociationService<Association>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'DeleteAssociationService',
          useClass: DeleteAssociationServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<DeleteAssociationService<Association>>(
      'DeleteAssociationService'
    )

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('deleteAssociation', () => {
    it('should return association', async () => {
      // given
      const associationId = 1
      db.association.delete.resolves(associations[0])

      // when
      const result = await service.deleteAssociation(associationId)

      // then
      expect(result).to.be.deep.equal(associations[0])
      expect(
        db.association.delete.calledOnceWith({
          where: {
            id: associationId
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid associationId passed', async () => {
      // given
      const associationId = 1
      db.association.delete.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(service.deleteAssociation(associationId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const associationId = 1
      db.association.delete.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // then
      await expect(service.deleteAssociation(associationId)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })
})
