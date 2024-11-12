import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ResponseStatus } from 'src/config/response-status';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
  private readonly logger = new Logger(BadRequestFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = HttpStatus.BAD_REQUEST;

    const bodyMessage = exception.getResponse()['message'];

    this.logger.error(
      `Bad request exception message: ${JSON.stringify(bodyMessage)}`,
    );

    response.status(statusCode).json({
      statusCode: statusCode,
      status: ResponseStatus.ERROR,
      message: bodyMessage,
    });
  }
}
