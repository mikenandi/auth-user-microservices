import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./stratergy";

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtStrategy],
})
export class AuthModule {}
