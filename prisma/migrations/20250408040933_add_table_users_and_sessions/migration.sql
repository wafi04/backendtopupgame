-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "whatsapp" VARCHAR(20),
    "balance" INTEGER NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "otp" VARCHAR(6),
    "api_key" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "last_payment_at" TIMESTAMP(3),
    "token" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "is_valid" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_used_at" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_username_balance_idx" ON "users"("username", "balance");

-- CreateIndex
CREATE INDEX "users_role_balance_idx" ON "users"("role", "balance");

-- CreateIndex
CREATE INDEX "users_whatsapp_otp_idx" ON "users"("whatsapp", "otp");

-- CreateIndex
CREATE INDEX "users_username_role_whatsapp_idx" ON "users"("username", "role", "whatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_is_valid_expires_at_idx" ON "sessions"("is_valid", "expires_at");

-- CreateIndex
CREATE INDEX "sessions_ip_address_user_agent_idx" ON "sessions"("ip_address", "user_agent");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
