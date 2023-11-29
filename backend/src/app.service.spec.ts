import { Test, type TestingModule } from '@nestjs/testing'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import { AppService } from './app.service'

describe('RegisterTeamService', () => {
  let service: AppService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService]
    }).compile()

    service = module.get<AppService>(AppService)

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should defined', () => {
    expect(service).not.to.be.undefined
  })

  describe('healthCheck', () => {
    it('should return ok', () => {
      // when
      const result = service.healthCheck()

      // then
      expect(result).to.be.deep.equal('ok')
    })
  })
})
