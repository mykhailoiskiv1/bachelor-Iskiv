/*
  Warnings:

  - You are about to drop the column `senderRole` on the `SupportMessage` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `SupportRequest` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `SupportMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupportMessage" DROP COLUMN "senderRole",
ADD COLUMN     "senderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SupportRequest" DROP COLUMN "message";

-- AddForeignKey
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
