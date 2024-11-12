import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SigninDto } from './dto/signin.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiResponse({ status: 200, description: 'users has signed in' })
  @ApiResponse({ status: 403, description: 'Forbiden exception' })
  async signin(@Body() inputs: SigninDto) {
    return await this.authService.signin(inputs);
  }

  @MessagePattern({ cmd: 'create_user' })
  async handleCreateUser(@Payload() createUserDto: CreateUserDto) {
    try {
      const result = await this.authService.createUser(createUserDto);
      return {
        success: true,
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      throw new RpcException('Failed to create user');
    }
  }

  @MessagePattern({ cmd: 'update_user' })
  async handleUpdateUser(
    @Payload() data: { id: string; updateUserDto: UpdateUserDto },
  ) {
    const { id, updateUserDto } = data;
    try {
      const result = await this.authService.updateUser(id, updateUserDto);
      return {
        success: true,
        message: 'User updated successfully',
        data: result,
      };
    } catch (error) {
      throw new RpcException('Failed to update user');
    }
  }
}
