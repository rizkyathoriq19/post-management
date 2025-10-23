/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `user_sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refreshToken` to the `user_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_sessions" ADD COLUMN     "refreshToken" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_refreshToken_key" ON "user_sessions"("refreshToken");
