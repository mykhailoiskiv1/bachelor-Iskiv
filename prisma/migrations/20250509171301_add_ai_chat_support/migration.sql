/*
  Warnings:

  - A unique constraint covering the columns `[userId,sessionKey]` on the table `AiChatThread` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AiChatThread_userId_sessionKey_key" ON "AiChatThread"("userId", "sessionKey");
