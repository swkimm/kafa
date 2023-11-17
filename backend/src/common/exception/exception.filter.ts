import {
  type ExceptionFilter,
  Catch,
  type ArgumentsHost,
  HttpException
} from '@nestjs/common'

@Catch(HttpException)
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const status = exception.getStatus()

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response: (exception.getResponse() as any).message ?? exception.message
    })
  }
}
