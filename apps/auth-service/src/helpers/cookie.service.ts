import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CookieOptions } from 'express';
import { AuthTokens, TokenPayload } from '../types';

export interface TokenCookieConfig {
  username: string;
  role: string;
  email: string;
  isAccessToken: boolean;
}

@Injectable()
export class CookieService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private readonly logger = new Logger(CookieService.name);
  generateTokens(payload: TokenPayload): AuthTokens {
    try {
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.accessToken.secret'),
        expiresIn: this.configService.get<string>('jwt.accessToken.expiresIn'),
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.refreshToken.secret'),
        expiresIn: this.configService.get<string>('jwt.refreshToken.expiresIn'),
      });

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('Error generating tokens:', error);
      throw new InternalServerErrorException(
        `Error generating tokens: ${error.message}`,
      );
    }
  }
  private getCookieOptions(isAccessToken: boolean): CookieOptions {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      domain: 'localhost',
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
      maxAge: isAccessToken ? 1 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
    };
  }

  setCookies(
    response: Response,
    tokens: { accessToken: string; refreshToken: string },
  ): void {
    try {
      // Set Access Token Cookie
      response.cookie(
        'access_token',
        tokens.accessToken,
        this.getCookieOptions(true),
      );

      // Set Refresh Token Cookie
      response.cookie(
        'refresh_token',
        tokens.refreshToken,
        this.getCookieOptions(false),
      );
    } catch (error) {
      this.logger.error('Error setting cookies', error);
      throw new Error('Failed to set authentication cookies');
    }
  }

  clearTokenCookies(res: Response): void {
    try {
      // Clear both access and refresh tokens
      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.APP_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      };

      res.clearCookie('access_token', cookieOptions);
      res.clearCookie('refresh_token', cookieOptions);
    } catch (error) {
      this.logger.error('Error clearing cookies', error);
      throw new Error('Failed to clear authentication cookies');
    }
  }

  extractTokenFromCookie(
    req: Request,
    tokenType: 'access_token' | 'refresh_token',
  ): string | null {
    try {
      const cookies = (req as any).cookies;
      return cookies?.[tokenType] || null;
    } catch (error) {
      this.logger.error('Error extracting token from cookie', error);
      return null;
    }
  }
}
