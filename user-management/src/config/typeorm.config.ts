// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { ENV } from "./constants";

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: "postgres",
  host: configService.get<string>(ENV.DB_HOST),
  port: configService.get<number>(ENV.DB_PORT),
  username: configService.get<string>(ENV.DB_USERNAME),
  password: configService.get<string>(ENV.DB_PASSWORD),
  database: configService.get<string>(ENV.DB_DATABASE),
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: configService.get<boolean>(ENV.DB_SYNCHRONIZE) || false,
  //   migrations: ['src/migrations/*-migration.ts'],
  //   migrationsRun: false,
  logging: ["error", "warn"],
});
