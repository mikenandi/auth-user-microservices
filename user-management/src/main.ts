// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { WinstonModule } from "nest-winston";
import { winstonLoggerInstance } from "./logger/winston-logger";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.MICROSERVICE_HOST || "127.0.0.1",
        port: parseInt(process.env.MICROSERVICE_PORT) || 4002,
      },
      logger: WinstonModule.createLogger({
        instance: winstonLoggerInstance,
      }),
    },
  );

  const restApp = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 3002;

  const config = new DocumentBuilder()
    .setTitle("User management service API")
    .setDescription("API documentation for the user management service")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(restApp, config);
  SwaggerModule.setup("api-docs", restApp, document);

  await app.listen();
  await restApp.listen(port);
}

bootstrap();
