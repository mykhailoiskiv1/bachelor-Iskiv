/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `AiChatThread` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AiChatThread` table. All the data in the column will be lost.
  - Changed the type of `sender` on the `AiChatMessage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `sessionKey` on table `AiChatThread` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AiChatThread" DROP CONSTRAINT "AiChatThread_userId_fkey";

-- DropIndex
DROP INDEX "AiChatThread_userId_sessionKey_key";

-- AlterTable
ALTER TABLE "AiChatMessage" DROP COLUMN "sender",
ADD COLUMN     "sender" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AiChatThread" DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ALTER COLUMN "sessionKey" SET NOT NULL;

-- DropEnum
DROP TYPE "AiChatSender";
