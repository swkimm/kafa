import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log']
  })

  const configService = app.get(ConfigService)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.use(cookieParser())
  app.enableCors({
    allowedHeaders: ['*'],
    exposedHeaders: ['authorization', 'Authorization'],
    credentials: true
  })

  app.setGlobalPrefix('api')

  await app.listen(configService.get<number>('PORT') || 4000)
}

bootstrap()
