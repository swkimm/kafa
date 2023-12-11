import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

/**
 * Prisma ORM을 초기화 하는 클래스.
 * env에 있는 DATABSE_URL을 사용하여 DB와 연결을 생성한다.
 */
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL')
        }
      }
    })
  }
}
