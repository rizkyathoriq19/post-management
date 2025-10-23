/*
  Warnings:

  - You are about to drop the column `createdAt` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refresh_token]` on the table `user_sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token` to the `user_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_sessions" DROP CONSTRAINT "user_sessions_userId_fkey";

-- DropIndex
DROP INDEX "public"."user_sessions_refreshToken_key";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_sessions" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "refreshToken",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "is_revoked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refresh_token" TEXT NOT NULL,
ADD COLUMN     "revoked_at" TIMESTAMP(3),
ADD COLUMN     "user_agent" TEXT,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_refresh_token_key" ON "user_sessions"("refresh_token");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
