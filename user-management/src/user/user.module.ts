import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { AUTH_SERVICE_CLIENT, ENV } from "src/config/constants";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,

    {
      provide: AUTH_SERVICE_CLIENT,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get(ENV.AUTH_SERVICE_HOST),
            port: configService.get(ENV.AUTH_SERVICE_PORT),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class UserModule {}
