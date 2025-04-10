import { PrismaService } from 'libs/prisma/prisma.service';
import { CreateSessions } from '../dto/create.sessions';
import * as jwt from 'jsonwebtoken';
import { ERROR_CODES } from 'common/constants/error.codes';

export class SessionService {
  constructor(
    private prismaService: PrismaService,
    private readonly jwtSecret: string = process.env.JWT_SECRET as string,
    private readonly jwtExpiresIn: string = process.env.JWT_EXPIRES_IN ||
      '8400',
  ) {}

  /**
   * Generate JWT Token
   * @param payload Data to include in token
   * @returns JWT token
   */
  private generateToken(payload: object): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: parseInt(this.jwtExpiresIn),
    });
  }

  /**
   * Verify JWT Token
   * @param token JWT token to verify
   * @returns Decoded token payload
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw ERROR_CODES.UNAUTHORIZED;
    }
  }

  /**
   * Create new session and generate token
   * @param req Session details
   * @param username User's username
   * @param email User's email
   * @param role User's role
   * @returns Created session with token
   */
  async createSession(
    req: CreateSessions,
    username: string,
    email: string | null,
    role: string,
    userId: number,
  ) {
    try {
      // Generate JWT token
      const token = this.generateToken({
        userId,
        username,
        email,
        role,
        ip: req.ipAddress,
        device: req.device,
      });

      // Calculate expiration date (1 day from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 1);

      // Create session in database
      const session = await this.prismaService.write.session.create({
        data: {
          userId,
          token,
          ipAddress: req.ipAddress,
          userAgent: req.userAggent,
          device: req.device,
          location: req.location,
          expiresAt,
          lastUsedAt: new Date(),
        },
      });

      // Also update user's last login
      await this.prismaService.write.users.update({
        where: { id: userId },
        data: {
          lastLoginAt: new Date(),
          failedLoginAttempts: 0,
          isLocked: false,
          lockedUntil: null,
          status: 'active',
        },
      });

      return {
        success: true,
        accessToken: token,
        sessionId: session.id,
        expiresAt: session.expiresAt,
      };
    } catch (error) {
      console.error('Error creating session:', error);
      if (Object.values(ERROR_CODES).includes(error)) {
        throw error;
      }
      throw ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Validate and refresh session token
   * @param token Current JWT token
   * @returns New token if valid
   */
  async refreshToken(token: string) {
    try {
      // Verify current token
      const decoded = this.verifyToken(token);

      // Find session in database
      const session = await this.prismaService.session.findFirst({
        where: { token, isValid: true },
      });

      if (!session || new Date(session.expiresAt) < new Date()) {
        throw ERROR_CODES.UNAUTHORIZED;
      }

      // Generate new token
      const newToken = this.generateToken({
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
        ip: decoded.ip,
        device: decoded.device,
      });

      // Update session in database
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 1);

      await this.prismaService.session.update({
        where: { id: session.id },
        data: {
          token: newToken,
          expiresAt: newExpiresAt,
          lastUsedAt: new Date(),
        },
      });

      return {
        success: true,
        token: newToken,
        expiresAt: newExpiresAt,
      };
    } catch (error) {
      if (Object.values(ERROR_CODES).includes(error)) {
        throw error;
      }
      throw ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Invalidate session (logout)
   * @param token Session token to invalidate
   */
  async invalidateSession(token: string) {
    try {
      await this.prismaService.session.updateMany({
        where: { token },
        data: {
          isValid: false,
          updatedAt: new Date(),
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error invalidating session:', error);
      throw ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Get all active sessions for a user
   * @param userId User ID
   */
  async getUserSessions(userId: number) {
    try {
      return await this.prismaService.session.findMany({
        where: {
          userId,
          isValid: true,
          expiresAt: { gt: new Date() },
        },
        orderBy: { lastUsedAt: 'desc' },
      });
    } catch (error) {
      console.error('Error getting user sessions:', error);
      throw ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }
}
