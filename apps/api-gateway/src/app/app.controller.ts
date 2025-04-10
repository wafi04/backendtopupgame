import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import {
  CreateUser,
  LoginUser,
} from 'apps/auth-service/src/dto/create.user.dto';
import { CreateSessions } from 'apps/auth-service/src/dto/create.sessions';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('login')
  async login(
    @Body() data: { credentials: LoginUser; session: CreateSessions },
  ) {
    const login = this.authClient.send('login', data);
    console.log(login);
    return login;
  }

  @Post('register')
  async Register(@Body() createUser: CreateUser) {
    try {
      const register = await firstValueFrom(
        this.authClient.send('register', createUser),
      );
      return register;
    } catch (error) {
      throw error;
    }
  }
}
