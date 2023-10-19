import { Controller, Get } from '@nestjs/common'
import { Public } from '@/common/decorator/guard.decorator'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/test')
  healthCheck(): string {
    return this.appService.healthCheck()
  }
}
