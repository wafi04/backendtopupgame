import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './modules/auth-controller';
import { AuthService } from './modules/auth-service';
import { SessionService } from './modules/sesion.service';

@Module({
  controllers: [AuthController],
  providers: [JwtService, ConfigService, AuthService, SessionService],
})
export class AuthServiceModule {}
