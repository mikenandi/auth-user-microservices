import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeedService } from './seed.service';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../auth/entities/user.entity';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { Permission } from 'src/roles/entities/permissions.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Role, Permission]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
