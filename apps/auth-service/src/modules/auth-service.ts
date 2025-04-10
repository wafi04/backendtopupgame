import { PrismaService } from 'libs/prisma/prisma.service';
import { CreateUser } from '../dto/create.user.dto';
import { generateApiKey } from 'utils/generate';
import { ERROR_CODES } from 'common/constants/error.codes';
import * as bcrypt from 'bcrypt';
import { SessionService } from './sesion.service';
import { User } from 'common/interfaces/auth.interface';
import { CreateSessions } from '../dto/create.sessions';
import { CookieService } from '../helpers/cookie.service';
import { Response } from 'express';
export class AuthService {
  // Number of salt rounds for bcrypt (10-12 is recommended)
  private readonly SALT_ROUNDS = 10;

  constructor(
    private prismaService: PrismaService,
    private sessionService: SessionService,
    private cookieService: CookieService,
  ) {}

  /**
   * Hashes a plain text password
   * @param password Plain text password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.SALT_ROUNDS);
    } catch (error) {
      throw ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Compares a plain text password with a hashed password
   * @param plainTextPassword
   * @param hashedPassword
   * @returns Boolean indicating if passwords match
   */
  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainTextPassword, hashedPassword);
    } catch (error) {
      throw ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }

  async createUser(req: CreateUser) {
    try {
      // Check if email exists
      const existingUserByEmail = await this.findByEmail(req.email);
      if (existingUserByEmail) {
        throw ERROR_CODES.EMAIL_ALREADY_EXISTS;
      }

      // Check if username exists
      const existingUserByUsername = await this.findByUsername(req.username);
      if (existingUserByUsername) {
        throw ERROR_CODES.USERNAME_ALREADY_EXISTS;
      }

      // Hash the password before storing
      const hashedPassword = await this.hashPassword(req.password);

      // Create new user
      const newUser = await this.prismaService.users.create({
        data: {
          name: req.fullName,
          password: hashedPassword,
          username: req.username,
          isVerified: false,
          balance: 0,
          role: 'Member',
          email: req.email,
          apiKey: generateApiKey(10),
          language: 'id-ID',
        },
      });

      const { password, ...userWithoutPassword } = newUser;

      return {
        success: true,
        data: userWithoutPassword,
        message: 'User created successfully',
      };
    } catch (error) {
      if (Object.values(ERROR_CODES).includes(error)) {
        throw error;
      }
      throw ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Authenticates a user by username and password
   * @param username
   * @param password
   * @returns User data without password if authentication succeeds
   * @throws ERROR_CODES.USER_NOT_FOUND or ERROR_CODES.UNAUTHORIZED
   */
  async login(username: string, password: string, sessionData: CreateSessions) {
    try {
      const user = await this.findByUsername(username);
      if (!user) {
        throw ERROR_CODES.USER_NOT_FOUND;
      }

      // Check if account is locked
      if (user.isLocked && (user.lockedUntil as Date) > new Date()) {
        throw ERROR_CODES.ACCOUNT_LOCKED;
      }

      // Verify password
      const isPasswordValid = await this.comparePasswords(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        // Increment failed attempts
        await this.recordFailedLoginAttempt(user);
        throw ERROR_CODES.UNAUTHORIZED;
      }

      await this.prismaService.users.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0 },
      });

      // Create session
      const session = await this.sessionService.createSession(
        sessionData,
        user.username,
        user.email,
        user.role,
        user.id,
      );

      // Don't return the hashed password
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        token: session.accessToken,
        expiresAt: session.expiresAt,
      };
    } catch (error) {
      if (Object.values(ERROR_CODES).includes(error)) {
        throw error;
      }
      throw ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }

  private async recordFailedLoginAttempt(user: User) {
    const attempts = user.failedLoginAttempts + 1;
    const maxAttempts = 5;

    const updateData: any = {
      failedLoginAttempts: attempts,
    };

    if (attempts >= maxAttempts) {
      const lockDuration = 30 * 60 * 1000;
      updateData.isLocked = true;
      updateData.lockedUntil = new Date(Date.now() + lockDuration);
    }

    await this.prismaService.users.update({
      where: { id: user.id },
      data: updateData,
    });
  }

  async findByEmail(email: string) {
    try {
      return await this.prismaService.users.findUnique({
        where: { email },
      });
    } catch (error) {
      throw ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }

  async findByUsername(username: string) {
    try {
      return await this.prismaService.users.findUnique({
        where: { username },
      });
    } catch (error) {
      throw ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }

  async deleteUser(username: string) {
    try {
      const user = await this.findByUsername(username);
      if (!user) {
        throw ERROR_CODES.USER_NOT_FOUND;
      }

      if (user.is_deleted) {
        return {
          success: true,
          message: 'User was already deleted',
        };
      }

      await this.prismaService.users.update({
        where: { username },
        data: { is_deleted: true },
      });

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      if (Object.values(ERROR_CODES).includes(error)) {
        throw error;
      }
      throw ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }
}
