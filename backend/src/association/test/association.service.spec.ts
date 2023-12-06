import { Test, type TestingModule } from '@nestjs/testing'
import { PrismaService } from '@/prisma/prisma.service'
import type { Association } from '@prisma/client'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import type { AssociationService } from '../abstract/association.service'
import type { CreateAssociationDTO } from '../dto/create-association.dto'
import type { UpdateAssociationDTO } from '../dto/update-association.dto'
import { AssociationServiceImpl } from '../service/association.service'

describe('AssociationService', () => {
  const db = {
    association: {
      findUniqueOrThrow: sinon.stub()
    }
  }

  const createAssociationDTO: CreateAssociationDTO = {
    name: 'test01',
    globalName: 'test01',
    initial: 'test01',
    parentId: 2
  }

  const updateAssociationDTO: UpdateAssociationDTO = {
    name: 'test01',
    globalName: 'test01',
    initial: 'test01',
    parentId: 2
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
    getAssociation: sinon.stub(),
    getAssociations: sinon.stub()
  }

  const mockCreateAssociationService = {
    createAssociation: sinon.stub()
  }

  const mockUpdateAssociationService = {
    updateAssociation: sinon.stub()
  }

  const mockDeleteAssociationService = {
    deleteAssociation: sinon.stub()
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
          provide: 'CreateAssociationService',
          useValue: mockCreateAssociationService
        },
        {
          provide: 'UpdateAssociationService',
          useValue: mockUpdateAssociationService
        },
        {
          provide: 'DeleteAssociationService',
          useValue: mockDeleteAssociationService
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

  describe('getAssociations', () => {
    it('should return associations', async () => {
      // given
      const page = 1
      const limit = 10
      mockGetAssociationService.getAssociations.resolves(associations)

      // when
      const result = await service.getAssociations(page, limit)

      // then
      expect(result).to.be.deep.equal(associations)
    })
  })

  describe('createAssociation', () => {
    it('should return association', async () => {
      // given
      mockCreateAssociationService.createAssociation.resolves(associations[0])

      // when
      const result = await service.createAssociation(createAssociationDTO)

      // then
      expect(result).to.be.deep.equal(associations[0])
    })
  })

  describe('updateAssociation', () => {
    it('should return association', async () => {
      // given
      const associationId = 1
      mockUpdateAssociationService.updateAssociation.resolves(associations[0])

      // when
      const result = await service.updateAssociation(
        associationId,
        updateAssociationDTO
      )

      // then
      expect(result).to.be.deep.equal(associations[0])
    })
  })

  describe('deleteAssociation', () => {
    it('should return associations', async () => {
      // given
      const associationId = 1
      mockDeleteAssociationService.deleteAssociation.resolves(associations[0])

      // when
      const result = await service.deleteAssociation(associationId)

      // then
      expect(result).to.be.deep.equal(associations[0])
    })
  })
})
