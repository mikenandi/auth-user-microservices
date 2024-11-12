import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name); // Create a logger instance

  constructor(
    private config: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; iat: number; exp: number }) {
    this.logger.log('Validating JWT payload'); // Log when the validation starts

    try {
      const user = await this.userRepository.findOneBy({
        id: payload.sub,
      });

      if (!user) {
        this.logger.warn(`User with id ${payload.sub} not found`); // Log a warning if the user is not found
        return null; // Returning null will reject the JWT token
      }

      // Remove the password before returning the user
      delete user.password;

      this.logger.log(`User with id ${payload.sub} validated successfully`); // Log a success message

      return user;
    } catch (error) {
      this.logger.error(
        `Error validating user with id ${payload.sub}: ${error.message}`,
        error.stack,
      ); // Log errors
      throw error; // Propagate the error to be handled by NestJS
    }
  }
}
