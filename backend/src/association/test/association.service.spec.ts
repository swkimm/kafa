import { Test, type TestingModule } from '@nestjs/testing'
import { PrismaService } from '@/prisma/prisma.service'
import type { Association } from '@prisma/client'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import type { AssociationService } from '../abstract/association.service'
import { AssociationServiceImpl } from '../service/association.service'

describe('AssociationService', () => {
  const db = {
    association: {
      findUniqueOrThrow: sinon.stub()
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
      id: 1,
      name: 'association02',
      globalName: 'association02',
      initial: 'ATWO',
      parentId: null,
      profileImgUrl: null
    }
  ]

  const mockGetAssociationService = {
    getAssociation: sinon.stub()
  }

  let service: AssociationService<Association>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'GetAssociationService',
          useValue: mockGetAssociationService
        },
        {
          provide: PrismaService,
          useValue: db
        },
        {
          provide: 'AssociationService',
          useClass: AssociationServiceImpl
        }
      ]
    }).compile()

    service = module.get<AssociationService<Association>>('AssociationService')

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
      mockGetAssociationService.getAssociation.resolves(associations[0])

      // when
      const result = await service.getAssociation(associationId)

      // then
      expect(result).to.be.deep.equal(associations[0])
    })
  })
})
