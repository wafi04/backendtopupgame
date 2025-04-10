// model Session {
//   id          Int       @id @default(autoincrement()) @map("id")
//   userId      Int       @map("user_id")
//   token       String    @unique @map("token")
//   ipAddress   String?   @map("ip_address")
//   userAgent   String?   @map("user_agent")
//   device      String?   @map("device")
//   location    String?   @map("location")
//   isValid     Boolean   @default(true) @map("is_valid")
//   expiresAt   DateTime  @map("expires_at")
//   createdAt   DateTime  @default(now()) @map("created_at")
//   updatedAt   DateTime  @updatedAt @map("updated_at")
//   lastUsedAt  DateTime? @map("last_used_at")

//   user        Users     @relation(fields: [userId], references: [id], onDelete: Cascade)

//   @@index([userId])
//   @@index([token])
//   @@index([isValid, expiresAt])
//   @@index([ipAddress, userAgent])

//   @@map("sessions")
// }
export interface Session {
  id: number;
  userId: number;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  device?: string | null;
  location?: string | null;
  isValid: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string;
}
export interface User {
  // Basic Info
  id: number;
  name: string;
  username: string;
  email: string | null;
  password: string;
  whatsapp?: string | null;
  balance: number;
  role: string;
  is_deleted: boolean;

  // Authentication & Security
  otp?: string | null;
  otpExpires?: Date | null;
  apiKey?: string | null;
  token?: string | null;
  isVerified: boolean;
  isEmailVerified: boolean;
  verificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;

  // Login & Security
  failedLoginAttempts: number;
  lastLoginAt?: Date | null;
  isLocked: boolean;
  lockedUntil?: Date | null;
  status: string;

  // 2FA
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string | null;

  // Social Auth
  provider?: string | null;
  providerId?: string | null;

  // Timestamps
  createdAt: Date;
  updatedAt?: Date | null;
  lastPaymentAt?: Date | null;

  // Preferences
  receiveNotifications: boolean;
  language: string;

  // Relations (optional based on usage)
  sessions?: Session[];
}

// Additional utility types you might find useful:

// For creating new users (without auto-generated fields)
export type CreateUserInput = Omit<
  User,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'isVerified'
  | 'isEmailVerified'
  | 'failedLoginAttempts'
  | 'isLocked'
  | 'lockedUntil'
  | 'balance'
> & {
  password: string; // Make password required
};

export type UpdateUserInput = Partial<
  Omit<User, 'id' | 'createdAt' | 'password' | 'email' | 'username'>
>;

export type SafeUser = Omit<
  User,
  | 'password'
  | 'otp'
  | 'otpExpires'
  | 'twoFactorSecret'
  | 'resetPasswordToken'
  | 'resetPasswordExpires'
  | 'failedLoginAttempts'
  | 'isLocked'
  | 'lockedUntil'
>;
