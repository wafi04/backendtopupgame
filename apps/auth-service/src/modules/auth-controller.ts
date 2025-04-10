import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth-service';
import { CreateUser, LoginUser } from '../dto/create.user.dto';
import { CreateSessions } from '../dto/create.sessions';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register')
  async register(@Payload() data: CreateUser) {
    try {
      return await this.authService.createUser(data);
    } catch (error) {
      return {
        success: false,
        error: error.error || 'Registration failed',
        code: error.code || 500,
      };
    }
  }

  @MessagePattern('login')
  async login(
    @Payload() data: { credentials: LoginUser; session: CreateSessions },
  ) {
    try {
      return await this.authService.login(
        data.credentials.username,
        data.credentials.password,
        data.session,
      );
    } catch (error) {
      return {
        success: false,
        error: error.error || 'Login failed',
        code: error.code || 401,
      };
    }
  }
}
