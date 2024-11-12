import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { SigninDto } from "./dto/signin.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { In, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { Role } from "src/roles/entities/role.entity";
import { RpcException } from "@nestjs/microservices";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name); // Create a logger instance

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  private async signToken(user: User): Promise<{ access_token: string }> {
    this.logger.log(`Signing token for user ID: ${user.id}`);

    const payload = {
      sub: user.id,
      roles: user.roles,
    };

    const secret: string = this.config.get("JWT_SECRET");

    this.logger.log(`Signing token for user ${user.id}`);

    const token: string = await this.jwt.signAsync(payload, {
      expiresIn: "7d",
      secret,
    });

    this.logger.log(`Token successfully signed for user ${user.id}`);

    return { access_token: token };
  }

  async signin(inputs: SigninDto) {
    this.logger.log(`Signin attempt for email: ${inputs.email}`);

    try {
      const user = await this.userRepository.findOne({
        where: {
          email: inputs.email,
        },
        relations: ["roles"],
      });

      if (!user) {
        this.logger.warn(`User with email ${inputs.email} not found`);
        throw new UnauthorizedException("Credentials incorrect");
      }

      this.logger.log(
        `User with email ${inputs.email} found, verifying password`,
      );

      const matchPassword: boolean = await argon.verify(
        user.password,
        inputs.password,
      );

      if (!matchPassword) {
        this.logger.warn(`Invalid password attempt for email: ${inputs.email}`);
        throw new UnauthorizedException("Credentials incorrect");
      }

      this.logger.log(
        `Signin successful for user ${user.id} with email: ${inputs.email}`,
      );

      return this.signToken(user);
    } catch (error) {
      this.logger.error(
        `Signin failed for email: ${inputs.email}. Error: ${error.message}`,
        error.stack,
      );

      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    this.logger.log(
      `Attempting to create user with email: ${createUserDto.email}`,
    );

    try {
      const userRoles = await this.roleRepository.find({
        where: {
          name: In(createUserDto.roles),
        },
      });

      if (userRoles.length === 0) {
        this.logger.warn("Some roles provided do not exist");
        throw new RpcException("Some roles provided do not exist");
      }

      this.logger.log(`Roles found: ${JSON.stringify(userRoles)}`);

      const password = await argon.hash(createUserDto.password);

      const newUser = this.userRepository.create({
        ...createUserDto,
        password,
        roles: userRoles,
      });

      const savedUser = await this.userRepository.save(newUser);

      this.logger.log(`User created with ID: ${savedUser.id}`);

      return { success: true, userId: savedUser.id };
    } catch (error) {
      if (error instanceof RpcException) {
        this.logger.error(`Error during user creation: ${error.message}`);
        throw error;
      }
      this.logger.error(`Error during user creation: ${error.message}`);
      throw new RpcException("Failed to create user");
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`Attempting to update user with ID: ${id}`);

    try {
      const { roles: roleNames, password: newPassword } = updateUserDto;

      const existingUser = await this.userRepository.findOne({
        where: { id },
        relations: ["roles"],
      });

      if (!existingUser) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new RpcException(`User with ID ${id} not found`);
      }

      this.logger.log(`Found user with ID: ${id}, updating roles and details`);

      if (roleNames && roleNames.length > 0) {
        const userRoles = await this.roleRepository.find({
          where: { name: In(roleNames) },
        });

        if (userRoles.length !== roleNames.length) {
          this.logger.warn("Some roles provided do not exist");
          throw new RpcException("Some roles provided do not exist");
        }

        this.logger.log(`Roles to be assigned: ${JSON.stringify(userRoles)}`);
        existingUser.roles = userRoles;
      }

      if (newPassword) {
        this.logger.log(`Hashing new password for user ID: ${id}`);
        existingUser.password = await argon.hash(newPassword);
      }

      Object.assign(existingUser, updateUserDto);

      const updatedUser = await this.userRepository.save(existingUser);

      this.logger.log(`User with ID ${updatedUser.id} updated successfully`);

      return { success: true, userId: updatedUser.id };
    } catch (error) {
      if (error instanceof RpcException) {
        this.logger.error(`Error during user update: ${error.message}`);
        throw error;
      }
      this.logger.error(`Error during user update: ${error.message}`);
      throw new RpcException("Failed to update user");
    }
  }
}
