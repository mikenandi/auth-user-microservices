import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ResponseMsg } from 'src/config/response-msg';
import { ResponseStatus } from 'src/config/response-status';

@Catch(UnauthorizedException)
export class UnathorizedRequestFilter implements ExceptionFilter {
  private readonly logger = new Logger(UnathorizedRequestFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    const statusCode = HttpStatus.UNAUTHORIZED;

    const bodyMessage = exception.getResponse()['message'];

    this.logger.error(
      `Unauthorized request exception message: ${JSON.stringify(bodyMessage)}`,
    );

    response.status(statusCode).json({
      statusCode: statusCode,
      error: ResponseStatus.UNAUTHORIZED,
      message: ResponseMsg.UNAUTHORIZED,
    });
  }
}
