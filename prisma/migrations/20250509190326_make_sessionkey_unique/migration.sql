/*
  Warnings:

  - A unique constraint covering the columns `[sessionKey]` on the table `AiChatThread` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AiChatThread_sessionKey_key" ON "AiChatThread"("sessionKey");
