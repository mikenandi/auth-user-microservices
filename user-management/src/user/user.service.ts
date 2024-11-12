import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Client, ClientProxy, Transport } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Client({
    transport: Transport.TCP,
    options: {
      host: "localhost",
      port: 4000,
    },
  })
  private authClient: ClientProxy;

  async create(createUserDto: CreateUserDto) {
    this.logger.log("Initiating user creation process");

    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      this.logger.warn(`User with email ${createUserDto.email} already exists`);

      throw new BadRequestException(
        `User with ${createUserDto.email} already exists`,
      );
    }

    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    const authUser = await firstValueFrom(
      this.authClient.send({ cmd: "create_user" }, createUserDto),
    );
    this.logger.log(`Auth service responded: ${JSON.stringify(authUser)}`);

    this.logger.log(`User created locally with ID: ${savedUser.id}`);

    return savedUser;
  }

  // Find one user by ID
  async findOne(id: string) {
    this.logger.log(`Fetching user with ID: ${id}`);

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.logger.warn(`User with ID: ${id} not found`);
      throw new NotFoundException(`User with ID: ${id} not found`);
    }

    this.logger.log(`User found: ${user.id}`);
    return user;
  }

  // Update user
  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`Initiating update for user with ID: ${id}`);

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.logger.warn(`User with ID: ${id} not found for update`);
      throw new NotFoundException(`User with ID: ${id} not found`);
    }

    // Update the user locally in the database
    await this.userRepository.update(id, updateUserDto);
    this.logger.log(`User updated locally with ID: ${id}`);

    try {
      await firstValueFrom(
        this.authClient.send({ cmd: "update_user" }, { id, ...updateUserDto }),
      );
      this.logger.log(`Auth service updated for user with ID: ${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to update user in auth service: ${error.message}`,
      );
      throw new BadRequestException("Failed to update user in auth service");
    }

    return { id, ...updateUserDto };
  }

  // Remove user (soft delete)
  async remove(id: string) {
    this.logger.log(`Initiating removal of user with ID: ${id}`);

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.logger.warn(`User with ID: ${id} not found for deletion`);
      throw new NotFoundException(`User with ID: ${id} not found`);
    }

    // Mark the user as deleted (soft delete)
    await this.userRepository.update(id, { isDeleted: true });
    this.logger.log(`User marked as deleted locally with ID: ${id}`);

    return { message: `User with ID: ${id} has been deleted` };
  }
}
