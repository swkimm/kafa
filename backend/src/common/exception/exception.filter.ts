import {
  type ExceptionFilter,
  Catch,
  type ArgumentsHost,
  HttpException,
  Logger
} from '@nestjs/common'

@Catch(HttpException)
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('KAFA')

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const status = exception.getStatus()

    if (status >= 500) {
      this.loggingError(exception, request)
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response: (exception.getResponse() as any).message ?? exception.message
    })
  }

  private loggingError(exception: HttpException, request) {
    const logData = {
      errorType: exception.name,
      message: exception.message,
      path: `${request.method} ${request.url}`,
      stack: exception.stack,
      requestBody: request.body,
      user: request.user
        ? {
            id: request.user.id,
            username: request.user.username,
            role: request.user.role
          }
        : undefined
    }

    this.logger.error(JSON.stringify(logData))
  }
}
