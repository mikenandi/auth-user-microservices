import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, body } = request;

    const userAgent = request.get("user-agent") || "";

    this.logger.log(
      `Incoming request: ${method} ${originalUrl} - ${userAgent} ${ip}`,
    );

    if (Object.keys(body).length) {
      this.logger.log(`Request payload: ${JSON.stringify(body)}`);
    }

    next();
  }
}
