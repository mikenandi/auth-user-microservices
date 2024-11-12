import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

interface Role {
  id: string;
  name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get("JWT_SECRET"),
    });
  }

  async validate(payload: {
    sub: string;
    roles: Role[];
    iat: number;
    exp: number;
  }) {
    this.logger.log(`Starting JWT validation for user with ID: ${payload.sub}`);

    if (payload.roles && payload.roles.length > 0) {
      this.logger.log(
        `User roles extracted: ${payload.roles.map((role) => role.name).join(", ")}`,
      );
    } else {
      this.logger.warn(`No roles assigned to user with ID: ${payload.sub}.`);
    }

    const now = Date.now();
    if (payload.exp * 1000 < now) {
      this.logger.warn(`JWT has expired for user with ID: ${payload.sub}.`);
    }

    return { userId: payload.sub, roles: payload.roles };
  }
}
